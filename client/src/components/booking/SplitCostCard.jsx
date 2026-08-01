import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ParticipantRow from './ParticipantRow';

export default function SplitCostCard({
  booking,
  totalCost,
  onSplitUpdate,
  onMarkPaid,
  isConfirmed,
}) {
  const [splitEnabled, setSplitEnabled] = useState(booking?.splitEnabled || false);
  const [splitMethod, setSplitMethod] = useState(booking?.splitMethod || 'equal');
  const [participants, setParticipants] = useState(
    booking?.participants || [
      {
        name: '',
        email: '',
        shareAmount: totalCost,
        paymentStatus: 'pending',
        isOrganizer: true,
      },
    ]
  );
  const [allocatedTotal, setAllocatedTotal] = useState(0);
  const [isValid, setIsValid] = useState(false);

  // Calculate allocated total
  useEffect(() => {
    const total = participants.reduce((sum, p) => sum + Number(p.shareAmount || 0), 0);
    setAllocatedTotal(Math.round(total * 100) / 100);

    // Check if split is valid
    const diff = Math.abs(total - totalCost);
    setIsValid(diff <= 0.01);
  }, [participants, totalCost]);

  // Handle equal split method change
  useEffect(() => {
    if (splitEnabled && splitMethod === 'equal') {
      const baseShare = Math.floor((totalCost * 100) / participants.length) / 100;
      const remainder = Math.round((totalCost * 100) - (baseShare * participants.length * 100)) / 100;

      const newParticipants = participants.map((p, idx) => ({
        ...p,
        shareAmount: idx === 0 ? baseShare + remainder : baseShare,
      }));
      setParticipants(newParticipants);
    }
  }, [splitEnabled, splitMethod, participants.length, totalCost]);

  const handleToggleSplit = (enabled) => {
    setSplitEnabled(enabled);

    if (!enabled) {
      // Reset to organizer only
      const organizer = participants.find(p => p.isOrganizer);
      if (organizer) {
        setParticipants([
          {
            ...organizer,
            shareAmount: totalCost,
          },
        ]);
      }
    } else {
      // If enabling split, ensure we have organizer
      if (!participants.some(p => p.isOrganizer)) {
        setParticipants([
          {
            name: '',
            email: '',
            shareAmount: totalCost,
            paymentStatus: 'pending',
            isOrganizer: true,
          },
        ]);
      }
    }
  };

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      {
        name: '',
        email: '',
        userId: null,
        isOrganizer: false,
        shareAmount: splitMethod === 'equal' ? 0 : 0,
        paymentStatus: 'pending',
      },
    ]);
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  const handleNameChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index].name = value;
    setParticipants(newParticipants);
  };

  const handleEmailChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index].email = value.toLowerCase();
    setParticipants(newParticipants);
  };

  const handleAmountChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index].shareAmount = value;
    setParticipants(newParticipants);
  };

  const handleConfirmSplit = async () => {
    if (onSplitUpdate && isValid) {
      await onSplitUpdate({
        splitEnabled,
        splitMethod,
        participants,
      });
    }
  };

  const handleMarkPaid = async (participantId) => {
    if (onMarkPaid) {
      await onMarkPaid(participantId);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6">
      {/* Toggle */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Split this trip with friends</h3>
          <p className="text-sm text-gray-600 mt-1">Divide costs among participants</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={splitEnabled}
            onChange={(e) => handleToggleSplit(e.target.checked)}
            disabled={isConfirmed}
            className="w-5 h-5 rounded border-gray-300 cursor-pointer disabled:opacity-50"
          />
          <span className="text-sm font-medium text-gray-700">{splitEnabled ? 'On' : 'Off'}</span>
        </label>
      </div>

      {/* Split Method Selector */}
      {splitEnabled && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Split Method</label>
          <div className="flex gap-3">
            {['equal', 'custom'].map((method) => (
              <button
                key={method}
                onClick={() => setSplitMethod(method)}
                disabled={isConfirmed}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
                  splitMethod === method
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Participants */}
      {splitEnabled && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Participants</h4>
          {participants.map((participant, index) => (
            <ParticipantRow
              key={index}
              participant={participant}
              index={index}
              splitMethod={splitMethod}
              totalCost={totalCost}
              isOrganizer={participant.isOrganizer}
              onNameChange={handleNameChange}
              onEmailChange={handleEmailChange}
              onAmountChange={handleAmountChange}
              onRemove={handleRemoveParticipant}
            />
          ))}

          <button
            onClick={handleAddParticipant}
            disabled={isConfirmed}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Friend
          </button>
        </div>
      )}

      {/* Validation Bar */}
      {splitEnabled && (
        <div
          className={`p-4 rounded-xl mb-6 transition ${
            isValid
              ? 'bg-green-100 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">
              ₹{allocatedTotal.toFixed(2)} of ₹{totalCost.toFixed(2)} allocated
            </span>
            <span className="text-xs font-semibold">
              {isValid ? '✓ Ready' : '✗ Incomplete'}
            </span>
          </div>
          {!isValid && (
            <p className="text-xs mt-1 opacity-90">
              Total must equal ₹{totalCost.toFixed(2)}
            </p>
          )}
        </div>
      )}

      {/* Update Button */}
      {splitEnabled && !isConfirmed && (
        <button
          onClick={handleConfirmSplit}
          disabled={!isValid}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 py-2.5 disabled:opacity-70 disabled:cursor-not-allowed transition"
        >
          Update Split Configuration
        </button>
      )}

      {/* Confirmed View */}
      {isConfirmed && splitEnabled && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Payment Status</h4>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{participant.name}</p>
                <p className="text-xs text-gray-600">₹{participant.shareAmount.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                    participant.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {participant.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
                {participant.paymentStatus === 'pending' && !participant.isOrganizer && (
                  <button
                    onClick={() => handleMarkPaid(participant._id)}
                    className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 font-medium"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
