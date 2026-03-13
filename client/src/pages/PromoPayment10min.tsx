import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PromoPayment10min() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAAkEwqcwMjcJooftki1j1_4uzTUYKI09g7AEmy3D78PawKmx0MF2ade8HZrYPeCix7lOfoi5s27OKFpRo&components=hosted-buttons&disable-funding=venmo&currency=EUR';
    script.async = true;
    script.onload = () => {
      if (window.paypal?.HostedButtons) {
        window.paypal.HostedButtons({
          hostedButtonId: '66Y83EBJ3X5RQ',
        }).render('#paypal-container-66Y83EBJ3X5RQ');
      }
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl font-bold">Offre Promotionnelle</h1>
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-xl text-muted-foreground">Consultation de 10 minutes - Tarif spécial</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Benefits */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card border-accent/20">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Ce qui vous attend</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Consultation Personnalisée</h3>
                    <p className="text-muted-foreground">Une séance de 10 minutes adaptée à vos besoins spécifiques</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Guidance Authentique</h3>
                    <p className="text-muted-foreground">Connexion lumière, vérité et guidance pour clarifier votre chemin</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Format Rapide & Efficace</h3>
                    <p className="text-muted-foreground">Parfait pour une première consultation ou une question précise</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Offre Limitée</h3>
                    <p className="text-muted-foreground">Profitez de ce tarif promotionnel pendant qu'il est disponible</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Details */}
            <Card className="p-8 bg-card border-accent/20">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Détails de la Consultation</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-accent/20">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="font-semibold">10 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pb-4 border-b border-accent/20">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="font-semibold">Appel téléphonique</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔮</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">Consultation Medium & Clairvoyante</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Payment */}
          <div>
            <Card className="p-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 sticky top-24">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground mb-2">Prix spécial</p>
                <div className="text-4xl font-bold text-accent mb-2">15€</div>
                <p className="text-sm text-muted-foreground line-through">Tarif normal: 25€</p>
              </div>

              {/* PayPal Button */}
              <div id="paypal-container-66Y83EBJ3X5RQ" className="mb-6"></div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm">
                <p className="text-amber-700 dark:text-amber-400">
                  ✨ Offre limitée - Profitez de cette consultation à prix réduit dès maintenant!
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-accent/20">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation('/consultations')}
                >
                  Voir les autres consultations
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card className="p-8 bg-card border-accent/20">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Questions Fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Comment se déroule la consultation?</h3>
              <p className="text-muted-foreground">
                Après votre paiement, vous recevrez un email avec les instructions pour planifier votre appel. Maelle vous contactera à l'heure convenue pour votre consultation de 10 minutes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Puis-je prolonger ma consultation?</h3>
              <p className="text-muted-foreground">
                Oui! Si vous souhaitez une consultation plus longue, vous pouvez ajouter du temps directement pendant l'appel.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Quels sont les moyens de paiement acceptés?</h3>
              <p className="text-muted-foreground">
                Nous acceptons PayPal, les cartes bancaires (Visa, Mastercard, American Express) et les virements bancaires.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
