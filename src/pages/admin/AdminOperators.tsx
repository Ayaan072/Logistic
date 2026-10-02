import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Package, CheckCircle2, Phone, BadgeCheck, Mail } from 'lucide-react';
import { fetchOperators, fetchAllOrders, updateOperatorStatus } from '@/services/api';
import { OperatorStatusBadge } from '@/components/Badges';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { CardSkeleton, LoadingSpinner } from '@/components/Loading';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/utils';
import type { Profile, Order, OperatorStatus } from '@/types';

export default function AdminOperators() {
  const { toast } = useToast();
  const [operators, setOperators] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOperator, setDetailOperator] = useState<Profile | null>(null);
  const [operatorOrders, setOperatorOrders] = useState<Order[]>([]);
  const [statusModalOp, setStatusModalOp] = useState<Profile | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      const [ops, ords] = await Promise.all([fetchOperators(), fetchAllOrders()]);
      setOperators(ops);
      setOrders(ords);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load operators', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetail = (op: Profile) => {
    setDetailOperator(op);
    setOperatorOrders(orders.filter((o) => o.operator_id === op.id));
  };

  const handleStatusChange = async (newStatus: OperatorStatus) => {
    if (!statusModalOp) return;
    setUpdating(true);
    try {
      await updateOperatorStatus(statusModalOp.id, newStatus);
      toast(`${statusModalOp.name}'s status updated to ${newStatus.toLowerCase()}`, 'success');
      setStatusModalOp(null);
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const available = operators.filter((o) => o.status === 'AVAILABLE').length;
  const busy = operators.filter((o) => o.status === 'BUSY').length;
  const offline = operators.filter((o) => o.status === 'OFFLINE').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{available}</p>
          <p className="text-sm text-gray-400">Available</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <UserX className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{busy}</p>
          <p className="text-sm text-gray-400">Busy</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{offline}</p>
          <p className="text-sm text-gray-400">Offline</p>
        </div>
      </div>

      {/* Operator cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Operators</h2>
        {operators.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <EmptyState icon="users" title="No Operators" description="No operators have been registered yet." />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((op) => {
              const opOrders = orders.filter((o) => o.operator_id === op.id);
              const activeOrder = opOrders.find((o) => ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(o.status));
              const completed = opOrders.filter((o) => o.status === 'COMPLETED').length;

              return (
                <div key={op.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-lg font-bold text-blue-700">
                        {op.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{op.name}</p>
                        <p className="text-xs text-gray-400">{op.employee_id}</p>
                      </div>
                    </div>
                    <OperatorStatusBadge status={op.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{activeOrder ? '1' : '0'}</p>
                      <p className="text-xs text-gray-400">Active</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{completed}</p>
                      <p className="text-xs text-gray-400">Completed</p>
                    </div>
                  </div>

                  {activeOrder && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-600 font-medium">Current Order</p>
                      <p className="text-sm font-semibold text-blue-900">#{activeOrder.order_number}</p>
                      <p className="text-xs text-blue-500 truncate">{activeOrder.pickup_address.split(',')[0]} → {activeOrder.delivery_address.split(',')[0]}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(op)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setStatusModalOp(op)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!detailOperator} onClose={() => setDetailOperator(null)} title="Operator Details" size="md">
        {detailOperator && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                {detailOperator.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detailOperator.name}</h3>
                <OperatorStatusBadge status={detailOperator.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={<Mail className="w-4 h-4" />} label="Email" value={detailOperator.email} />
              <DetailItem icon={<Phone className="w-4 h-4" />} label="Phone" value={detailOperator.phone || '—'} />
              <DetailItem icon={<BadgeCheck className="w-4 h-4" />} label="Employee ID" value={detailOperator.employee_id || '—'} />
              <DetailItem icon={<BadgeCheck className="w-4 h-4" />} label="Joined" value={formatDate(detailOperator.joining_date)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Package className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{operatorOrders.filter((o) => ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(o.status)).length}</p>
                <p className="text-xs text-gray-400">Active Orders</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{operatorOrders.filter((o) => o.status === 'COMPLETED').length}</p>
                <p className="text-xs text-gray-400">Completed Orders</p>
              </div>
            </div>

            {operatorOrders.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Recent Orders</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {operatorOrders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{o.order_number}</p>
                        <p className="text-xs text-gray-400 truncate">{o.customer_name}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(o.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status change modal */}
      <Modal open={!!statusModalOp} onClose={() => setStatusModalOp(null)} title="Change Operator Status" size="sm">
        {statusModalOp && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Change status for <span className="font-semibold text-gray-900">{statusModalOp.name}</span>
            </p>
            <div className="space-y-2">
              {(['AVAILABLE', 'BUSY', 'OFFLINE'] as OperatorStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || statusModalOp.status === s}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <OperatorStatusBadge status={s} />
                  {statusModalOp.status === s && <span className="text-xs text-gray-400">Current</span>}
                </button>
              ))}
            </div>
            {updating && (
              <div className="flex justify-center">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
