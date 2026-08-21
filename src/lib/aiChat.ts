import { destinations, getDestinationById } from '@/data/destinations';
import { getHotelsByDestination } from '@/data/hotels';
import { cheapestRoomPrice } from '@/lib/hotelsService';
import { getRecommendations } from '@/lib/recommend';
import { generatePackingList } from '@/lib/packing';
import { tripTypeLabel } from '@/i18n/labels';
import { localizeDestination } from '@/i18n/destinationContent';
import { localizeHotel } from '@/i18n/hotelContent';
import type { ChatMessage, Language, Recommendation, TravelPreferences } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Agent AI DEMO — răspunsuri inteligente pe bază de reguli.
//  Analizează mesajul + preferințele și produce răspunsuri utile,
//  în limba curentă a interfeței. Recunoaște cuvinte-cheie în
//  română, engleză și rusă, ca demo-ul să funcționeze indiferent
//  de limba în care scrie vizitatorul.
//  Acesta este apelat automat când nu există cheie API configurată.
// ─────────────────────────────────────────────────────────────

let counter = 0;
const uid = () => `msg-${Date.now()}-${counter++}`;

const WELCOME: Record<Language, string> = {
  ro: 'Salut! 👋 Eu sunt agentul tău personal de călătorii. Spune-mi câteva lucruri despre vacanța pe care ți-o dorești, iar eu îți voi crea un plan personalizat. De unde începem?',
  en: "Hi! 👋 I'm your personal travel agent. Tell me a bit about the trip you're dreaming of, and I'll build you a personalized plan. Where should we start?",
  ru: 'Привет! 👋 Я ваш личный агент по путешествиям. Расскажите немного о поездке, о которой вы мечтаете, и я составлю для вас персональный план. С чего начнём?',
};

const SUGGESTIONS: Record<Language, string[]> = {
  ro: [
    'Vreau o plajă în Europa sub 1500€',
    'Recomandă-mi o escapadă romantică',
    'Ce să pun în bagaj pentru munte?',
    'Planifică un city-break de 3 zile',
  ],
  en: [
    'I want a beach in Europe under €1500',
    'Recommend a romantic getaway',
    'What should I pack for the mountains?',
    'Plan a 3-day city break',
  ],
  ru: [
    'Хочу пляж в Европе до 1500€',
    'Порекомендуйте романтическую поездку',
    'Что взять с собой в горы?',
    'Спланируйте городской тур на 3 дня',
  ],
};

export const WELCOME_MESSAGE = WELCOME.ro;
export const DEFAULT_SUGGESTIONS = SUGGESTIONS.ro;

export function welcomeMessageFor(lang: Language): string {
  return WELCOME[lang];
}
export function defaultSuggestionsFor(lang: Language): string[] {
  return SUGGESTIONS[lang];
}

interface DemoReply {
  content: string;
  suggestions?: string[];
  recommendations?: Recommendation[];
}

// Cuvinte-cheie de intenție, pe cele 3 limbi — utilizatorul poate scrie în oricare.
const KW = {
  packing: {
    ro: ['bagaj', 'valiz', 'împachet', 'impachet'],
    en: ['pack', 'luggage', 'suitcase', 'bag'],
    ru: ['багаж', 'чемодан', 'упаковать', 'вещи'],
  },
  budget: {
    ro: ['cost', 'buget', 'preț', 'pret', 'cât', 'cat cost'],
    en: ['cost', 'budget', 'price', 'how much'],
    ru: ['стоимость', 'бюджет', 'цена', 'сколько'],
  },
  itinerary: {
    ro: ['itinerar', 'program', 'plan', 'zi cu zi'],
    en: ['itinerary', 'schedule', 'plan', 'day by day'],
    ru: ['маршрут', 'программа', 'план', 'по дням'],
  },
  restaurants: {
    ro: ['restaurant', 'mânc', 'manc', 'gastro', 'unde mănânc', 'unde mananc'],
    en: ['restaurant', 'eat', 'food', 'where to eat'],
    ru: ['ресторан', 'еда', 'поесть', 'где поесть'],
  },
  hotels: {
    ro: ['hotel', 'cazare', 'dorm', 'resort'],
    en: ['hotel', 'stay', 'accommodation', 'resort'],
    ru: ['отел', 'проживани', 'ночлег', 'резорт'],
  },
  attractions: {
    ro: ['obiectiv', 'activit', 'vizit', 'ce fac', 'atracți', 'atracti'],
    en: ['attraction', 'activit', 'visit', 'what to do', 'sight'],
    ru: ['достопримечательност', 'активност', 'посетить', 'что делать'],
  },
};

