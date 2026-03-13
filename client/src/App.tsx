import { Toaster } from "@/components/ui/sonner";
import { useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ReservationProvider } from "./contexts/ReservationContext";
import { Route, Switch, useLocation } from "wouter";
import Header from "./components/Header";
import PromoBanner from "./components/PromoBanner";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Consultations from "./pages/Consultations";

import Events from "./pages/Events";
import EventsListing from "./pages/EventsListing";

import Contact from "./pages/Contact";
import BookingSelectType from "./pages/BookingSelectType";
import BookingForm from "./pages/BookingForm";
import BookingSchedule from "./pages/BookingSchedule";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardHome from "./pages/AdminDashboardHome";
import AdminCalendar from "./pages/AdminCalendar";
import AdminCalendarAgenda from "./pages/AdminCalendarAgenda";
import AdminStats from "./pages/AdminStats";
import AdminPayments from "./pages/AdminPayments";
import AdminClientFiles from "./pages/AdminClientFiles";
import AdminLogin from "./pages/AdminLogin";
import BookingPayment from "./pages/BookingPayment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Conference from "./pages/Conference";
import Salon from "./pages/Salon";
import { MentionsLegales, PolitiqueConfidentialite, ConditionsUtilisation } from "./pages/LegalPages";
import PromoPayment10min from "./pages/PromoPayment10min";


/**
 * Design Philosophy: Mysticisme Galactique Luxe
 * 
 * Ce site incarne l'élégance mystique en fusionnant le cosmos avec l'intimité spirituelle.
 * Couleurs: Fonds sombres galactiques avec accents dorés chauds
 * Typographie: Cursive élégante (titres) + sans-serif moderne (corps)
 * Animations: Transitions fluides, particules flottantes, glow effects
 */
function Router() {
  const [location] = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/consultations" component={Consultations} />

      <Route path="/events" component={Events} />
      <Route path="/events/conference" component={Conference} />
      <Route path="/events/salon" component={Salon} />
      <Route path="/events-listing" component={EventsListing} />

      <Route path="/contact" component={Contact} />
      <Route path="/booking" component={BookingSelectType} />
      <Route path="/booking/form" component={BookingForm} />
      <Route path="/booking/schedule" component={BookingSchedule} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      <Route path="/booking/payment" component={BookingPayment} />
      <Route path="/booking/success" component={PaymentSuccess} />
      <Route path="/promo-10min" component={PromoPayment10min} />

      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/calendar" component={AdminCalendar} />
      <Route path="/admin/calendar-agenda" component={AdminCalendarAgenda} />
      <Route path="/admin/stats" component={AdminStats} />
      <Route path="/admin/payments" component={AdminPayments} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboardHome} />
      <Route path="/admin/fichierclient" component={AdminClientFiles} />
      <Route path="/legal/mentions" component={MentionsLegales} />
      <Route path="/legal/privacy" component={PolitiqueConfidentialite} />
      <Route path="/legal/cgu" component={ConditionsUtilisation} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ReservationProvider>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <PromoBanner />
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </ReservationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default App;
