# 🌍 NextTravelAI

**Agentul tău personal de călătorii cu inteligență artificială.** Descoperă destinații,
construiește itinerare, estimează bugete și primește recomandări personalizate — totul într-o
interfață modernă, elegantă și complet responsive.

Aplicația funcționează **imediat, fără nicio cheie API**, în mod demonstrativ, cu date realiste.
Este pregătită să fie conectată ușor la servicii reale (AI, zboruri, hoteluri, vreme, hărți).

---

## ✨ Funcționalități

- **Agent AI conversațional** — chat plutitor care recomandă destinații, hoteluri, restaurante,
  activități, construiește itinerare, estimează bugetul și sugerează ce să pui în bagaj.
- **Chestionar pe 30 de pași** — cu bară de progres, carduri, selecție multiplă și câmpuri libere.
- **Recomandări personalizate** — până la 5 destinații cu **notă de compatibilitate**, motive,
  avantaje și dezavantaje.
- **Itinerar editabil zi-cu-zi** — dimineața / prânz / după-amiaza / seara, cu obiective,
  restaurante, timpi, costuri și distanțe. Poți adăuga, elimina, muta activități, reface o zi
  cu AI, schimba ritmul și exporta în **PDF**.
- **Calculator de buget** — transport, cazare, mâncare, activități, transport local, cumpărături
  și fond de urgențe, cu grafic și totaluri (total / persoană / zi / rămas).
- **Descoperă & filtrează** — după preț, țară, climă, durată, tip, transport, rating, popularitate.
- **Comparație** între destinații (până la 3), **favorite**, **hartă interactivă** demonstrativă,
  **listă de bagaje** interactivă, **prognoză meteo**, **galerie foto**.
- **Cont utilizator** — profil, preferințe, itinerare, favorite, istoricul conversațiilor, bugete
  salvate și notificări.
- **Mod luminos / întunecat**, **schimbare limbă** (RO / EN / RU — traducere completă a
  interfeței, a conținutului destinațiilor, hotelurilor și agentului AI, nu doar a meniului)
  și **monedă** (EUR / RON / USD / GBP).
- **Persistență locală** completă prin `localStorage` — nimic nu se trimite în afară în modul demo.

---

## 🛠️ Tehnologii

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build & dev server)
- [Tailwind CSS](https://tailwindcss.com/) (design system)
- [React Router](https://reactrouter.com/) (rutare)
- [Recharts](https://recharts.org/) (grafic buget)
- [lucide-react](https://lucide.dev/) (iconițe)

---

## 🚀 Pornire rapidă

```bash
# 1. Instalează dependențele
npm install

# 2. Pornește serverul de dezvoltare
npm run dev
# → http://localhost:5173

# 3. Build de producție
npm run build

# 4. Previzualizează build-ul
npm run preview
```

Nu ai nevoie de nicio cheie API pentru a rula aplicația.

---

## 🔌 Conectarea la API-uri reale (opțional)

Aplicația e construită cu un **strat de servicii** (`src/lib/aiService.ts`) care comută automat
de la modul demo la API-ul real când există o cheie. Cheile se citesc din variabile de mediu Vite,
**niciodată din cod**.

```bash
cp .env.example .env
```

Apoi completează în `.env` cheile pe care le ai:

| Variabilă                 | Serviciu                              |
| ------------------------- | ------------------------------------- |
| `VITE_AI_PROVIDER`        | `demo` \| `anthropic` \| `openai`     |
| `VITE_AI_API_KEY`         | Cheia agentului AI                    |
| `VITE_AI_MODEL`           | Modelul (ex. `claude-sonnet-5`)       |
| `VITE_FLIGHTS_API_KEY`    | API zboruri (ex. Amadeus)             |
| `VITE_HOTELS_API_KEY`     | API hoteluri (ex. Booking)            |
| `VITE_WEATHER_API_KEY`    | API vreme (ex. OpenWeather)           |
| `VITE_MAPS_API_KEY`       | Google Maps / MapLibre                |

> ⚠️ **Securitate:** cheile expuse în browser sunt vizibile pentru utilizatori. În producție,
> rutează apelurile printr-un backend / funcție serverless proxy. Vezi comentariile din
> `src/lib/aiService.ts` pentru scheletul de integrare (ex. Anthropic Messages API).

Fișierul `.env` este ignorat de git (vezi `.gitignore`), deci cheia ta nu ajunge în repository.

---

## 📁 Structura proiectului

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, ScrollToTop
│   ├── home/         # Hero, secțiuni pagina principală
│   ├── destinations/ # DestinationCard
│   ├── questionnaire/# Chestionarul multi-pas
│   ├── results/      # Cardul de recomandare
│   ├── budget/       # Calculatorul de buget
│   ├── chat/         # Widget-ul agentului AI
│   ├── tools/        # Hartă, listă bagaje, vreme
│   └── ui/           # Componente reutilizabile (Modal, MatchRing, ...)
├── pages/            # Paginile aplicației (rutate)
├── context/          # AppContext (stare globală) + QuestionnaireContext
├── data/             # Date demonstrative (destinații, chestionar, conținut)
├── lib/              # Logică: recomandări, itinerar, buget, AI, vreme, storage
├── hooks/            # Hook-uri reutilizabile
├── i18n/             # Traduceri interfață (RO / EN)
└── types/            # Tipuri TypeScript centrale
```

---

## 📝 Note

- Toate datele (destinații, hoteluri, restaurante, activități) sunt **demonstrative, dar realiste**.
- Imaginile sunt încărcate de la [Unsplash](https://unsplash.com/).
- Agentul AI în mod demo generează răspunsuri inteligente pe baza opțiunilor selectate de utilizator.

Vacanță plăcută! ✈️🏖️⛰️