function includesAny(text: string, lang: Language, group: keyof typeof KW): boolean {
  return KW[group][lang].some((kw) => text.includes(kw)) || KW[group].ro.some((kw) => text.includes(kw));
}

const TYPE_KEYWORDS: Record<string, string[]> = {
  plaja: ['plaj', 'mare', 'ocean', 'nisip', 'beach', 'sea', 'sand', 'пляж', 'море', 'песок'],
  munte: ['munte', 'schi', 'alpi', 'zăpad', 'zapad', 'mountain', 'ski', 'alps', 'snow', 'гор', 'лыж', 'снег'],
  'city-break': ['city', 'oraș', 'oras', 'weekend', 'город', 'выходн'],
  natura: ['natur', 'junglă', 'jungla', 'pădure', 'padure', 'safari', 'nature', 'jungle', 'forest', 'природ', 'джунгл', 'лес'],
  aventura: ['aventur', 'adrenalin', 'rafting', 'trekking', 'adventure', 'приключен'],
  relaxare: ['relax', 'spa', 'liniște', 'liniste', 'wellness', 'quiet', 'спокойств', 'релакс'],
  cultura: ['cultur', 'muze', 'istorie', 'templ', 'culture', 'museum', 'history', 'temple', 'культур', 'музе', 'истори'],
  gastronomie: ['gastro', 'mâncare', 'mancare', 'culinar', 'restaurant', 'food', 'culinary', 'еда', 'кулинар'],
  romantica: ['roman', 'lună de miere', 'luna de miere', 'cuplu', 'iubit', 'honeymoon', 'couple', 'romantic', 'медовый месяц', 'романтик'],
  familie: ['famil', 'copii', 'copil', 'family', 'kids', 'children', 'семь', 'дет'],
};

function extractPrefs(text: string, base: TravelPreferences): TravelPreferences {
  const t = text.toLowerCase();
  const prefs: TravelPreferences = { ...base };
  const types: string[] = [...((prefs.tripTypes as string[]) ?? [])];

  for (const [type, kws] of Object.entries(TYPE_KEYWORDS)) {
    if (kws.some((k) => t.includes(k)) && !types.includes(type)) types.push(type);
  }
  if (types.length) prefs.tripTypes = types;

  // buget
  const budgetMatch = t.match(/(\d[\d.\s]{2,})\s*(?:€|euro|eur|lei|ron)?/);
  if (
    budgetMatch &&
    (t.includes('€') || t.includes('euro') || t.includes('buget') || t.includes('eur') || t.includes('budget') || t.includes('бюджет'))
  ) {
    const num = Number(budgetMatch[1].replace(/[.\s]/g, ''));
    if (num >= 200) prefs.budget = num;
  }

  // zile
  const daysMatch = t.match(/(\d{1,2})\s*(?:zile|zi|days|day|дн[ейяь])/);
  if (daysMatch) prefs.days = Number(daysMatch[1]);

  // climă
  if (t.includes('cald') || t.includes('soare') || t.includes('warm') || t.includes('sunny') || t.includes('тёпл') || t.includes('солнечн'))
    prefs.climate = 'calda';
  if (t.includes('tropical') || t.includes('тропич')) prefs.climate = 'tropicala';
  if (t.includes('zăpad') || t.includes('zapad') || t.includes('snow') || t.includes('снег')) prefs.climate = 'zapada';

  // regiune / destinație menționată — ținând cont de NEGAȚIE
  const negationCues = [
    'nu vreau', 'nu-mi place', 'nu imi place', 'nu îmi place', 'nu mai', 'fara', 'fără',
    'altceva decat', 'altceva decât', 'in afara de', 'în afară de', 'exclus', 'nu ',
    "don't want", 'not ', 'except', 'other than',
    'не хочу', 'не нравится', 'кроме', 'исключая', 'не ',
  ];
  const disliked: string[] = [];
  for (const d of destinations) {
    const name = d.name.toLowerCase();
    const country = d.country.toLowerCase();
    const idx = t.indexOf(name) >= 0 ? t.indexOf(name) : t.indexOf(country);
    if (idx < 0) continue;
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
    if (prefs.destinationWish && disliked.includes(prefs.destinationWish as string)) {
      prefs.destinationWish = undefined;
    }
  }
  if ((t.includes('europ') || t.includes('европ')) && !t.includes('nu ') && !t.includes('не '))
    prefs.destinationWish = prefs.destinationWish ?? 'europ';

  return prefs;
}

