import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";

interface EventReservationFormProps {
  eventId: number;
  eventTitle: string;
  maxPlaces?: number;
  onSuccess?: () => void;
}

export function EventReservationForm({
  eventId,
  eventTitle,
  maxPlaces = 10,
  onSuccess,
}: EventReservationFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    numberOfPlaces: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Email invalide";
    }

    const cleanPhone = formData.phone.replace(/[\s.-]/g, "");
    if (!cleanPhone.match(/^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/)) {
      newErrors.phone = "Téléphone invalide";
    }

    if (formData.numberOfPlaces < 1 || formData.numberOfPlaces > maxPlaces) {
      newErrors.numberOfPlaces = `Nombre de places invalide (1-${maxPlaces})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Veuillez corriger les erreurs du formulaire");
      return;
    }

    setIsSubmitting(true);

    try {
      // Appel API pour ajouter le participant
      // await trpc.events.addAttendee.mutate({
      //   eventId,
      //   ...formData,
      // });

      alert("Votre réservation a été enregistrée avec succès");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        numberOfPlaces: 1,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert("Une erreur est survenue lors de votre réservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-purple-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Réserver une place</h3>
      <p className="text-gray-600 mb-6">Événement: <strong>{eventTitle}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prénom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Jean"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Dupont"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="jean@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="06 12 34 56 78"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Nombre de places */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de places *
          </label>
          <select
            value={formData.numberOfPlaces}
            onChange={(e) =>
              setFormData({ ...formData, numberOfPlaces: parseInt(e.target.value) })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.numberOfPlaces ? "border-red-500" : "border-gray-300"
            }`}
          >
            {Array.from({ length: maxPlaces }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} place{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          {errors.numberOfPlaces && (
            <p className="text-red-600 text-sm mt-1">{errors.numberOfPlaces}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          {isSubmitting ? "Traitement..." : "Confirmer la réservation"}
        </Button>
      </form>
    </Card>
  );
}
