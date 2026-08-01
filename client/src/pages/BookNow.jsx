import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import SplitCostCard from '../components/booking/SplitCostCard';
import { getItinerary } from '../lib/itineraries/itineraries';
import { createBooking, getBooking, updateSplit, confirmBooking, markParticipantPaid } from '../lib/bookings/bookings';

export default function BookNow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [itinerary, setItinerary] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [splittingCost, setSplittingCost] = useState(false);

  const itineraryId = searchParams.get('itineraryId');

  // Load itinerary and booking on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!itineraryId) {
          setError('No itinerary selected. Please select a trip to book.');
          setLoading(false);
          return;
        }

        // Fetch itinerary
        const itineraryData = await getItinerary(itineraryId);
        setItinerary(itineraryData.itinerary);

        // Create or fetch booking
        try {
          const bookingData = await createBooking(itineraryId);
          setBooking(bookingData.booking);
        } catch (err) {
          // If booking exists, try to fetch it
          if (err.response?.status === 409 || err.response?.status === 400) {
            const existingBookingId = localStorage.getItem(`booking_${itineraryId}`);
            if (existingBookingId) {
              const existingData = await getBooking(existingBookingId);
              setBooking(existingData.booking);
            }
          } else {
            throw err;
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking data');
        setLoading(false);
      }
    };

    loadData();
  }, [itineraryId]);

  const handleSplitUpdate = async (splitConfig) => {
    if (!booking) return;

    try {
      setSplittingCost(true);
      const updated = await updateSplit(booking._id, splitConfig);
      setBooking(updated.booking);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update split configuration');
    } finally {
      setSplittingCost(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!booking) return;

    try {
      setConfirming(true);
      setError('');
      const confirmed = await confirmBooking(booking._id);
      setBooking(confirmed.booking);
      localStorage.setItem(`booking_${itineraryId}`, booking._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    } finally {
      setConfirming(false);
    }
  };

  const handleMarkPaid = async (participantId) => {
    if (!booking) return;

    try {
      const updated = await markParticipantPaid(booking._id, participantId);
      setBooking(updated.booking);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark participant as paid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !itinerary && !booking) {
    return (
      <div className="min-h-screen bg-teal-950 flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate('/myItineraries')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              Back to My Itineraries
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary || !booking) {
    return (
      <div className="min-h-screen bg-teal-950 flex items-center justify-center">
        <p className="text-white">No booking data available</p>
      </div>
    );
  }

  const startDate = new Date(itinerary.startDate).toLocaleDateString();
  const endDate = new Date(itinerary.endDate).toLocaleDateString();
  const tripDuration = Math.ceil((new Date(itinerary.endDate) - new Date(itinerary.startDate)) / (1000 * 60 * 60 * 24));

  const isConfirmed = booking.status === 'confirmed';
  const canConfirm = !isConfirmed && (!booking.splitEnabled || (booking.splitEnabled && Math.abs(
    booking.participants.reduce((sum, p) => sum + p.shareAmount, 0) - booking.totalCost
  ) <= 0.01));

  return (
    <div className="min-h-screen bg-teal-950 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-orange-500 font-medium mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Trip Summary */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{itinerary.title}</h1>
              <p className="text-white/70">{tripDuration} days trip</p>
            </div>
            {isConfirmed && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Booking Confirmed
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-white">
              <Calendar size={18} className="text-orange-500" />
              <div>
                <p className="text-xs text-white/70">Dates</p>
                <p className="text-sm font-medium">{startDate} - {endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users size={18} className="text-orange-500" />
              <div>
                <p className="text-xs text-white/70">Participants</p>
                <p className="text-sm font-medium">{booking.participants.length} {booking.participants.length === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl font-bold text-orange-500">₹{itinerary.avg_cost.toFixed(2)}</span>
              <div>
                <p className="text-xs text-white/70">Total Cost</p>
              </div>
            </div>
          </div>

          {/* Cost Range */}
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs text-white/70 mb-1">Cost Range</p>
            <p className="text-white font-medium">
              ₹{itinerary.cost_range.min.toFixed(2)} - ₹{itinerary.cost_range.max.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Split Cost Card */}
        <SplitCostCard
          booking={booking}
          totalCost={booking.totalCost}
          onSplitUpdate={handleSplitUpdate}
          onMarkPaid={handleMarkPaid}
          isConfirmed={isConfirmed}
        />

        {/* Confirm Booking Button */}
        {!isConfirmed && (
          <button
            onClick={handleConfirmBooking}
            disabled={!canConfirm || confirming}
            className={`w-full mt-6 py-3 px-6 font-semibold rounded-xl shadow-lg transition text-white ${
              canConfirm
                ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
                : 'bg-gray-400 cursor-not-allowed opacity-70'
            }`}
          >
            {confirming ? 'Confirming...' : 'Confirm Booking'}
          </button>
        )}

        {isConfirmed && (
          <div className="mt-6 bg-green-100 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-green-800 font-semibold mb-2">✓ Booking Confirmed</p>
            <p className="text-green-700 text-sm mb-4">
              Share the booking details with your co-travelers. You can track payment status above.
            </p>
            <button
              onClick={() => navigate('/myItineraries')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              View All Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