const TXT: Record<Language, Record<string, string>> = {
  ro: {
    packingIntro: 'Pentru **{name}** (climă {climate}), iată ce ți-aș pune în bagaj:',
    packingOutro: 'Găsești lista completă și interactivă în pagina **Planifică → Listă de bagaje**. Vrei să o adaptez pentru mai multe zile?',
    packingSug1: 'Vreau lista completă',
    packingSug2: 'Recomandă-mi hoteluri acolo',
    packingSug3: 'Cât ar costa vacanța?',
    budgetIntro: 'Iată câteva estimări pentru bugetul și preferințele tale:',
    budgetLine: '• **{name}** — de la ~{price}€ pentru {days} zile',
    budgetOutro: 'Prețurile includ transport, cazare, mâncare și activități. Vrei să deschid calculatorul de buget detaliat pentru una dintre ele?',
    budgetSug1: 'Deschide calculatorul de buget',
    budgetSug2: 'Vreau varianta cea mai ieftină',
    budgetSug3: 'Fă-mi un itinerar',
    itinIntro: 'Perfect! Pe baza a ceea ce mi-ai spus, îți recomand **{name}, {country}** (compatibilitate {score}%).\n\nAm pregătit un itinerar zi-cu-zi cu obiective, restaurante, timpi și costuri estimate. Apasă „Vezi itinerarul" pe cardul de mai jos ca să îl deschid, apoi îl putem ajusta împreună — pot face o zi mai relaxată, pot înlocui activități sau reface complet o zi.',
    itinSug1: 'Fă programul mai relaxat',
    itinSug2: 'Vreau alte 2 variante',
    itinSug3: 'Recomandă restaurante',
    restIntro: 'Recomandările mele culinare pentru **{name}**:',
    restLine: '• **{name}** ({cuisine}) — nota {rating}/10. {note}',
    restOutro: 'Am ales o combinație de fine dining, autentic local și opțiuni accesibile, ca să acoperim toate momentele zilei. Vrei și obiective turistice în apropiere?',
    restSug1: 'Da, obiective turistice',
    restSug2: 'Fă-mi un itinerar aici',
    restSug3: 'Recomandă hoteluri',
    hotelsIntro: 'Pentru **{name}** am {count} hoteluri. Cele mai bine cotate:',
    hotelsLine: '• **{name}** {stars} — de la {price}€/noapte, scor {score} ({label}). {neighborhood}, {rooms} tipuri de cameră.',
    hotelsOutro: 'Fiecare are mai multe tipuri de cameră, cu prețuri diferite, anulare gratuită și opțiuni de mic dejun. Deschide pagina **Hoteluri** ca să vezi toate camerele și să filtrezi după preț, stele sau scor. Vrei să estimez bugetul total al sejurului?',
    hotelsSug1: 'Vreau toate hotelurile',
    hotelsSug2: 'Estimează bugetul',
    hotelsSug3: 'Ce activități sunt acolo?',
    attrIntro: 'Cele mai frumoase experiențe din **{name}**:',
    attrLine: '• **{name}** ({category}) — ~{hours}h{cost}. {description}',
    attrFree: ', gratuit',
    attrOutro: 'Le pot organiza într-un itinerar zi-cu-zi optimizat ca distanțe și timp. Îl construiesc?',
    attrSug1: 'Da, construiește itinerarul',
    attrSug2: 'Recomandă restaurante',
    attrSug3: 'Cât costă în total?',
    generalIntroType: 'Am înțeles — cauți ceva cu accent pe **{types}**.',
    generalIntroDefault: 'Am câteva idei excelente pentru tine.',
    generalLine: '• **{name}, {country}** — potrivire {score}%. {reason}',
    generalOutro: 'Fiecare recomandare are o notă de compatibilitate calculată din preferințele tale. Apasă pe un card pentru detalii complete și itinerar. Cu ce te pot ajuta mai departe?',
    generalSug1: 'Fă-mi un itinerar pentru prima',
    generalSug2: 'Vreau ceva mai ieftin',
    generalSug3: 'Ce climă are prima?',
  },
  en: {
    packingIntro: "For **{name}** ({climate} climate), here's what I'd pack:",
    packingOutro: 'You can find the full, interactive list on the **Plan → Packing list** page. Want me to adapt it for more days?',
    packingSug1: 'I want the full list',
    packingSug2: 'Recommend hotels there',
    packingSug3: 'How much would the trip cost?',
    budgetIntro: 'Here are some estimates for your budget and preferences:',
    budgetLine: '• **{name}** — from ~€{price} for {days} days',
    budgetOutro: 'Prices include transport, accommodation, food and activities. Want me to open the detailed budget calculator for one of them?',
    budgetSug1: 'Open the budget calculator',
    budgetSug2: 'I want the cheapest option',
    budgetSug3: 'Build me an itinerary',
    itinIntro: 'Great! Based on what you told me, I recommend **{name}, {country}** ({score}% match).\n\nI\'ve prepared a day-by-day itinerary with sights, restaurants, timing and estimated costs. Tap "View itinerary" on the card below to open it, and then we can adjust it together — I can make a day more relaxed, swap activities, or redo a day entirely.',
    itinSug1: 'Make the schedule more relaxed',
    itinSug2: 'Show me 2 more options',
    itinSug3: 'Recommend restaurants',
    restIntro: 'My food recommendations for **{name}**:',
    restLine: '• **{name}** ({cuisine}) — rated {rating}/10. {note}',
    restOutro: "I picked a mix of fine dining, authentic local spots and affordable options, to cover every time of day. Want nearby attractions too?",
    restSug1: 'Yes, attractions',
    restSug2: 'Build me an itinerary here',
    restSug3: 'Recommend hotels',
    hotelsIntro: 'For **{name}** I have {count} hotels. The top-rated ones:',
    hotelsLine: '• **{name}** {stars} — from €{price}/night, score {score} ({label}). {neighborhood}, {rooms} room types.',
    hotelsOutro: 'Each has several room types, at different prices, with free cancellation and breakfast options. Open the **Hotels** page to see all the rooms and filter by price, stars or score. Want me to estimate the total budget for the stay?',
    hotelsSug1: 'I want all the hotels',
    hotelsSug2: 'Estimate the budget',
    hotelsSug3: "What activities are there?",
    attrIntro: 'The best experiences in **{name}**:',
    attrLine: '• **{name}** ({category}) — ~{hours}h{cost}. {description}',
    attrFree: ', free',
    attrOutro: "I can organize them into a day-by-day itinerary optimized for distance and time. Shall I build it?",
    attrSug1: 'Yes, build the itinerary',
    attrSug2: 'Recommend restaurants',
    attrSug3: 'What is the total cost?',
    generalIntroType: "Got it — you're after something focused on **{types}**.",
    generalIntroDefault: 'I have a few great ideas for you.',
    generalLine: '• **{name}, {country}** — {score}% match. {reason}',
    generalOutro: "Each recommendation has a match score calculated from your preferences. Tap a card for full details and an itinerary. What else can I help with?",
    generalSug1: 'Build an itinerary for the first one',
    generalSug2: 'I want something cheaper',
    generalSug3: "What's the climate like for the first one?",
  },
  ru: {
    packingIntro: 'Для **{name}** (климат {climate}) вот что я бы взял с собой:',
    packingOutro: 'Полный интерактивный список есть на странице **Планирование → Список вещей**. Адаптировать его на другое число дней?',
    packingSug1: 'Хочу полный список',
    packingSug2: 'Порекомендуйте отели там',
    packingSug3: 'Сколько будет стоить поездка?',
    budgetIntro: 'Вот несколько оценок для вашего бюджета и предпочтений:',
    budgetLine: '• **{name}** — от ~{price}€ за {days} дней',
    budgetOutro: 'Цены включают транспорт, проживание, еду и активности. Открыть подробный калькулятор бюджета для одного из вариантов?',
    budgetSug1: 'Открыть калькулятор бюджета',
    budgetSug2: 'Хочу самый дешёвый вариант',
    budgetSug3: 'Составьте маршрут',
    itinIntro: 'Отлично! На основе того, что вы рассказали, рекомендую **{name}, {country}** (совпадение {score}%).\n\nЯ подготовил маршрут по дням с достопримечательностями, ресторанами, временем и примерной стоимостью. Нажмите «Смотреть маршрут» на карточке ниже, чтобы открыть его, а затем мы сможем скорректировать его вместе — я могу сделать день более расслабленным, заменить активности или полностью переделать день.',
    itinSug1: 'Сделайте программу более расслабленной',
    itinSug2: 'Покажите ещё 2 варианта',
    itinSug3: 'Порекомендуйте рестораны',
    restIntro: 'Мои кулинарные рекомендации для **{name}**:',
    restLine: '• **{name}** ({cuisine}) — оценка {rating}/10. {note}',
    restOutro: 'Я выбрал сочетание высокой кухни, аутентичных местных мест и доступных вариантов, чтобы охватить всё время дня. Показать также ближайшие достопримечательности?',
    restSug1: 'Да, достопримечательности',
    restSug2: 'Составьте маршрут здесь',
    restSug3: 'Порекомендуйте отели',
    hotelsIntro: 'Для **{name}** у меня есть {count} отелей. Лучшие по оценке:',
    hotelsLine: '• **{name}** {stars} — от {price}€/ночь, оценка {score} ({label}). {neighborhood}, {rooms} типов номеров.',
    hotelsOutro: 'У каждого есть несколько типов номеров по разным ценам, с бесплатной отменой и вариантами завтрака. Откройте страницу **Отели**, чтобы увидеть все номера и фильтровать по цене, звёздам или оценке. Оценить общий бюджет проживания?',
    hotelsSug1: 'Хочу все отели',
    hotelsSug2: 'Оцените бюджет',
    hotelsSug3: 'Какие там есть активности?',
    attrIntro: 'Лучшие впечатления в **{name}**:',
    attrLine: '• **{name}** ({category}) — ~{hours}ч{cost}. {description}',
    attrFree: ', бесплатно',
    attrOutro: 'Я могу организовать их в маршрут по дням, оптимизированный по расстоянию и времени. Составить его?',
    attrSug1: 'Да, составьте маршрут',
    attrSug2: 'Порекомендуйте рестораны',
    attrSug3: 'Сколько это будет стоить всего?',
    generalIntroType: 'Понял — вы ищете что-то с акцентом на **{types}**.',
    generalIntroDefault: 'У меня есть несколько отличных идей для вас.',
    generalLine: '• **{name}, {country}** — совпадение {score}%. {reason}',
    generalOutro: 'У каждой рекомендации есть оценка совпадения, рассчитанная по вашим предпочтениям. Нажмите на карточку для полной информации и маршрута. Чем ещё могу помочь?',
    generalSug1: 'Составьте маршрут для первого варианта',
    generalSug2: 'Хочу что-то подешевле',
    generalSug3: 'Какой климат у первого варианта?',
  },
};

