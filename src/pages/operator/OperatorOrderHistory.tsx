import { useEffect, useState, useMemo } from 'react';
import { Search, Package, ArrowRight, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchOperatorOrders } from '@/services/api';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import EmptyState from '@/components/EmptyState';
import { TableSkeleton } from '@/components/Loading';
import { formatDate } from '@/utils';
import type { Order, OrderStatus } from '@/types';

interface OperatorOrderHistoryProps {
  onViewOrder: (orderId: string) => void;
}

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Pending', value: 'pending' },
];

export default function OperatorOrderHistory({ onViewOrder }: OperatorOrderHistoryProps) {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!profile) return;
    fetchOperatorOrders(profile.id)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profile]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.pickup_address.toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && ['NEW', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP'].includes(o.status)) ||
        o.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-white rounded-2xl border border-gray-100" />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer, or location..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={search ? 'search' : 'inbox'}
            title={search ? 'No Results Found' : 'No Order History'}
            description={search ? 'Try adjusting your search or filters.' : 'Your completed and past orders will appear here.'}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">#{order.order_number}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.package_type}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600 max-w-[200px] truncate">{order.pickup_address.split(',')[0]} → {order.delivery_address.split(',')[0]}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => onViewOrder(order.id)}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((order) => (
                <button
                  key={order.id}
                  onClick={() => onViewOrder(order.id)}
                  className="w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">#{order.order_number}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.customer_name}</p>
                  <p className="text-xs text-gray-400 truncate">{order.pickup_address.split(',')[0]} → {order.delivery_address.split(',')[0]}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
