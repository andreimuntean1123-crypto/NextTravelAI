// Conținut demonstrativ: recenzii, FAQ, oferte, oferte speciale.
// Numele, locațiile și călătoriile din recenzii rămân neschimbate în toate
// limbile (sunt personaje demonstrative reale, nu se „traduc"). Câmpurile
// `text`/`q`/`a`/`title`/`badge` conțin CHEI de traducere, rezolvate cu t()
// la afișare — nu text literal — ca site-ul să apară corect în RO/EN/RU.

export interface Review {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string; // cheie de traducere
  trip: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Andreea Marin',
    location: 'București',
    avatar: 'https://i.pravatar.cc/120?img=45',
    rating: 5,
    text: 'review.r1.text',
    trip: 'Kyoto, Japonia',
  },
  {
    id: 'r2',
    name: 'Radu Ionescu',
    location: 'Cluj-Napoca',
    avatar: 'https://i.pravatar.cc/120?img=12',
    rating: 5,
    text: 'review.r2.text',
    trip: 'Santorini, Grecia',
  },
  {
    id: 'r3',
    name: 'Elena Popescu',
    location: 'Timișoara',
    avatar: 'https://i.pravatar.cc/120?img=32',
    rating: 5,
    text: 'review.r3.text',
    trip: 'Costa Rica',
  },
  {
    id: 'r4',
    name: 'Mihai Georgescu',
    location: 'Iași',
    avatar: 'https://i.pravatar.cc/120?img=68',
    rating: 4,
    text: 'review.r4.text',
    trip: 'Barcelona, Spania',
  },
  {
    id: 'r5',
    name: 'Cristina Dumitru',
    location: 'Brașov',
    avatar: 'https://i.pravatar.cc/120?img=25',
    rating: 5,
    text: 'review.r5.text',
    trip: 'Zermatt, Elveția',
  },
  {
    id: 'r6',
    name: 'Alexandru Stan',
    location: 'Constanța',
    avatar: 'https://i.pravatar.cc/120?img=59',
    rating: 5,
    text: 'review.r6.text',
    trip: 'Lisabona, Portugalia',
  },
];

export interface FaqItem {
  q: string; // cheie de traducere
  a: string; // cheie de traducere
}

export const faqs: FaqItem[] = [
  { q: 'faq.q1.q', a: 'faq.q1.a' },
  { q: 'faq.q2.q', a: 'faq.q2.a' },
  { q: 'faq.q3.q', a: 'faq.q3.a' },
  { q: 'faq.q4.q', a: 'faq.q4.a' },
  { q: 'faq.q5.q', a: 'faq.q5.a' },
  { q: 'faq.q6.q', a: 'faq.q6.a' },
  { q: 'faq.q7.q', a: 'faq.q7.a' },
];

export interface Offer {
  id: string;
  destinationId: string;
  badge: string; // cheie de traducere
  title: string; // cheie de traducere
  oldPrice: number;
  newPrice: number;
  nights: number;
}

export const offers: Offer[] = [
  { id: 'o1', destinationId: 'lisabona', badge: 'offer.o1.badge', title: 'offer.o1.title', oldPrice: 520, newPrice: 364, nights: 3 },
  { id: 'o2', destinationId: 'bali', badge: 'offer.o2.badge', title: 'offer.o2.title', oldPrice: 1290, newPrice: 990, nights: 8 },
  { id: 'o3', destinationId: 'praga', badge: 'offer.o3.badge', title: 'offer.o3.title', oldPrice: 410, newPrice: 308, nights: 3 },
  { id: 'o4', destinationId: 'barcelona', badge: 'offer.o4.badge', title: 'offer.o4.title', oldPrice: 640, newPrice: 520, nights: 4 },
];
