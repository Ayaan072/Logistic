export type UserRole = 'ADMIN' | 'OPERATOR';

export type OperatorStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type OrderStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  employee_id: string | null;
  status: OperatorStatus;
  joining_date: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  delivery_address: string;
  package_type: string;
  package_weight: number;
  priority: Priority;
  delivery_date: string | null;
  notes: string | null;
  status: OrderStatus;
  operator_id: string | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  in_transit_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  operator?: Profile | null;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_by: string | null;
  changed_at: string;
  notes: string | null;
  changed_by_profile?: Profile | null;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  order_id: string | null;
  read: boolean;
  created_at: string;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'NEW',
  'ASSIGNED',
  'ACCEPTED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'COMPLETED',
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; borderColor: string; textColor: string; dot: string }
> = {
  NEW: {
    label: 'New',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  PICKED_UP: {
    label: 'Picked Up',
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    dot: 'bg-cyan-500',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    dot: 'bg-orange-500',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    dot: 'bg-green-500',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; bgColor: string; textColor: string }
> = {
  LOW: { label: 'Low', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  MEDIUM: { label: 'Medium', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  HIGH: { label: 'High', bgColor: 'bg-red-100', textColor: 'text-red-700' },
};

export const OPERATOR_STATUS_META: Record<
  OperatorStatus,
  { label: string; dot: string; bgColor: string; textColor: string }
> = {
  AVAILABLE: { label: 'Available', dot: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  BUSY: { label: 'Busy', dot: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  OFFLINE: { label: 'Offline', dot: 'bg-gray-400', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
};

export const ACTIVE_STATUSES: OrderStatus[] = ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

export function getStatusIndex(status: OrderStatus): number {
  return ORDER_STATUS_FLOW.indexOf(status);
}
