import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { QuestionnaireProvider } from '@/context/QuestionnaireContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { AiChatWidget } from '@/components/chat/AiChatWidget';
import { Home } from '@/pages/Home';

// Paginile mai grele sunt încărcate la cerere (code-splitting) pentru viteză.
const Discover = lazy(() => import('@/pages/Discover').then((m) => ({ default: m.Discover })));
const Hotels = lazy(() => import('@/pages/Hotels').then((m) => ({ default: m.Hotels })));
const Cities = lazy(() => import('@/pages/Cities').then((m) => ({ default: m.Cities })));
const CityDetail = lazy(() => import('@/pages/CityDetail').then((m) => ({ default: m.CityDetail })));
const Plan = lazy(() => import('@/pages/Plan').then((m) => ({ default: m.Plan })));
const Results = lazy(() => import('@/pages/Results').then((m) => ({ default: m.Results })));
const DestinationDetail = lazy(() =>
  import('@/pages/DestinationDetail').then((m) => ({ default: m.DestinationDetail })),
);
const ItineraryDetail = lazy(() =>
  import('@/pages/ItineraryDetail').then((m) => ({ default: m.ItineraryDetail })),
);
const MyItineraries = lazy(() =>
  import('@/pages/MyItineraries').then((m) => ({ default: m.MyItineraries })),
);
const Favorites = lazy(() => import('@/pages/Favorites').then((m) => ({ default: m.Favorites })));
const Compare = lazy(() => import('@/pages/Compare').then((m) => ({ default: m.Compare })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })));
const Account = lazy(() => import('@/pages/Account').then((m) => ({ default: m.Account })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-200 border-t-turquoise-500 dark:border-navy-800 dark:border-t-turquoise-400" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <QuestionnaireProvider>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/descopera" element={<Discover />} />
                  <Route path="/orase" element={<Cities />} />
                  <Route path="/oras/:id" element={<CityDetail />} />
                  <Route path="/hoteluri" element={<Hotels />} />
                  <Route path="/planifica" element={<Plan />} />
                  <Route path="/rezultate" element={<Results />} />
                  <Route path="/destinatie/:id" element={<DestinationDetail />} />
                  <Route path="/itinerar/:id" element={<ItineraryDetail />} />
                  <Route path="/itinerariile-mele" element={<MyItineraries />} />
                  <Route path="/favorite" element={<Favorites />} />
                  <Route path="/compara" element={<Compare />} />
                  <Route path="/despre" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cont" element={<Account />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <AiChatWidget />
          </div>
        </QuestionnaireProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
