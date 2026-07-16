const searchHotel=async (req, res) => {


 const { locationQuery } = req.body; // e.g., "Mumbai"




  // OpenStreetMap uses a public endpoint. 
  // Note: They require a descriptive User-Agent header so they know who is calling it.
  const url = `https://nominatim.openstreetmap.org/search?q=hotels+in+${encodeURIComponent(locationQuery)}&format=json&addressdetails=1`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'MyStudentTravelApp/1.0' }
    });

    // Transform OpenStreetMap objects to match your React frontend variables
    const normalizedPlaces = response.data.map((item, index) => ({
      id: item.place_id || index.toString(),
      name: item.display_name.split(',')[0], // Gets the primary name
      address: item.display_name,
      rating: (Math.random() * 2 + 3).toFixed(1), // OSM doesn't have ratings, mock 3.0 - 5.0 for your UI filter
      type: 'hotel', // You can make a second API call for restaurants and merge them
      priceLevel: ['INEXPENSIVE', 'MODERATE', 'EXPENSIVE'][Math.floor(Math.random() * 3)], // Mock price for UI testing
      isVegetarian: Math.random() > 0.5
    }));
    
    return res.json(normalizedPlaces);
  } catch (error) {
    console.error('OSM API Error:', error.message);
    return res.status(500).json({ error: 'Failed fetching details from OpenStreetMap' });
  }
}

module.exports=searchHotel;