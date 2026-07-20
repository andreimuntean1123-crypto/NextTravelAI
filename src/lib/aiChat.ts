import { destinations, getDestinationById } from '@/data/destinations';
import { getHotelsByDestination } from '@/data/hotels';
import { cheapestRoomPrice } from '@/lib/hotelsService';
import { getRecommendations } from '@/lib/recommend';
import { generatePackingList } from '@/lib/packing';
import { tripTypeLabels } from '@/data/content';
import type { ChatMessage, Recommendation, TravelPreferences } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Agent AI DEMO — răspunsuri inteligente pe bază de reguli.
//  Analizează mesajul + preferințele și produce răspunsuri utile.
//  Acesta este apelat automat când nu există cheie API configurată.
// ─────────────────────────────────────────────────────────────

let counter = 0;
const uid = () => `msg-${Date.now()}-${counter++}`;

export const WELCOME_MESSAGE =
  'Salut! 👋 Eu sunt agentul tău personal de călătorii. Spune-mi câteva lucruri despre vacanța pe care ți-o dorești, iar eu îți voi crea un plan personalizat. De unde începem?';

export const DEFAULT_SUGGESTIONS = [
  'Vreau o plajă în Europa sub 1500€',
  'Recomandă-mi o escapadă romantică',
  'Ce să pun în bagaj pentru munte?',
  'Planifică un city-break de 3 zile',
];

interface DemoReply {
  content: string;
  suggestions?: string[];
  recommendations?: Recommendation[];
}

function extractPrefs(text: string, base: TravelPreferences): TravelPreferences {
  const t = text.toLowerCase();
  const prefs: TravelPreferences = { ...base };
  const types: string[] = [...((prefs.tripTypes as string[]) ?? [])];

  const typeKeywords: Record<string, string[]> = {
    plaja: ['plaj', 'mare', 'ocean', 'nisip'],
    munte: ['munte', 'schi', 'alpi', 'zăpad', 'zapad'],
    'city-break': ['city', 'oraș', 'oras', 'weekend'],
    natura: ['natur', 'junglă', 'jungla', 'pădure', 'padure', 'safari'],
    aventura: ['aventur', 'adrenalin', 'rafting', 'trekking'],
    relaxare: ['relax', 'spa', 'liniște', 'liniste', 'wellness'],
    cultura: ['cultur', 'muze', 'istorie', 'templ'],
    gastronomie: ['gastro', 'mâncare', 'mancare', 'culinar', 'restaurant'],
    romantica: ['roman', 'lună de miere', 'luna de miere', 'cuplu', 'iubit'],
    familie: ['famil', 'copii', 'copil'],
  };
  for (const [type, kws] of Object.entries(typeKeywords)) {
    if (kws.some((k) => t.includes(k)) && !types.includes(type)) types.push(type);
  }
  if (types.length) prefs.tripTypes = types;

  // buget
  const budgetMatch = t.match(/(\d[\d.\s]{2,})\s*(?:€|euro|eur|lei|ron)?/);
  if (budgetMatch && (t.includes('€') || t.includes('euro') || t.includes('buget') || t.includes('eur'))) {
    const num = Number(budgetMatch[1].replace(/[.\s]/g, ''));
    if (num >= 200) prefs.budget = num;
  }

  // zile
  const daysMatch = t.match(/(\d{1,2})\s*(?:zile|zi)/);
  if (daysMatch) prefs.days = Number(daysMatch[1]);

  // climă
  if (t.includes('cald') || t.includes('soare')) prefs.climate = 'calda';
  if (t.includes('tropical')) prefs.climate = 'tropicala';
  if (t.includes('zăpad') || t.includes('zapad')) prefs.climate = 'zapada';

  // regiune / destinație menționată — ținând cont de NEGAȚIE
  // ex. „nu vreau santorini", „fără Bali", „altceva decât Roma"
  const negationCues = [
    'nu vreau',
    'nu-mi place',
    'nu imi place',
    'nu îmi place',
    'nu mai',
    'fara',
    'fără',
    'altceva decat',
    'altceva decât',
    'in afara de',
    'în afară de',
    'exclus',
    'nu ',
  ];
  const disliked: string[] = [];
  for (const d of destinations) {
    const name = d.name.toLowerCase();
    const country = d.country.toLowerCase();
    const idx = t.indexOf(name) >= 0 ? t.indexOf(name) : t.indexOf(country);
    if (idx < 0) continue;
    // Verifică dacă în fața mențiunii (până la ~20 caractere) există o negație.
    const before = t.slice(Math.max(0, idx - 20), idx);
    const negated = negationCues.some((cue) => before.includes(cue));
    if (negated) {
      disliked.push(d.name);
    } else {
      prefs.destinationWish = d.name;
    }
  }
  if (disliked.length) {
    const prev = String(prefs.dislikedDestinations ?? '');
    prefs.dislikedDestinations = [prev, ...disliked].filter(Boolean).join(', ');
    // Dacă destinația dorită a fost de fapt negată, o eliminăm.
    if (prefs.destinationWish && disliked.includes(prefs.destinationWish as string)) {
      prefs.destinationWish = undefined;
    }
  }
  if (t.includes('europ') && !t.includes('nu ') ) prefs.destinationWish = prefs.destinationWish ?? 'europ';

  return prefs;
}

