import { useNavigate } from "react-router-dom";
import DestinationForm from "../components/destination/DestinationForm";
import { createDestination } from "../lib/destinations/destinations";

function AddDestinationPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const { destination } = await createDestination(payload);
    navigate(`/destinationDetail/${destination._id}`);
  };

  return (
    <section className="min-h-screen pt-20 pb-16 lg:pt-24 lg:pb-24 bg-teal-950 font-['Bricolage_Grotesque']">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            Share a place
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Add a destination
          </h1>
        </div>
        <DestinationForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}

export default AddDestinationPage;
