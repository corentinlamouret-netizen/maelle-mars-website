import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useReservationContext } from "@/contexts/ReservationContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

declare global {
  interface Window {
    paypal?: any;
  }
}

const PAYPAL_CLIENT_ID = "BAAkEwqcwMjcJooftki1j1_4uzTUYKI09g7AEmy3D78PawKmx0MF2ade8HZrYPeCix7lOfoi5s27OKFpRo";

const BUTTON_IDS: Record<string, string> = {
  "10min": "66Y83EBJ3X5RQ",  // 15€ — 10 min (promo)
  "15min": "66Y83EBJ3X5RQ",  // 15€ — 15 min (promo)
  "25min": "CQUSTKUNSPX7G",  // 70€ — 20 min
  "30min": "WBBNVANB7V3YE",  // 90€ — 30 min
  "40min": "DQ59JJ2SQZK6W",  // 110€ — 45 min
  "1hour": "PY49XXE7JCPHG",  // 130€ — 1h
};

const PRICES: Record<string, number> = {
  "10min": 15,
  "15min": 15,
  "25min": 70,
  "30min": 90,
  "40min": 110,
  "1hour": 130,
};

const LABELS: Record<string, string> = {
  "10min": "Consultation express - 10 minutes",
  "15min": "Consultation express - 15 minutes",
  "25min": "Consultation rapide - 20 minutes",
  "30min": "Consultation standard - 30 minutes",
  "40min": "Consultation approfondie - 45 minutes",
  "1hour": "Consultation premium - 1 heure",
};

export default function BookingPayment() {
  const { reservation } = useReservationContext();
  const [, setLocation] = useLocation();
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  const consultationType = reservation.consultationType ?? "25min";
  const buttonId = BUTTON_IDS[consultationType] ?? BUTTON_IDS["25min"];
  const price = PRICES[consultationType] ?? 70;
  const label = LABELS[consultationType] ?? "";
  const containerId = `paypal-container-${buttonId}`;

  // Redirect if no reservation data
  useEffect(() => {
    if (!reservation.firstName || !reservation.consultationType) {
      setLocation("/booking");
    }
  }, [reservation, setLocation]);

  // Load PayPal SDK and render button
  useEffect(() => {
    if (!buttonId) return;
    renderedRef.current = false;

    const scriptId = "paypal-sdk-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderButton = () => {
      if (renderedRef.current) return;
      const container = document.getElementById(containerId);
      if (!container || !window.paypal) return;
      // Clear previous render
      container.innerHTML = "";
      renderedRef.current = true;
      window.paypal.HostedButtons({
        hostedButtonId: buttonId,
      }).render(`#${containerId}`);
    };

    if (script) {
      // SDK already loaded
      if (window.paypal) {
        renderButton();
      } else {
        script.addEventListener("load", renderButton);
      }
    } else {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=EUR`;
      script.async = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    }

    return () => {
      renderedRef.current = false;
    };
  }, [buttonId, containerId]);

  return (
    <div
      className="min-h-screen pt-24 pb-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center font-serif">
          Paiement de la Réservation
        </h1>

        {/* Résumé */}
        <Card className="bg-black/40 backdrop-blur-sm border-amber-400/30 p-8 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-6 text-amber-300">Résumé de votre réservation</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-white/70">Nom :</span>
              <span className="font-semibold">{reservation.firstName} {reservation.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Email :</span>
              <span className="font-semibold">{reservation.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Type de consultation :</span>
              <span className="font-semibold">{label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Date :</span>
              <span className="font-semibold">{reservation.selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Horaire :</span>
              <span className="font-semibold">{reservation.selectedTime}</span>
            </div>
          </div>
          <div className="border-t border-amber-400/30 pt-4 flex justify-between items-center">
            <span className="text-lg text-white/70">Montant à payer :</span>
            <span className="text-3xl font-bold text-amber-400">{price} €</span>
          </div>
        </Card>

        {/* Bouton PayPal */}
        <Card className="bg-black/40 backdrop-blur-sm border-amber-400/30 p-8 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Paiement sécurisé</h3>
          <p className="text-white/70 text-sm mb-6">
            ✓ Paiement sécurisé par PayPal &nbsp;·&nbsp; ✓ Confirmation automatique après paiement
          </p>
          <div
            id={containerId}
            ref={paypalContainerRef}
            className="min-h-[50px]"
          />
        </Card>

        {/* Retour */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/booking/schedule")}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour à la sélection des créneaux
          </Button>
        </div>
      </div>
    </div>
  );
}
