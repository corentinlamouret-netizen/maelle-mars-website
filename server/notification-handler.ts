import { notifyOwner } from "./_core/notification";

export interface ReservationNotification {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consultationType: string;
  selectedDate: string;
  selectedTime: string;
}

export interface ClientNotification {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Notify owner about new reservation
 */
export async function notifyOwnerOfNewReservation(
  reservation: ReservationNotification
): Promise<boolean> {
  try {
    const title = `Nouvelle Réservation - ${reservation.firstName} ${reservation.lastName}`;
    const content = `
Nouveau client:
- Nom: ${reservation.firstName} ${reservation.lastName}
- Email: ${reservation.email}
- Téléphone: ${reservation.phone}

Détails de la consultation:
- Type: ${reservation.consultationType}
- Date: ${reservation.selectedDate}
- Heure: ${reservation.selectedTime}

Accédez à votre dashboard admin pour plus de détails.
    `.trim();

    return await notifyOwner({ title, content });
  } catch (error) {
    console.error("[Notification] Error notifying owner of new reservation:", error);
    return false;
  }
}

/**
 * Notify owner about new client registration
 */
export async function notifyOwnerOfNewClient(client: ClientNotification): Promise<boolean> {
  try {
    const title = `Nouveau Client - ${client.firstName} ${client.lastName}`;
    const content = `
Un nouveau client s'est inscrit:
- Nom: ${client.firstName} ${client.lastName}
- Email: ${client.email}
- Téléphone: ${client.phone}

Consultez votre fichier clients pour plus d'informations.
    `.trim();

    return await notifyOwner({ title, content });
  } catch (error) {
    console.error("[Notification] Error notifying owner of new client:", error);
    return false;
  }
}

/**
 * Notify owner about client update
 */
export async function notifyOwnerOfClientUpdate(
  client: ClientNotification,
  changes: string[]
): Promise<boolean> {
  try {
    const title = `Mise à jour Client - ${client.firstName} ${client.lastName}`;
    const content = `
Le profil d'un client a été mis à jour:
- Nom: ${client.firstName} ${client.lastName}
- Email: ${client.email}

Modifications:
${changes.map((change) => `- ${change}`).join("\n")}
    `.trim();

    return await notifyOwner({ title, content });
  } catch (error) {
    console.error("[Notification] Error notifying owner of client update:", error);
    return false;
  }
}