function fmt(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  return out;
}

export function generateDemoReply(
  userText: string,
  prefs: TravelPreferences,
  lang: Language = 'ro',
): DemoReply {
  const t = userText.toLowerCase();
  const s = TXT[lang];

  // 1. Bagaje
  if (includesAny(t, lang, 'packing')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[0];
    const list = generatePackingList(dest, Number(prefs.days) || 7, lang);
    const preview = list.map((c) => `${c.icon} **${c.category}**: ${c.items.slice(0, 3).join(', ')}...`).join('\n');
    return {
      content: `${fmt(s.packingIntro, { name: dest.name, climate: dest.climate })}\n\n${preview}\n\n${s.packingOutro}`,
      suggestions: [s.packingSug1, s.packingSug2, s.packingSug3],
    };
  }

  // 2. Buget / cost
  if (includesAny(t, lang, 'budget')) {
    const merged = extractPrefs(userText, prefs);
    const recs = getRecommendations(merged, 3, lang);
    const lines = recs
      .map((r) => fmt(s.budgetLine, { name: r.destination.name, price: r.estimatedPrice, days: Number(merged.days) || r.destination.recommendedDays }))
      .join('\n');
    return {
      content: `${s.budgetIntro}\n\n${lines}\n\n${s.budgetOutro}`,
      recommendations: recs,
      suggestions: [s.budgetSug1, s.budgetSug2, s.budgetSug3],
    };
  }

  // 3. Itinerar
  if (includesAny(t, lang, 'itinerary')) {
    const merged = extractPrefs(userText, prefs);
    const recs = getRecommendations(merged, 3, lang);
    const top = recs[0];
    const topDest = localizeDestination(top.destination, lang);
    return {
      content: fmt(s.itinIntro, { name: topDest.name, country: topDest.country, score: top.matchScore }),
      recommendations: recs,
      suggestions: [s.itinSug1, s.itinSug2, s.itinSug3],
    };
  }

  // 4. Restaurante
  if (includesAny(t, lang, 'restaurants')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[2];
    const localized = localizeDestination(dest, lang);
    const list = localized.restaurants
      .map((r) => fmt(s.restLine, { name: r.name, cuisine: r.cuisine, rating: r.rating, note: r.note }))
      .join('\n');
    return {
      content: `${fmt(s.restIntro, { name: localized.name })}\n\n${list}\n\n${s.restOutro}`,
      suggestions: [s.restSug1, s.restSug2, s.restSug3],
    };
  }

  // 5. Hoteluri / cazare
  if (includesAny(t, lang, 'hotels')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[0];
    const destHotels = [...getHotelsByDestination(dest.id)]
      .sort((a, b) => b.reviewScore - a.reviewScore)
      .map((h) => localizeHotel(h, lang));
    const list = destHotels
      .slice(0, 4)
      .map((h) =>
        fmt(s.hotelsLine, {
          name: h.name,
          stars: '⭐'.repeat(h.stars),
          price: cheapestRoomPrice(h),
          score: h.reviewScore.toFixed(1),
          label: h.reviewLabel,
          neighborhood: h.neighborhood,
          rooms: h.rooms.length,
        }),
      )
      .join('\n');
    return {
      content: `${fmt(s.hotelsIntro, { name: dest.name, count: destHotels.length })}\n\n${list}\n\n${s.hotelsOutro}`,
      suggestions: [s.hotelsSug1, s.hotelsSug2, s.hotelsSug3],
    };
  }

  // 6. Obiective / activități
  if (includesAny(t, lang, 'attractions')) {
    const dest =
      destinations.find((d) => t.includes(d.name.toLowerCase())) ??
      getDestinationById((prefs.destinationWish as string) ?? '') ??
      destinations[1];
    const localized = localizeDestination(dest, lang);
    const list = localized.attractions
      .map((a) =>
        fmt(s.attrLine, {
          name: a.name,
          category: a.category,
          hours: a.durationHours,
          cost: a.cost ? `, ${a.cost}€` : s.attrFree,
          description: a.description,
        }),
      )
      .join('\n');
    return {
      content: `${fmt(s.attrIntro, { name: localized.name })}\n\n${list}\n\n${s.attrOutro}`,
      suggestions: [s.attrSug1, s.attrSug2, s.attrSug3],
    };
  }

  // 7. Recomandare generală / destinații
  const merged = extractPrefs(userText, prefs);
  const recs = getRecommendations(merged, 3, lang);
  const typeSummary = ((merged.tripTypes as string[]) ?? [])
    .map((x) => tripTypeLabel(lang, x)?.toLowerCase())
    .filter(Boolean)
    .join(', ');

  const intro = typeSummary ? fmt(s.generalIntroType, { types: typeSummary }) : s.generalIntroDefault;

  const body = recs
    .map((r) => {
      const d = localizeDestination(r.destination, lang);
      return fmt(s.generalLine, { name: d.name, country: d.country, score: r.matchScore, reason: r.reasons[0] });
    })
    .join('\n');

  return {
    content: `${intro}\n\n${body}\n\n${s.generalOutro}`,
    recommendations: recs,
    suggestions: [s.generalSug1, s.generalSug2, s.generalSug3],
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
