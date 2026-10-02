import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, Package, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { fetchAllOrders, fetchOperators, assignOrder } from '@/services/api';
import { StatusBadge, PriorityBadge, OperatorStatusBadge } from '@/components/Badges';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { TableSkeleton, LoadingSpinner } from '@/components/Loading';
import { formatDate } from '@/utils';
import type { Order, Profile, OrderStatus } from '@/types';

interface AdminAllOrdersProps {
  onViewOrder: (orderId: string) => void;
  onNavigate: (page: string) => void;
}

export default function AdminAllOrders({ onViewOrder, onNavigate }: AdminAllOrdersProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [operators, setOperators] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignModalOrder, setAssignModalOrder] = useState<Order | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    Promise.all([fetchAllOrders(), fetchOperators()])
      .then(([o, ops]) => {
        setOrders(o);
        setOperators(ops);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadData = async () => {
    const [o, ops] = await Promise.all([fetchAllOrders(), fetchOperators()]);
    setOrders(o);
    setOperators(ops);
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.pickup_address.toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address.toLowerCase().includes(search.toLowerCase()) ||
        (o.operator?.name?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || o.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, search, statusFilter, priorityFilter]);

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
      <div className="space-y-4">
        <div className="h-16 bg-white rounded-2xl border border-gray-100" />
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer, operator, or location..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Status</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <button
            onClick={() => onNavigate('create-order')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Package className="w-4 h-4" />
            New Order
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={search ? 'search' : 'inbox'}
            title={search ? 'No Results Found' : 'No Orders'}
            description={search ? 'Try adjusting your search or filters.' : 'Create a new order to get started.'}
          />
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Operator</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-900">#{order.order_number}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-gray-700">{order.customer_name}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {order.operator ? (
                          <span className="text-sm text-gray-600">{order.operator.name}</span>
                        ) : (
                          <span className="text-sm text-gray-300">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-gray-500 max-w-[180px] truncate">{order.pickup_address.split(',')[0]} → {order.delivery_address.split(',')[0]}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <PriorityBadge priority={order.priority} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'NEW' && (
                            <button
                              onClick={() => setAssignModalOrder(order)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Assign
                            </button>
                          )}
                          <button
                            onClick={() => onViewOrder(order.id)}
                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium"
                          >
                            View <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-gray-50">
              {filtered.map((order) => (
                <div key={order.id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">#{order.order_number}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.customer_name}</p>
                  <p className="text-xs text-gray-400 truncate mb-2">{order.pickup_address.split(',')[0]} → {order.delivery_address.split(',')[0]}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={order.priority} />
                      {order.operator && <span className="text-xs text-gray-400">{order.operator.name}</span>}
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'NEW' && (
                        <button
                          onClick={() => setAssignModalOrder(order)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() => onViewOrder(order.id)}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-0.5"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
