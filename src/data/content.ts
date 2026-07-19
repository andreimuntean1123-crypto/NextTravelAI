// Conținut demonstrativ: recenzii, FAQ, oferte, oferte speciale.

export interface Review {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  trip: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Andreea Marin',
    location: 'București',
    avatar: 'https://i.pravatar.cc/120?img=45',
    rating: 5,
    text: 'Agentul AI mi-a construit un itinerar de 6 zile în Kyoto perfect adaptat ritmului nostru. Ne-a recomandat un ryokan superb și restaurante pe care nu le-am fi găsit niciodată singuri!',
    trip: 'Kyoto, Japonia',
  },
  {
    id: 'r2',
    name: 'Radu Ionescu',
    location: 'Cluj-Napoca',
    avatar: 'https://i.pravatar.cc/120?img=12',
    rating: 5,
    text: 'Am cerut o escapadă romantică sub 2000€ și mi-a propus Santorini cu explicații clare pentru fiecare alegere. Calculatorul de buget a fost extrem de util.',
    trip: 'Santorini, Grecia',
  },
  {
    id: 'r3',
    name: 'Elena Popescu',
    location: 'Timișoara',
    avatar: 'https://i.pravatar.cc/120?img=32',
    rating: 5,
    text: 'Călătorim cu doi copii mici și a ținut cont de tot: program relaxat, cazare centrală, activități potrivite vârstei. Costa Rica a fost o alegere excelentă!',
    trip: 'Costa Rica',
  },
  {
    id: 'r4',
    name: 'Mihai Georgescu',
    location: 'Iași',
    avatar: 'https://i.pravatar.cc/120?img=68',
    rating: 4,
    text: 'Îmi place că pot modifica itinerarul din mers și că AI-ul reface ziua când cer. Am ajustat bugetul de câteva ori și mi-a dat variante realiste de fiecare dată.',
    trip: 'Barcelona, Spania',
  },
  {
    id: 'r5',
    name: 'Cristina Dumitru',
    location: 'Brașov',
    avatar: 'https://i.pravatar.cc/120?img=25',
    rating: 5,
    text: 'Lista de bagaje generată automat și informațiile despre vreme m-au scutit de stres. Recomand oricui vrea o vacanță bine organizată fără efort.',
    trip: 'Zermatt, Elveția',
  },
  {
    id: 'r6',
    name: 'Alexandru Stan',
    location: 'Constanța',
    avatar: 'https://i.pravatar.cc/120?img=59',
    rating: 5,
    text: 'Cel mai bun instrument de planificare pe care l-am folosit. Nota de compatibilitate m-a ajutat să aleg rapid între cinci destinații foarte bune.',
    trip: 'Lisabona, Portugalia',
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: 'Cum funcționează agentul AI de călătorii?',
    a: 'Îți pune câteva întrebări despre preferințe (destinație, buget, stil de vacanță, activități) și analizează răspunsurile pentru a-ți propune destinații, itinerare, hoteluri și restaurante potrivite. Îți explică de ce a ales fiecare recomandare și poate modifica planul oricând.',
  },
  {
    q: 'Trebuie să plătesc pentru a folosi NextTravelAI?',
    a: 'Nu. Planificarea, chestionarul, itinerarele, calculatorul de buget și toate uneltele sunt gratuite. Rezervările efective se fac la partenerii noștri, iar prețurile afișate sunt estimative.',
  },
  {
    q: 'Recomandările sunt personalizate cu adevărat?',
    a: 'Da. Fiecare recomandare primește o notă de compatibilitate calculată pe baza răspunsurilor tale: climă, buget, tip de vacanță, activități, ritm și preferințe de cazare. Cu cât ne spui mai multe, cu atât potrivirea e mai bună.',
  },
  {
    q: 'Îmi pot salva preferințele și itinerarele?',
    a: 'Absolut. Totul se salvează local, pe dispozitivul tău, prin localStorage — favorite, itinerare, bugete și istoricul conversațiilor cu agentul. Nu ai nevoie de cont pentru a începe.',
  },
  {
    q: 'Pot modifica un itinerar generat?',
    a: 'Da. Poți adăuga, elimina sau muta activități, poți cere AI-ului să refacă o zi, să facă programul mai relaxat sau mai activ, ori să reajusteze bugetul. Itinerarul e complet flexibil.',
  },
  {
    q: 'Datele mele sunt în siguranță?',
    a: 'În versiunea demonstrativă, datele rămân doar pe dispozitivul tău, în browser. Nu le trimitem nicăieri. Când conectăm servicii externe, o facem transparent și cu acordul tău.',
  },
  {
    q: 'Pot exporta itinerarul?',
    a: 'Da. Poți exporta itinerarul într-un document PDF printabil și îl poți distribui cu un singur click prietenilor sau familiei.',
  },
];

export interface Offer {
  id: string;
  destinationId: string;
  badge: string;
  title: string;
  oldPrice: number;
  newPrice: number;
  nights: number;
}

export const offers: Offer[] = [
  { id: 'o1', destinationId: 'lisabona', badge: '-30%', title: 'Escapadă de weekend în Lisabona', oldPrice: 520, newPrice: 364, nights: 3 },
  { id: 'o2', destinationId: 'bali', badge: 'Early bird', title: 'Retreat de wellness în Bali', oldPrice: 1290, newPrice: 990, nights: 8 },
  { id: 'o3', destinationId: 'praga', badge: '-25%', title: 'City-break de basm la Praga', oldPrice: 410, newPrice: 308, nights: 3 },
  { id: 'o4', destinationId: 'barcelona', badge: 'Ofertă', title: 'Soare & tapas în Barcelona', oldPrice: 640, newPrice: 520, nights: 4 },
];

// Etichete lizibile pentru valorile din chestionar / date.
export const tripTypeLabels: Record<string, string> = {
  plaja: 'Plajă',
  munte: 'Munte',
  'city-break': 'City-break',
  natura: 'Natură',
  aventura: 'Aventură',
  relaxare: 'Relaxare',
  cultura: 'Cultură',
  gastronomie: 'Gastronomie',
  shopping: 'Shopping',
  'viata-de-noapte': 'Viață de noapte',
  romantica: 'Romantică',
  familie: 'Familie',
};

export const climateLabels: Record<string, string> = {
  calda: 'Caldă',
  racoroasa: 'Răcoroasă',
  tropicala: 'Tropicală',
  zapada: 'Cu zăpadă',
  indiferent: 'Fără preferință',
};

export const transportLabels: Record<string, string> = {
  avion: 'Avion',
  masina: 'Mașină',
  tren: 'Tren',
  autobuz: 'Autobuz',
  croaziera: 'Croazieră',
};
