import { useEffect, useState } from 'react';
import { User, Mail, Phone, BadgeCheck, Calendar, Package, CheckCircle2, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { fetchOperatorActiveOrder, fetchOperatorOrders, updateProfile } from '@/services/api';
import { OperatorStatusBadge } from '@/components/Badges';
import { LoadingSpinner } from '@/components/Loading';
import { formatDate } from '@/utils';
import type { Order } from '@/types';

export default function OperatorProfile() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setPhone(profile.phone || '');
    Promise.all([fetchOperatorActiveOrder(profile.id), fetchOperatorOrders(profile.id)])
      .then(([active, orders]) => {
        setActiveOrder(active);
        setCompletedCount(orders.filter((o) => o.status === 'COMPLETED').length);
      })
      .finally(() => setLoading(false));
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfile(profile.id, { name, phone });
      await refreshProfile();
      toast('Profile updated successfully', 'success');
      setEditing(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-cyan-500" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-blue-600">
              {profile.name.charAt(0)}
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {saving ? <LoadingSpinner size="sm" className="text-white" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900">
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-b border-gray-300 focus:border-blue-500 outline-none text-xl font-bold"
                />
              ) : (
                profile.name
              )}
            </h2>
            <OperatorStatusBadge status={profile.status} />
          </div>
          <p className="text-sm text-gray-400">{profile.role === 'ADMIN' ? 'Administrator' : 'Logistics Operator'}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={profile.email} />
          <DetailRow
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={editing ? (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-b border-gray-300 focus:border-blue-500 outline-none text-sm font-medium text-gray-900"
              />
            ) : (phone || '—')}
          />
          <DetailRow icon={<BadgeCheck className="w-4 h-4" />} label="Employee ID" value={profile.employee_id || '—'} />
          <DetailRow icon={<Calendar className="w-4 h-4" />} label="Joining Date" value={formatDate(profile.joining_date)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeOrder ? '1' : '0'}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active Order</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">Completed</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mx-auto mb-3">
            <User className="w-5 h-5 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">{profile.status.toLowerCase()}</p>
          <p className="text-xs text-gray-400 mt-0.5">Status</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
