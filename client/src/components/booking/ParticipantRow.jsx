import { Trash2 } from 'lucide-react';

export default function ParticipantRow({
  participant,
  index,
  splitMethod,
  totalCost,
  isOrganizer,
  onNameChange,
  onEmailChange,
  onAmountChange,
  onRemove,
}) {
  const handleRemove = () => {
    if (!isOrganizer && onRemove) {
      onRemove(index);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-3">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={participant.name}
            onChange={(e) => onNameChange(index, e.target.value)}
            disabled={isOrganizer}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Participant name"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={participant.email}
            onChange={(e) => onEmailChange(index, e.target.value)}
            disabled={isOrganizer}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="email@example.com"
          />
        </div>

        {splitMethod === 'custom' ? (
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">₹</span>
              <input
                type="number"
                value={participant.shareAmount}
                onChange={(e) => onAmountChange(index, parseFloat(e.target.value) || 0)}
                step="0.01"
                className="w-28 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share
            </label>
            <div className="flex items-center gap-1 h-10 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-sm font-medium text-gray-700">₹{participant.shareAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {!isOrganizer && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg mt-6 transition"
          >
            <Trash2 size={18} />
          </button>
        )}

        {participant.paymentStatus === 'paid' && (
          <div className="flex-shrink-0 mt-6">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
              Paid
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
