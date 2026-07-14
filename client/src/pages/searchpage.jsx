import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

export default function DestinationPlanner({ destinationId, destinationName }) {
  // 1. Core States
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Filter State Object
  const [filters, setFilters] = useState({
    type: 'all',          // 'all', 'hotel', 'restaurant'
    minRating: 0,         // 0 to 5 stars
    priceLevel: 'all',    // 'all', 'INEXPENSIVE', 'MODERATE', 'EXPENSIVE'
    isVegetarian: false   // true/false (for restaurants)
  });

  // 3. Fetch data from your Node.js backend when the destination changes
  useEffect(() => {
    if (!destinationId) return;

    const fetchAmenities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Points to the Express route you built in your backend
        const response = await axios.post('/api/get-amenities', { 
          locationQuery: destinationName 
        });
        setAmenities(response.data);
      } catch (err) {
        console.error("Failed to load local places:", err);
        setError("Could not retrieve hotels or restaurants for this location.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenities();
  }, [destinationId, destinationName]);

  // 4. Client-Side Multi-Parameter Filtering (runs instantly on state change)
  const filteredAmenities = useMemo(() => {
    return amenities.filter((place) => {
      // Filter by Category Type
      if (filters.type !== 'all' && place.type !== filters.type) return false;

      // Filter by Minimum Rating
      if (place.rating < filters.minRating) return false;

      // Filter by Price Range ($ = INEXPENSIVE, $$ = MODERATE, $$$ = EXPENSIVE)
      if (filters.priceLevel !== 'all' && place.priceLevel !== filters.priceLevel) return false;

      // Filter by Dietary Preference (Only impacts restaurant results)
      if (filters.type === 'restaurant' && filters.isVegetarian && !place.isVegetarian) return false;

      return true;
    });
  }, [amenities, filters]);

  // Handler to update individual filter fields safely
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset vegetarian toggle if switching completely to hotels to prevent logical conflicts
      ...(key === 'type' && value === 'hotel' ? { isVegetarian: false } : {})
    }));
  };

  if (isLoading) return <div>Loading nearby hotels and restaurants...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="planner-container">
      <h2>Explore Places in {destinationName}</h2>

      {/* --- Filter Controls Panel --- */}
      <div className="filter-controls">
        {/* Type Selection */}
        <label>Category:</label>
        <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
          <option value="all">All Places</option>
          <option value="hotel">Hotels Only</option>
          <option value="restaurant">Restaurants Only</option>
        </select>

        {/* Rating Filter */}
        <label>Minimum Rating: {filters.minRating} ⭐</label>
        <input 
          type="range" min="0" max="5" step="0.5" 
          value={filters.minRating} 
          onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))} 
        />

        {/* Price Level Filter */}
        <label>Budget Level:</label>
        <select value={filters.priceLevel} onChange={(e) => handleFilterChange('priceLevel', e.target.value)}>
          <option value="all">Any Price</option>
          <option value="INEXPENSIVE">Low ($)</option>
          <option value="MODERATE">Mid ($$)</option>
          <option value="EXPENSIVE">High ($$$)</option>
        </select>

        {/* Veg Toggle (Disabled if viewing only hotels) */}
        {filters.type !== 'hotel' && (
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.isVegetarian} 
              onChange={(e) => handleFilterChange('isVegetarian', e.target.checked)} 
            />
            Vegetarian Only 🥦
          </label>
        )}
      </div>

      {/* --- Display Results List --- */}
      <div className="places-list">
        {filteredAmenities.length === 0 ? (
          <p>No matches found matching your active filter criteria.</p>
        ) : (
          filteredAmenities.map((place) => (
            <div key={place.id} className="place-card">
              <h3>{place.name}</h3>
              <p className="category-badge">{place.type.toUpperCase()}</p>
              <p>Rating: {place.rating} ⭐</p>
              <p>Price: {place.priceLevel === 'INEXPENSIVE' ? '$' : place.priceLevel === 'MODERATE' ? '$$' : '$$$'}</p>
              <p>{place.address}</p>
              {place.isVegetarian && <span className="veg-indicator">Pure Veg 🟢</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}