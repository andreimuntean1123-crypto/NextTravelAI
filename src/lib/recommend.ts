import { destinations } from '@/data/destinations';
import { tf } from '@/i18n/translations';
import { tripTypeLabel, climateLabel } from '@/i18n/labels';
import type {
  Destination,
  Language,
  Recommendation,
  TravelPreferences,
  BudgetBreakdown,
} from '@/types';

// ─────────────────────────────────────────────────────────────
//  Motor de recomandări demonstrativ (fără API).
//  Calculează o notă de compatibilitate pe baza preferințelor.
// ─────────────────────────────────────────────────────────────

interface ScoreResult {
  score: number;
  reasons: string[];
  pros: string[];
  cons: string[];
}

function scoreDestination(dest: Destination, prefs: TravelPreferences, lang: Language): ScoreResult {
  let score = 55; // bază
  const reasons: string[] = [];
  const pros: string[] = [];
  const cons: string[] = [];

  // Tip de vacanță (cel mai important)
  const wantedTypes = (prefs.tripTypes ?? []) as string[];
  if (wantedTypes.length) {
    const matches = dest.tags.filter((t) => wantedTypes.includes(t));
    const ratio = matches.length / wantedTypes.length;
    score += ratio * 22;
    if (matches.length) {
      reasons.push(
        tf(lang, 'rec.matchesPrefs', { types: matches.map((m) => tripTypeLabel(lang, m)).join(', ') }),
      );
      pros.push(tf(lang, 'rec.excellentFor', { type: tripTypeLabel(lang, matches[0]).toLowerCase() }));
    }
  }

  // Climă
  if (prefs.climate && prefs.climate !== 'indiferent') {
    if (dest.climate === prefs.climate) {
      score += 12;
      reasons.push(tf(lang, 'rec.hasClimate', { climate: climateLabel(lang, dest.climate).toLowerCase() }));
    } else {
      score -= 6;
      cons.push(
        tf(lang, 'rec.climateMismatch', {
          climate: climateLabel(lang, dest.climate).toLowerCase(),
          wanted: climateLabel(lang, prefs.climate).toLowerCase(),
        }),
      );
    }
  }

  // Buget (pe zi / persoană)
  const days = Number(prefs.days) || dest.recommendedDays;
  const people = Number(prefs.people) || 2;
  const budget = Number(prefs.budget) || 0;
  if (budget > 0) {
    const estTotal = estimateTripCost(dest, days, people);
    if (estTotal <= budget) {
      score += 14;
      reasons.push(tf(lang, 'rec.withinBudget', {}));
      pros.push(tf(lang, 'rec.matchesBudget', {}));
    } else if (estTotal <= budget * 1.2) {
      score += 4;
      cons.push(tf(lang, 'rec.slightlyOverBudget', {}));
    } else {
      score -= 10;
      cons.push(tf(lang, 'rec.overBudget', {}));
    }
  }

  // Transport
  const wantedTransport = (prefs.transport ?? []) as string[];
  if (wantedTransport.length) {
    const ok = dest.bestTransport.some((t) => wantedTransport.includes(t));
    if (ok) {
      score += 6;
    } else {
      score -= 3;
      cons.push(tf(lang, 'rec.needsOtherTransport', {}));
    }
  }

  // Cazare disponibilă cu numărul de stele dorit
  const wantStars = Number(prefs.stars) || 0;
  if (wantStars > 0) {
    const hasStars = dest.hotels.some((h) => h.stars >= wantStars);
    if (hasStars) score += 5;
    else cons.push(tf(lang, 'rec.limitedStarOptions', { stars: wantStars }));
  }

  // Text liber: destinație dorită
  const wish = String(prefs.destinationWish ?? '').toLowerCase();
  if (wish) {
    if (
      dest.name.toLowerCase().includes(wish) ||
      dest.country.toLowerCase().includes(wish) ||
      dest.region.toLowerCase().includes(wish)
    ) {
      score += 18;
      reasons.push(tf(lang, 'rec.matchesWish', {}));
    }
  }

  // Destinații care nu i-au plăcut
  const disliked = String(prefs.dislikedDestinations ?? '').toLowerCase();
  if (disliked && (dest.name.toLowerCase().includes(disliked) || dest.country.toLowerCase().includes(disliked))) {
    score -= 25;
    cons.push(tf(lang, 'rec.dislikedMention', {}));
  }

  // Bonus rating & popularitate
  score += (dest.rating - 8) * 3;
  if (prefs.popularVsHidden === 'ascunse') {
    score += (90 - dest.popularity) * 0.08;
  } else if (prefs.popularVsHidden === 'populare') {
    score += (dest.popularity - 80) * 0.1;
  }

  // Confort vs economie
  if (prefs.saveVsComfort === 'economie' && dest.pricePerDay > 150) {
    score -= 6;
    cons.push(tf(lang, 'rec.expensiveForSaver', {}));
  }
  if (prefs.saveVsComfort === 'confort' && dest.pricePerDay > 150) {
    score += 4;
    pros.push(tf(lang, 'rec.luxuryAvailable', {}));
  }

  // Pro-uri generale
  if (dest.rating >= 9.2) pros.push(tf(lang, 'rec.excellentRating', {}));
  if (dest.pricePerDay <= 90) pros.push(tf(lang, 'rec.greatValue', {}));

  // Normalizează
  score = Math.max(35, Math.min(99, Math.round(score)));

  if (!reasons.length) {
    reasons.push(tf(lang, 'rec.versatileChoice', {}));
  }

  return {
    score,
    reasons: reasons.slice(0, 4),
    pros: Array.from(new Set(pros)).slice(0, 4),
    cons: Array.from(new Set(cons)).slice(0, 3),
  };
}

