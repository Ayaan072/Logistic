import { useEffect, useState } from 'react';
import { User, MapPin, Package, Calendar, Flag, FileText, Truck, Clock, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import StatusTracker from '@/components/StatusTracker';
import { LoadingSpinner } from '@/components/Loading';
import { fetchOrderById, fetchOrderStatusHistory } from '@/services/api';
import { formatDateTime, formatDate } from '@/utils';
import type { Order, OrderStatusHistory } from '@/types';

interface OrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
}

export default function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    Promise.all([fetchOrderById(orderId), fetchOrderStatusHistory(orderId)])
      .then(([o, h]) => {
        setOrder(o);
        setHistory(h);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <Modal open={!!orderId} onClose={onClose} title="Order Details" size="xl">
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !order ? (
        <p className="text-center text-gray-500 py-8">Order not found.</p>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 font-medium">ORDER</p>
              <h3 className="text-xl font-bold text-gray-900">#{order.order_number}</h3>
            </div>
            <div className="flex gap-2">
              <PriorityBadge priority={order.priority} />
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Progress tracker */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Delivery Progress</h4>
            <StatusTracker currentStatus={order.status} />
          </div>

          {/* Info grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Customer info */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Customer Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{order.customer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{order.customer_phone}</span>
                </div>
              </div>
            </div>

            {/* Package info */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                Package Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{order.package_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium text-gray-900">{order.package_weight} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Priority</span>
                  <PriorityBadge priority={order.priority} />
                </div>
              </div>
            </div>

            {/* Pickup */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Pickup Location
              </h4>
              <p className="text-sm text-gray-700">{order.pickup_address}</p>
            </div>

            {/* Delivery */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-500" />
                Delivery Location
              </h4>
              <p className="text-sm text-gray-700">{order.delivery_address}</p>
            </div>
          </div>

          {/* Additional details */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Created</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Est. Delivery</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(order.delivery_date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Operator</p>
                <p className="text-sm font-medium text-gray-900">{order.operator?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Flag className="w-3 h-3" /> Priority</p>
                <p className="text-sm font-medium text-gray-900">{order.priority}</p>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Notes</p>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Order Timeline
            </h4>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="relative">
                {history.map((entry, idx) => (
                  <div key={entry.id} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === history.length - 1 ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {idx < history.length - 1 && <div className="w-0.5 h-full bg-gray-200 flex-1 min-h-[20px]" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={entry.status} />
                        <span className="text-xs text-gray-400">{formatDateTime(entry.changed_at)}</span>
                      </div>
                      {entry.notes && <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>}
                      {entry.changed_by_profile && (
                        <p className="text-xs text-gray-400 mt-0.5">by {entry.changed_by_profile.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
