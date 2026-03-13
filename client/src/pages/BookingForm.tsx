import { useState } from 'react';
import { useLocation } from 'wouter';
import { useReservation } from '@/contexts/ReservationContext';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

interface AddressSuggestion {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
  lat: string;
  lon: string;
}

export default function BookingForm() {
  const [location, navigate] = useLocation();
  const { reservation, updateReservation } = useReservation();
  
  const createClientMutation = trpc.clients.create.useMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const selectedConsultationType = (reservation.consultationType || '30min') as '10min' | '25min' | '30min' | '40min' | '1hour';

  const [formData, setFormData] = useState({
    firstName: reservation.firstName || '',
    lastName: reservation.lastName || '',
    email: reservation.email || '',
    phone: reservation.phone || '',
    street: '',
    postalCode: '',
    city: '',
    wantUpdates: reservation.wantUpdates || false,
    acceptPrivacy: reservation.acceptPrivacy || false,
  });

  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    // Clear suggestions when user changes street field
    if (name === 'street') {
      setShowSuggestions(false);
    }
  };

  // Valider l'adresse avec Nominatim API
  const validateAddress = async () => {
    if (!formData.street.trim() || !formData.postalCode.trim() || !formData.city.trim()) {
      setErrors(prev => ({
        ...prev,
        street: !formData.street.trim() ? 'La rue est requise' : '',
        postalCode: !formData.postalCode.trim() ? 'Le code postal est requis' : '',
        city: !formData.city.trim() ? 'La ville est requise' : '',
      }));
      return false;
    }

    setIsValidatingAddress(true);
    try {
      const query = `street=${encodeURIComponent(formData.street)}&city=${encodeURIComponent(formData.city)}&postalcode=${encodeURIComponent(formData.postalCode)}&country=France&format=json&addressdetails=1&limit=5`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`);
      const data = await response.json();

      // Afficher les suggestions si trouvées, mais continuer même si aucune n'est trouvée
      if (data.length > 0) {
        setAddressSuggestions(data);
        setShowSuggestions(true);
      }

      setIsValidatingAddress(false);
      return true; // Accepter l'adresse même si Nominatim ne la trouve pas
    } catch (error) {
      // En cas d'erreur, accepter l'adresse (validation permissive)
      console.error('Erreur lors de la validation Nominatim:', error);
      setIsValidatingAddress(false);
      return true;
    }
  };

  const selectAddress = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({
      ...prev,
      street: suggestion.address.road ? `${suggestion.address.house_number || ''} ${suggestion.address.road}`.trim() : prev.street,
      postalCode: suggestion.address.postcode || prev.postalCode,
      city: suggestion.address.city || suggestion.address.town || suggestion.address.village || prev.city,
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
    setErrors(prev => ({ ...prev, street: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation du prénom
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (formData.firstName.trim().length < 2) newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';

    // Validation du nom
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (formData.lastName.trim().length < 2) newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';

    // Validation de l'email (permissive pour accepter les formats internationaux)
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    // Validation basique d'email (accepte les formats internationaux)
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide';

    // Validation du téléphone (accepte les formats internationaux)
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    // Validation basique: au moins 7 chiffres (accepte les formats internationaux)
    const cleanPhone = formData.phone.replace(/[\s.+-]/g, '');
    if (!/^\d{7,}$/.test(cleanPhone)) newErrors.phone = 'Téléphone invalide (au moins 7 chiffres)';

    // Validation de l'adresse (permissive pour accepter les formats internationaux)
    if (!formData.street.trim()) newErrors.street = 'La rue est requise';
    if (formData.street.trim().length < 3) newErrors.street = 'L\'adresse doit contenir au moins 3 caractères';

    // Validation du code postal (accepte les formats internationaux)
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    if (formData.postalCode.trim().length < 2) newErrors.postalCode = 'Le code postal doit contenir au moins 2 caractères';

    // Validation de la ville (accepte les formats internationaux)
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (formData.city.trim().length < 2) newErrors.city = 'La ville doit contenir au moins 2 caractères';

    // Validation de la politique de confidentialité
    if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'Vous devez accepter la politique de confidentialité';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Valider l'adresse avec Nominatim
    const isAddressValid = await validateAddress();
    if (!isAddressValid) return;

    // Construire l'adresse complète
    const fullAddress = `${formData.street}, ${formData.postalCode} ${formData.city}`;
    
    try {
      // Créer ou mettre à jour le client dans la base de données
      await createClientMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        consultationCount: 0,
        wantUpdates: formData.wantUpdates ? 1 : 0,
        wantConferences: 0,
      });
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      // Continue même si la création échoue
    }
    
    // Mettre à jour la réservation
    updateReservation({
      consultationType: selectedConsultationType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: fullAddress,
      wantUpdates: formData.wantUpdates,
      acceptPrivacy: formData.acceptPrivacy,
    });
    
    // Naviguer vers la page suivante
    navigate('/booking/schedule');
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('${heroBackgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titre */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-script text-5xl md:text-6xl text-accent mb-4">
            Vos informations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veuillez remplir le formulaire ci-dessous pour continuer votre réservation
          </p>
        </div>

        {/* Formulaire */}
        <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm rounded-lg p-8 border border-accent/20 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                  errors.firstName ? 'border-red-500' : 'border-accent/20'
                } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                  errors.lastName ? 'border-red-500' : 'border-accent/20'
                } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre.email@exemple.com"
                className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                  errors.email ? 'border-red-500' : 'border-accent/20'
                } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                  errors.phone ? 'border-red-500' : 'border-accent/20'
                } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Rue */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                Rue (numéro et nom) *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="ex: 35 Avenue Robert Emm"
                className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                  errors.street ? 'border-red-500' : 'border-accent/20'
                } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>

            {/* Code Postal et Ville */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="ex: 66100"
                  maxLength={5}
                  className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                    errors.postalCode ? 'border-red-500' : 'border-accent/20'
                  } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="ex: Perpignan"
                  className={`w-full px-4 py-3 rounded-lg bg-background/50 border ${
                    errors.city ? 'border-red-500' : 'border-accent/20'
                  } text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Suggestions d'adresse */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-3">Adresses trouvées :</p>
                <div className="space-y-2">
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectAddress(suggestion)}
                      className="w-full text-left px-3 py-2 rounded bg-background/50 hover:bg-accent/20 transition-colors text-sm text-foreground"
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="wantUpdates"
                  checked={formData.wantUpdates}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-accent/30 text-accent"
                />
                <span className="text-sm text-foreground">
                  Je souhaite recevoir des mises à jour par email
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-accent/30 text-accent"
                />
                <span className="text-sm text-foreground">
                  J'accepte la politique de confidentialité *
                </span>
              </label>
              {errors.acceptPrivacy && <p className="text-red-500 text-sm">{errors.acceptPrivacy}</p>}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isValidatingAddress}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-background font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isValidatingAddress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validation de l'adresse...
                </>
              ) : (
                'Continuer vers la sélection de créneau'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
