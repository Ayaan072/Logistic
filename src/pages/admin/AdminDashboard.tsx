import { useEffect, useState, useMemo } from 'react';
import { Package, Clock, Truck, CheckCircle2, Users, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { fetchAllOrders, fetchOperators, assignOrder } from '@/services/api';
import { StatusBadge, OperatorStatusBadge } from '@/components/Badges';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { CardSkeleton, TableSkeleton, LoadingSpinner } from '@/components/Loading';
import { formatDate } from '@/utils';
import type { Order, Profile, OrderStatus } from '@/types';

interface AdminDashboardProps {
  onViewOrder: (orderId: string) => void;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onViewOrder, onNavigate }: AdminDashboardProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [operators, setOperators] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModalOrder, setAssignModalOrder] = useState<Order | null>(null);
  const [assigning, setAssigning] = useState(false);

  const loadData = async () => {
    try {
      const [o, ops] = await Promise.all([fetchAllOrders(), fetchOperators()]);
      setOrders(o);
      setOperators(ops);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'NEW').length;
    const active = orders.filter((o) => ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(o.status)).length;
    const completed = orders.filter((o) => o.status === 'COMPLETED').length;
    const available = operators.filter((o) => o.status === 'AVAILABLE').length;
    const busy = operators.filter((o) => o.status === 'BUSY').length;
    return { total: orders.length, pending, active, completed, available, busy };
  }, [orders, operators]);

  const recentOrders = orders.slice(0, 6);
  const availableOperators = operators.filter((o) => o.status === 'AVAILABLE');

  const handleAssign = async (operatorId: string) => {
    if (!assignModalOrder || !profile) return;
    setAssigning(true);
    try {
      await assignOrder(assignModalOrder.id, operatorId, profile.id);
      toast(`Order ${assignModalOrder.order_number} assigned successfully`, 'success');
      setAssignModalOrder(null);
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to assign order', 'error');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminStatCard icon={<Package className="w-5 h-5" />} label="Total Orders" value={stats.total} color="blue" />
        <AdminStatCard icon={<Clock className="w-5 h-5" />} label="Pending Orders" value={stats.pending} color="yellow" />
        <AdminStatCard icon={<Truck className="w-5 h-5" />} label="Active Orders" value={stats.active} color="orange" />
        <AdminStatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Completed" value={stats.completed} color="green" />
        <AdminStatCard icon={<UserCheck className="w-5 h-5" />} label="Available Operators" value={stats.available} color="emerald" />
        <AdminStatCard icon={<Users className="w-5 h-5" />} label="Busy Operators" value={stats.busy} color="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => onNavigate('all-orders')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {recentOrders.length === 0 ? (
              <EmptyState icon="inbox" title="No Orders" description="Orders will appear here once created." />
            ) : (
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <button onClick={() => onViewOrder(order.id)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">#{order.order_number}</p>
                        <p className="text-xs text-gray-400 truncate">{order.customer_name} · {order.pickup_address.split(',')[0]} → {order.delivery_address.split(',')[0]}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:block">{formatDate(order.created_at)}</span>
                      <StatusBadge status={order.status} />
                      {order.status === 'NEW' && (
                        <button
                          onClick={() => setAssignModalOrder(order)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Operator status */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Operator Status</h2>
            <button
              onClick={() => onNavigate('operators')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {operators.map((op) => (
                <div key={op.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                      {op.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{op.name}</p>
                      <p className="text-xs text-gray-400">{op.employee_id}</p>
                    </div>
                  </div>
                  <OperatorStatusBadge status={op.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats / analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Delivery Status Distribution</h3>
          <div className="space-y-3">
            {(['NEW', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'] as OrderStatus[]).map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const colors: Record<string, string> = {
                NEW: 'bg-yellow-500', ASSIGNED: 'bg-blue-500', ACCEPTED: 'bg-purple-500',
                PICKED_UP: 'bg-cyan-500', IN_TRANSIT: 'bg-orange-500', DELIVERED: 'bg-green-500', COMPLETED: 'bg-emerald-600',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{status.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Operator Availability</h3>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              <p className="text-xs text-gray-400">Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.busy}</p>
              <p className="text-xs text-gray-400">Busy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-400">{operators.filter((o) => o.status === 'OFFLINE').length}</p>
              <p className="text-xs text-gray-400">Offline</p>
            </div>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-green-500" style={{ width: `${stats.available / operators.length * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${stats.busy / operators.length * 100}%` }} />
            <div className="bg-gray-300" style={{ width: `${operators.filter((o) => o.status === 'OFFLINE').length / operators.length * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Assign modal */}
      <Modal
        open={!!assignModalOrder}
        onClose={() => setAssignModalOrder(null)}
        title={`Assign Order #${assignModalOrder?.order_number}`}
        size="md"
      >
        {assignModalOrder && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600"><span className="font-medium">Customer:</span> {assignModalOrder.customer_name}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Route:</span> {assignModalOrder.pickup_address.split(',')[0]} → {assignModalOrder.delivery_address.split(',')[0]}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Package:</span> {assignModalOrder.package_type} ({assignModalOrder.package_weight} kg)</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Select an available operator:</p>
              {availableOperators.length === 0 ? (
                <EmptyState
                  icon="users"
                  title="No Available Operators"
                  description="All operators are currently busy. Complete an active order to free up an operator."
                />
              ) : (
                <div className="space-y-2">
                  {availableOperators.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => handleAssign(op.id)}
                      disabled={assigning}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {op.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{op.name}</p>
                          <p className="text-xs text-gray-400">{op.employee_id}</p>
                        </div>
                      </div>
                      {assigning ? <LoadingSpinner size="sm" /> : <OperatorStatusBadge status={op.status} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AdminStatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