export function generateDemoReply(
  userText: string,
  prefs: TravelPreferences,
): DemoReply {
  const t = userText.toLowerCase();

  // 1. Bagaje
  if (t.includes('bagaj') || t.includes('valiz') || t.includes('împachet') || t.includes('impachet')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[0];
    const list = generatePackingList(dest, Number(prefs.days) || 7);
    const preview = list
      .map((c) => `${c.icon} **${c.category}**: ${c.items.slice(0, 3).join(', ')}...`)
      .join('\n');
    return {
      content: `Pentru **${dest.name}** (climă ${dest.climate}), iată ce ți-aș pune în bagaj:\n\n${preview}\n\nGăsești lista completă și interactivă în pagina **Planifică → Listă de bagaje**. Vrei să o adaptez pentru mai multe zile?`,
      suggestions: ['Vreau lista completă', 'Recomandă-mi hoteluri acolo', 'Cât ar costa vacanța?'],
    };
  }

  // 2. Buget / cost
  if (t.includes('cost') || t.includes('buget') || t.includes('preț') || t.includes('pret') || t.includes('cât') || t.includes('cat cost')) {
    const merged = extractPrefs(userText, prefs);
    const recs = getRecommendations(merged, 3);
    const lines = recs
      .map((r) => `• **${r.destination.name}** — de la ~${r.estimatedPrice}€ pentru ${Number(merged.days) || r.destination.recommendedDays} zile`)
      .join('\n');
    return {
      content: `Iată câteva estimări pentru bugetul și preferințele tale:\n\n${lines}\n\nPrețurile includ transport, cazare, mâncare și activități. Vrei să deschid calculatorul de buget detaliat pentru una dintre ele?`,
      recommendations: recs,
      suggestions: ['Deschide calculatorul de buget', 'Vreau varianta cea mai ieftină', 'Fă-mi un itinerar'],
    };
  }

  // 3. Itinerar
  if (t.includes('itinerar') || t.includes('program') || t.includes('plan') || t.includes('zi cu zi')) {
    const merged = extractPrefs(userText, prefs);
    const recs = getRecommendations(merged, 3);
    const top = recs[0];
    return {
      content: `Perfect! Pe baza a ceea ce mi-ai spus, îți recomand **${top.destination.name}, ${top.destination.country}** (compatibilitate ${top.matchScore}%).\n\nAm pregătit un itinerar zi-cu-zi cu obiective, restaurante, timpi și costuri estimate. Apasă „Vezi itinerarul" pe cardul de mai jos ca să îl deschid, apoi îl putem ajusta împreună — pot face o zi mai relaxată, pot înlocui activități sau reface complet o zi.`,
      recommendations: recs,
      suggestions: ['Fă programul mai relaxat', 'Vreau alte 2 variante', 'Recomandă restaurante'],
    };
  }

  // 4. Restaurante
  if (t.includes('restaurant') || t.includes('mânc') || t.includes('manc') || t.includes('gastro') || t.includes('unde mănânc') || t.includes('unde mananc')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[2];
    const list = dest.restaurants.map((r) => `• **${r.name}** (${r.cuisine}) — nota ${r.rating}/10. ${r.note}`).join('\n');
    return {
      content: `Recomandările mele culinare pentru **${dest.name}**:\n\n${list}\n\nAm ales o combinație de fine dining, autentic local și opțiuni accesibile, ca să acoperim toate momentele zilei. Vrei și obiective turistice în apropiere?`,
      suggestions: ['Da, obiective turistice', 'Fă-mi un itinerar aici', 'Recomandă hoteluri'],
    };
  }

  // 5. Hoteluri / cazare
  if (t.includes('hotel') || t.includes('cazare') || t.includes('dorm') || t.includes('resort')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[0];
    const destHotels = [...getHotelsByDestination(dest.id)].sort((a, b) => b.reviewScore - a.reviewScore);
    const list = destHotels
      .slice(0, 4)
      .map(
        (h) =>
          `• **${h.name}** ${'⭐'.repeat(h.stars)} — de la ${cheapestRoomPrice(h)}€/noapte, scor ${h.reviewScore.toFixed(1)} (${h.reviewLabel}). ${h.neighborhood}, ${h.rooms.length} tipuri de cameră.`,
      )
      .join('\n');
    return {
      content: `Pentru **${dest.name}** am ${destHotels.length} hoteluri. Cele mai bine cotate:\n\n${list}\n\nFiecare are mai multe tipuri de cameră, cu prețuri diferite, anulare gratuită și opțiuni de mic dejun. Deschide pagina **Hoteluri** ca să vezi toate camerele și să filtrezi după preț, stele sau scor. Vrei să estimez bugetul total al sejurului?`,
      suggestions: ['Vreau toate hotelurile', 'Estimează bugetul', 'Ce activități sunt acolo?'],
    };
  }

  // 6. Obiective / activități
  if (t.includes('obiectiv') || t.includes('activit') || t.includes('vizit') || t.includes('ce fac') || t.includes('atracți') || t.includes('atracti')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[1];
    const list = dest.attractions.map((a) => `• **${a.name}** (${a.category}) — ~${a.durationHours}h${a.cost ? `, ${a.cost}€` : ', gratuit'}. ${a.description}`).join('\n');
    return {
      content: `Cele mai frumoase experiențe din **${dest.name}**:\n\n${list}\n\nLe pot organiza într-un itinerar zi-cu-zi optimizat ca distanțe și timp. Îl construiesc?`,
      suggestions: ['Da, construiește itinerarul', 'Recomandă restaurante', 'Cât costă în total?'],
    };
  }

  // 7. Recomandare generală / destinații
  const merged = extractPrefs(userText, prefs);
  const recs = getRecommendations(merged, 3);
  const typeSummary = ((merged.tripTypes as string[]) ?? [])
    .map((x) => tripTypeLabels[x]?.toLowerCase())
    .filter(Boolean)
    .join(', ');

  const intro = typeSummary
    ? `Am înțeles — cauți ceva cu accent pe **${typeSummary}**.`
    : 'Am câteva idei excelente pentru tine.';

  const body = recs
    .map(
      (r) =>
        `• **${r.destination.name}, ${r.destination.country}** — potrivire ${r.matchScore}%. ${r.reasons[0]}`,
    )
    .join('\n');

  return {
    content: `${intro}\n\n${body}\n\nFiecare recomandare are o notă de compatibilitate calculată din preferințele tale. Apasă pe un card pentru detalii complete și itinerar. Cu ce te pot ajuta mai departe?`,
    recommendations: recs,
    suggestions: ['Fă-mi un itinerar pentru prima', 'Vreau ceva mai ieftin', 'Ce climă are prima?'],
  };
}

export function makeMessage(
  role: ChatMessage['role'],
  content: string,
  extra: Partial<ChatMessage> = {},
): ChatMessage {
  return {
    id: uid(),
    role,
    content,
    timestamp: Date.now(),
    ...extra,
  };
}
