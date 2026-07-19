import { hotels } from '@/data/hotels';
import type { BoardType, BookingHotel, PropertyType } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Strat de servicii pentru hoteluri — punct unic de integrare.
//  Fără cheie → date demonstrative locale (Booking-style).
//  Cu cheie (VITE_HOTELS_API_KEY) → gata de conectat la Booking
//  (sau alt furnizor: Amadeus Hotels, Hotelbeds etc.).
// ─────────────────────────────────────────────────────────────

export interface HotelFilters {
  destinationId?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[]; // ex. [4,5]
  propertyTypes?: PropertyType[];
  boards?: BoardType[];
  minReviewScore?: number;
  amenities?: string[];
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
  sustainable?: boolean;
  capacity?: number; // persoane
}

export type HotelSort =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'stars'
  | 'distance';

export function isLiveHotelsConfigured(): boolean {
  return Boolean(import.meta.env.VITE_HOTELS_API_KEY);
}

export function cheapestRoomPrice(hotel: BookingHotel): number {
  return Math.min(hotel.pricePerNight, ...hotel.rooms.map((r) => r.pricePerNight));
}

/**
 * Caută hoteluri după filtre + sortare.
 * În modul demo filtrează local; cu API real ar face un fetch aici.
 */
export function searchHotels(filters: HotelFilters, sort: HotelSort = 'recommended'): BookingHotel[] {
  // if (isLiveHotelsConfigured()) return fetchFromBookingApi(filters, sort);

  let list = hotels.filter((h) => {
    if (filters.destinationId && h.destinationId !== filters.destinationId) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (!h.name.toLowerCase().includes(q) && !h.neighborhood.toLowerCase().includes(q))
        return false;
    }
    const price = cheapestRoomPrice(h);
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (filters.stars?.length && !filters.stars.includes(h.stars)) return false;
    if (filters.propertyTypes?.length && !filters.propertyTypes.includes(h.propertyType)) return false;
    if (filters.boards?.length && !filters.boards.some((b) => h.boardOptions.includes(b))) return false;
    if (filters.minReviewScore !== undefined && h.reviewScore < filters.minReviewScore) return false;
    if (filters.freeCancellation && !h.freeCancellation) return false;
    if (filters.breakfastIncluded && !h.breakfastIncluded) return false;
    if (filters.sustainable && !h.sustainable) return false;
    if (filters.capacity && !h.rooms.some((r) => r.capacity >= filters.capacity!)) return false;
    if (filters.amenities?.length && !filters.amenities.every((a) => h.amenities.includes(a)))
      return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return cheapestRoomPrice(a) - cheapestRoomPrice(b);
      case 'price-desc':
        return cheapestRoomPrice(b) - cheapestRoomPrice(a);
      case 'rating':
        return b.reviewScore - a.reviewScore;
      case 'stars':
        return b.stars - a.stars;
      case 'distance':
        return a.distanceFromCenterKm - b.distanceFromCenterKm;
      default:
        // „recomandat": scor combinat rating + stele - preț normalizat
        return (
          b.reviewScore * 10 + b.stars * 5 - cheapestRoomPrice(b) / 40 -
          (a.reviewScore * 10 + a.stars * 5 - cheapestRoomPrice(a) / 40)
        );
    }
  });

  return list;
}

// Toate facilitățile disponibile (pentru UI de filtre).
export const allAmenities = Array.from(new Set(hotels.flatMap((h) => h.amenities))).sort();

// ─── Schelet integrare Booking (activabil cu cheia) ───────────
//
// async function fetchFromBookingApi(filters: HotelFilters, sort: HotelSort) {
//   const key = import.meta.env.VITE_HOTELS_API_KEY;
//   const res = await fetch('https://<booking-endpoint>/hotels/search', {
//     method: 'POST',
//     headers: { 'content-type': 'application/json', 'x-api-key': key },
//     body: JSON.stringify({ ...filters, sort }),
//   });
//   const data = await res.json();
//   return data.hotels.map(mapBookingHotel); // mapează la BookingHotel
// }
//
// Recomandare de securitate: rutează apelul printr-un backend/proxy,
// nu expune cheia direct în browser în producție.
