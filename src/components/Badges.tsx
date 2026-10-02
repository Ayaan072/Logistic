import type { OrderStatus, Priority, OperatorStatus } from '@/types';
import { STATUS_META, PRIORITY_META, OPERATOR_STATUS_META } from '@/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bgColor} ${meta.borderColor} border ${meta.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${meta.bgColor} ${meta.textColor}`}>
      {meta.label}
    </span>
  );
}

export function OperatorStatusBadge({ status }: { status: OperatorStatus }) {
  const meta = OPERATOR_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bgColor} ${meta.textColor}`}>
      <span className={`w-2 h-2 rounded-full ${meta.dot} ${status !== 'OFFLINE' ? 'animate-pulse' : ''}`} />
      {meta.label}
    </span>
  );
}
