import { useEffect, useState } from 'react';
import { Package, CheckCircle2, Truck, TrendingUp, ArrowRight, MapPin, User, Phone, Weight, Calendar, Flag, FileText, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { fetchOperatorActiveOrder, fetchOperatorOrders, advanceOrderStatus } from '@/services/api';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import StatusTracker from '@/components/StatusTracker';
import EmptyState from '@/components/EmptyState';
import { CardSkeleton, LoadingSpinner } from '@/components/Loading';
import { formatDateTime, formatDate, getNextStatus } from '@/utils';
import type { Order, OrderStatus } from '@/types';

interface OperatorDashboardProps {
  onViewOrder: (orderId: string) => void;
  onNavigate: (page: string) => void;
}

const NEXT_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'Accept Order',
  ASSIGNED: 'Accept Order',
  ACCEPTED: 'Mark Picked Up',
  PICKED_UP: 'Start Transit',
  IN_TRANSIT: 'Mark Delivered',
  DELIVERED: 'Complete Order',
  COMPLETED: '',
};

export default function OperatorDashboard({ onViewOrder, onNavigate }: OperatorDashboardProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    if (!profile) return;
    try {
      const [active, orders] = await Promise.all([
        fetchOperatorActiveOrder(profile.id),
        fetchOperatorOrders(profile.id),
      ]);
      setActiveOrder(active);
      setAllOrders(orders);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  const handleAdvance = async () => {
    if (!activeOrder || !profile) return;
    const nextStatus = getNextStatus(activeOrder.status);
    if (!nextStatus) return;
    setActionLoading(true);
    try {
      await advanceOrderStatus(activeOrder.id, nextStatus, profile.id);
      toast(`Order ${activeOrder.order_number} status updated to ${nextStatus.replace(/_/g, ' ')}`, 'success');
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update order status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const completedToday = allOrders.filter(
    (o) => o.status === 'COMPLETED' && o.completed_at && new Date(o.completed_at).toDateString() === new Date().toDateString()
  ).length;
  const totalCompleted = allOrders.filter((o) => o.status === 'COMPLETED').length;
  const successRate = allOrders.length > 0 ? Math.round((totalCompleted / allOrders.length) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <CardSkeleton />
      </div>
    );
  }

  const nextStatus = activeOrder ? getNextStatus(activeOrder.status) : null;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Current Order"
          value={activeOrder ? activeOrder.order_number : 'None'}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Today's Completed"
          value={completedToday.toString()}
          color="green"
        />
        <StatCard
          icon={<Truck className="w-5 h-5" />}
          label="Total Deliveries"
          value={totalCompleted.toString()}
          color="cyan"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Success Rate"
          value={`${successRate}%`}
          color="emerald"
        />
      </div>

      {/* Active Order */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
          {activeOrder && (
            <button
              onClick={() => onViewOrder(activeOrder.id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeOrder ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">ORDER</p>
                  <h3 className="text-xl font-bold text-gray-900">#{activeOrder.order_number}</h3>
                </div>
                <div className="flex gap-2">
                  <PriorityBadge priority={activeOrder.priority} />
                  <StatusBadge status={activeOrder.status} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow icon={<User className="w-4 h-4" />} label="Customer" value={activeOrder.customer_name} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={activeOrder.customer_phone} />
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Pickup" value={activeOrder.pickup_address} />
                <InfoRow icon={<Truck className="w-4 h-4" />} label="Delivery" value={activeOrder.delivery_address} />
                <InfoRow icon={<Package className="w-4 h-4" />} label="Package" value={activeOrder.package_type} />
                <InfoRow icon={<Weight className="w-4 h-4" />} label="Weight" value={`${activeOrder.package_weight} kg`} />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Order Date" value={formatDate(activeOrder.created_at)} />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Est. Delivery" value={formatDate(activeOrder.delivery_date)} />
              </div>

              {activeOrder.notes && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mb-1"><FileText className="w-3 h-3" /> Notes</p>
                  <p className="text-sm text-amber-800">{activeOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Progress tracker */}
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Delivery Progress</h4>
              <StatusTracker currentStatus={activeOrder.status} />
            </div>

            {/* Action button */}
            <div className="p-6">
              {nextStatus && nextStatus !== 'COMPLETED' ? (
                <button
                  onClick={handleAdvance}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-60"
                >
                  {actionLoading ? <LoadingSpinner size="sm" className="text-white" /> : (
                    <>
                      {NEXT_STATUS_LABEL[activeOrder.status]}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : nextStatus === 'COMPLETED' ? (
                <button
                  onClick={handleAdvance}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-60"
                >
                  {actionLoading ? <LoadingSpinner size="sm" className="text-white" /> : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Order
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 px-4 py-3.5 bg-green-50 rounded-xl text-green-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Order Completed Successfully
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <EmptyState
              icon="package"
              title="No Active Order"
              description="You currently don't have an active delivery. New orders will appear here when assigned by admin."
            />
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => onNavigate('order-history')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {allOrders.length === 0 ? (
            <EmptyState icon="inbox" title="No Orders Yet" description="Your order history will appear here." />
          ) : (
            <div className="divide-y divide-gray-50">
              {allOrders.slice(0, 5).map((order) => (
                <button
                  key={order.id}
                  onClick={() => onViewOrder(order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">#{order.order_number}</p>
                      <p className="text-xs text-gray-400 truncate">{order.pickup_address} → {order.delivery_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:block">{formatDate(order.created_at)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
