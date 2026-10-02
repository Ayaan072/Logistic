import { ORDER_STATUS_FLOW, STATUS_META, getStatusIndex, type OrderStatus } from '@/types';
import { Check, Circle } from 'lucide-react';

export default function StatusTracker({ currentStatus, orientation = 'horizontal' }: { currentStatus: OrderStatus; orientation?: 'horizontal' | 'vertical' }) {
  const currentIdx = getStatusIndex(currentStatus);

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-1">
        {ORDER_STATUS_FLOW.map((status, idx) => {
          const isComplete = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const meta = STATUS_META[status];
          return (
            <div key={status} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? `${meta.dot} text-white ring-4 ring-offset-2 ring-offset-white ring-gray-100`
                      : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-white" /> : <Circle className="w-3 h-3" />}
                </div>
                {idx < ORDER_STATUS_FLOW.length - 1 && (
                  <div className={`w-0.5 h-8 ${isComplete ? 'bg-green-400' : 'bg-gray-200'} transition-colors duration-300`} />
                )}
              </div>
              <div className="pb-8">
                <p className={`text-sm font-medium ${isComplete || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                  {meta.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center overflow-x-auto pb-2">
      {ORDER_STATUS_FLOW.map((status, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const meta = STATUS_META[status];
        return (
          <div key={status} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isComplete
                    ? 'bg-green-500 text-white scale-100'
                    : isCurrent
                    ? `${meta.dot} text-white ring-4 ring-offset-2 ring-offset-white ring-gray-100 scale-110`
                    : 'bg-gray-100 text-gray-300'
                }`}
              >
                {isComplete ? <Check className="w-5 h-5" /> : isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> : <Circle className="w-4 h-4" />}
              </div>
              <p className={`text-xs font-medium whitespace-nowrap ${isComplete || isCurrent ? 'text-gray-700' : 'text-gray-400'}`}>
                {meta.label}
              </p>
            </div>
            {idx < ORDER_STATUS_FLOW.length - 1 && (
              <div className={`w-12 h-0.5 mx-1 mb-5 ${isComplete ? 'bg-green-400' : 'bg-gray-200'} transition-colors duration-500`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
