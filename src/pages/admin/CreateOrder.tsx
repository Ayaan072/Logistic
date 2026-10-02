import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Package, Weight, Flag, Calendar, FileText, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { createOrder, fetchOrderNumbers } from '@/services/api';
import { LoadingSpinner } from '@/components/Loading';
import { generateOrderNumber, isValidPhone } from '@/utils';
import type { Priority } from '@/types';

interface CreateOrderProps {
  onNavigate: (page: string) => void;
}

export default function CreateOrder({ onNavigate }: CreateOrderProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    pickup_address: '',
    delivery_address: '',
    package_type: '',
    package_weight: '',
    priority: 'MEDIUM' as Priority,
    delivery_date: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('ORD1001');

  useEffect(() => {
    fetchOrderNumbers().then((nums) => {
      setOrderNumber(generateOrderNumber(nums));
    }).catch(() => {});
  }, []);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) e.customer_name = 'Customer name is required';
    if (!form.customer_phone.trim()) e.customer_phone = 'Phone number is required';
    else if (!isValidPhone(form.customer_phone)) e.customer_phone = 'Enter a valid phone number';
    if (!form.pickup_address.trim()) e.pickup_address = 'Pickup address is required';
    if (!form.delivery_address.trim()) e.delivery_address = 'Delivery address is required';
    if (!form.package_type.trim()) e.package_type = 'Package type is required';
    const weight = parseFloat(form.package_weight);
    if (!form.package_weight || isNaN(weight) || weight <= 0) e.package_weight = 'Weight must be a positive number';
    if (!form.delivery_date) e.delivery_date = 'Delivery date is required';
    else {
      const d = new Date(form.delivery_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) e.delivery_date = 'Delivery date cannot be in the past';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createOrder({
        order_number: orderNumber,
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        pickup_address: form.pickup_address.trim(),
        delivery_address: form.delivery_address.trim(),
        package_type: form.package_type.trim(),
        package_weight: parseFloat(form.package_weight),
        priority: form.priority,
        delivery_date: form.delivery_date,
        notes: form.notes.trim() || null,
        operator_id: null,
        accepted_at: null,
        picked_up_at: null,
        in_transit_at: null,
        delivered_at: null,
        completed_at: null,
      });
      toast(`Order ${orderNumber} created successfully`, 'success');
      onNavigate('all-orders');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
      errors[field] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
    }`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Create New Order</h2>
        <p className="text-sm text-gray-500">Fill in the details below to create a new delivery order.</p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
          <span className="text-xs text-gray-500">Order ID:</span>
          <span className="text-sm font-bold text-blue-700">{orderNumber}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Customer */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="John Doe"
                className={inputClass('customer_name')}
              />
            </div>
            {errors.customer_name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.customer_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Phone *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                placeholder="+91-9876543210"
                className={inputClass('customer_phone')}
              />
            </div>
            {errors.customer_phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.customer_phone}</p>}
          </div>
        </div>

        {/* Addresses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pickup Address *</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={form.pickup_address}
              onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              placeholder="Mumbai Warehouse, Andheri East"
              className={inputClass('pickup_address')}
            />
          </div>
          {errors.pickup_address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.pickup_address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address *</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={form.delivery_address}
              onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
              placeholder="Pune Distribution Center, Hinjewadi"
              className={inputClass('delivery_address')}
            />
          </div>
          {errors.delivery_address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.delivery_address}</p>}
        </div>

        {/* Package */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Package Type *</label>
            <div className="relative">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.package_type}
                onChange={(e) => setForm({ ...form, package_type: e.target.value })}
                placeholder="Electronic Equipment"
                className={inputClass('package_type')}
              />
            </div>
            {errors.package_type && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.package_type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Package Weight (kg) *</label>
            <div className="relative">
              <Weight className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={form.package_weight}
                onChange={(e) => setForm({ ...form, package_weight: e.target.value })}
                placeholder="18"
                className={inputClass('package_weight')}
              />
            </div>
            {errors.package_weight && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.package_weight}</p>}
          </div>
        </div>

        {/* Priority & Date */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority *</label>
            <div className="relative">
              <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={form.delivery_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                className={inputClass('delivery_date')}
              />
            </div>
            {errors.delivery_date && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.delivery_date}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Special handling instructions, delivery preferences, etc."
              rows={3}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('all-orders')}
            className="px-5 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-60"
          >
            {submitting ? <LoadingSpinner size="sm" className="text-white" /> : (
              <>
                <Plus className="w-4 h-4" />
                Create Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
