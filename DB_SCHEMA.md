# Travel & Tourism — Database Schema (Draft)

Based on the page skeleton. Adjust fields as you finalize features.

## Users
```
{
  _id,
  name,
  email,          // unique
  password,       // hashed
  createdAt
}
```

## Destinations
```
{
  _id,
  name,
  country,
  city,
  type,           // e.g. beach, mountain, heritage, adventure
  description,
  images: [String],
  budgetRange,    // e.g. budget / mid / luxury
  bestTimeToVisit,
  weatherInfo,
  entryRequirements,
  avgRating,      // computed from Reviews
  reviewCount,    // computed from Reviews
  createdAt
}
```

## Itineraries
```
{
  _id,
  userId,         // ref Users
  title,
  startDate,
  endDate,
  days: [
    {
      dayNumber,
      entries: [
        {
          destinationId,   // ref Destinations
          notes,
          order
        }
      ]
    }
  ],
  createdAt,
  updatedAt
}
```

## Reviews
```
{
  _id,
  userId,          // ref Users
  destinationId,   // ref Destinations
  rating,          // 1-5
  comment,
  createdAt
}
```

---

## Relationships
```
Users 1───* Itineraries
Users 1───* Reviews
Destinations 1───* Reviews
Destinations *───* Itineraries   (via itinerary.days.entries.destinationId)
```

## Notes
- `Destinations` = shared content, same for all users.
- `Itineraries` and `Reviews` = user-owned data, tied to a `userId`.
- `avgRating` / `reviewCount` on Destinations can be computed on read or updated whenever a review is added/removed — your call.
- Add/remove fields freely based on which functions you decide to build.