export function estimateTripCost(dest: Destination, days: number, people: number): number {
  // Cost estimativ total (EUR) = zbor + (per zi * zile * persoane)
  const perDayGroup = dest.pricePerDay * people;
  const flightPerPerson = flightEstimate(dest);
  return Math.round(flightPerPerson * people + perDayGroup * days);
}

function flightEstimate(dest: Destination): number {
  // Estimare demonstrativă de transport pe persoană, în funcție de regiune.
  const map: Record<string, number> = {
    Grecia: 180,
    Italia: 130,
    Spania: 150,
    Portugalia: 170,
    Cehia: 110,
    Elveția: 160,
    Japonia: 750,
    Indonezia: 780,
    Maldive: 820,
    'Costa Rica': 900,
  };
  return map[dest.country] ?? 250;
}

export function getRecommendations(
  prefs: TravelPreferences,
  limit = 5,
  lang: Language = 'ro',
): Recommendation[] {
  const days = Number(prefs.days) || 6;
  const people = Number(prefs.people) || 2;

  // Exclude complet destinațiile pe care utilizatorul le-a respins.
  const disliked = String(prefs.dislikedDestinations ?? '').toLowerCase();
  const pool = disliked
    ? destinations.filter(
        (d) => !disliked.includes(d.name.toLowerCase()) && !disliked.includes(d.country.toLowerCase()),
      )
    : destinations;

  return pool
    .map<Recommendation>((dest) => {
      const { score, reasons, pros, cons } = scoreDestination(dest, prefs, lang);
      return {
        destination: dest,
        matchScore: score,
        estimatedPrice: estimateTripCost(dest, days, people),
        reasons,
        pros,
        cons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

// ─── Buget implicit pe baza unei destinații ──────────────────

export function defaultBudgetBreakdown(
  dest: Destination,
  days: number,
  people: number,
): BudgetBreakdown {
  const flight = flightEstimate(dest) * people;
  const accommodation = (dest.hotels[1]?.pricePerNight ?? dest.pricePerDay) * days;
  const food = dest.pricePerDay * 0.35 * days * people;
  const activities = dest.pricePerDay * 0.25 * days * people;
  const localTransport = 15 * days;
  const shopping = 40 * people;
  const subtotal = flight + accommodation + food + activities + localTransport + shopping;
  const emergency = Math.round(subtotal * 0.08);
  return {
    transport: Math.round(flight),
    accommodation: Math.round(accommodation),
    food: Math.round(food),
    activities: Math.round(activities),
    localTransport: Math.round(localTransport),
    shopping: Math.round(shopping),
    emergency,
  };
}
