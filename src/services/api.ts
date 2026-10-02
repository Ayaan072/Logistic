import { supabase } from '@/lib/supabase';
import type { Profile, Order, OrderStatusHistory, Notification } from '@/types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data || []) as Profile[];
}

export async function fetchOperators(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'OPERATOR')
    .order('name');
  if (error) throw error;
  return (data || []) as Profile[];
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}

export async function fetchOperatorActiveOrder(operatorId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, operator:profiles(*)')
    .eq('operator_id', operatorId)
    .in('status', ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'])
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function fetchOperatorOrders(operatorId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, operator:profiles(*)')
    .eq('operator_id', operatorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, operator:profiles(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, operator:profiles(*)')
    .eq('id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function fetchOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
  const { data, error } = await supabase
    .from('order_status_history')
    .select('*, changed_by_profile:profiles!changed_by(*)')
    .eq('order_id', orderId)
    .order('changed_at', { ascending: true });
  if (error) throw error;
  return (data || []) as OrderStatusHistory[];
}

export async function fetchUnassignedOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, operator:profiles(*)')
    .eq('status', 'NEW')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'status'> & { order_number: string }
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      status: 'NEW',
    })
    .select('*, operator:profiles(*)')
    .single();
  if (error) throw error;

  // Insert status history
  await supabase.from('order_status_history').insert({
    order_id: data.id,
    status: 'NEW',
    changed_by: null,
    notes: 'Order created',
  });

  return data as Order;
}

export async function assignOrder(orderId: string, operatorId: string, changedBy: string): Promise<void> {
  // Check operator doesn't have active order
  const active = await fetchOperatorActiveOrder(operatorId);
  if (active) {
    throw new Error('This operator is currently handling another order. Complete the current order before assigning a new one.');
  }

  const { error: orderError } = await supabase
    .from('orders')
    .update({ operator_id: operatorId, status: 'ASSIGNED', updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (orderError) throw orderError;

  const { error: histError } = await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: 'ASSIGNED',
    changed_by: changedBy,
    notes: 'Order assigned to operator',
  });
  if (histError) throw histError;

  const { error: notifError } = await supabase.from('notifications').insert({
    user_id: operatorId,
    message: `New order has been assigned to you.`,
    order_id: orderId,
    read: false,
  });
  if (notifError) throw notifError;

  await updateOperatorStatus(operatorId, 'BUSY');
}

export async function advanceOrderStatus(
  orderId: string,
  newStatus: Order['status'],
  changedBy: string,
  notes?: string
): Promise<void> {
  const updates: Record<string, string | null> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  const now = new Date().toISOString();
  if (newStatus === 'ACCEPTED') updates.accepted_at = now;
  if (newStatus === 'PICKED_UP') updates.picked_up_at = now;
  if (newStatus === 'IN_TRANSIT') updates.in_transit_at = now;
  if (newStatus === 'DELIVERED') updates.delivered_at = now;
  if (newStatus === 'COMPLETED') updates.completed_at = now;

  const { error: orderError } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);
  if (orderError) throw orderError;

  const { error: histError } = await supabase.from('order_status_history').insert({
    order_id: orderId,
    status: newStatus,
    changed_by: changedBy,
    notes: notes || `Status updated to ${newStatus}`,
  });
  if (histError) throw histError;

  if (newStatus === 'COMPLETED') {
    const { data: order } = await supabase
      .from('orders')
      .select('operator_id')
      .eq('id', orderId)
      .maybeSingle();
    if (order?.operator_id) {
      await updateOperatorStatus(order.operator_id, 'AVAILABLE');
    }
  }
}

export async function updateOperatorStatus(operatorId: string, status: 'AVAILABLE' | 'BUSY' | 'OFFLINE'): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', operatorId);
  if (error) throw error;
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []) as Notification[];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
}

export async function fetchOrderNumbers(): Promise<string[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('order_number');
  if (error) throw error;
  return (data || []).map((o) => o.order_number);
}
