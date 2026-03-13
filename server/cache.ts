/**
 * Système de caching simple en mémoire
 * Réduit les requêtes BD répétées
 */

import { CACHE_TTL } from "@shared/app-constants";

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL en millisecondes
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Récupère une valeur du cache si elle existe et n'est pas expirée
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Vérifier si le cache a expiré
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000, // Convertir en millisecondes
    });
  }

  /**
   * Invalide une clé de cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalide toutes les clés commençant par un préfixe
   */
  invalidatePrefix(prefix: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(prefix));
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Récupère ou génère une valeur (pattern get-or-set)
   */
  async getOrSet<T>(
    key: string,
    generator: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> {
    // Essayer de récupérer du cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Générer la valeur
    const data = await generator();

    // Stocker dans le cache
    this.set(key, data, ttlMinutes);

    return data;
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 100), // Limiter à 100 clés pour les stats
    };
  }
}

export const cache = new CacheManager();

/**
 * Clés de cache prédéfinies
 */
export const CACHE_KEYS = {
  UPCOMING_EVENTS: 'upcoming-events',
  PUBLISHED_TESTIMONIALS: 'published-testimonials',
  CONSULTATION_TYPES: 'consultation-types',
  ADMIN_STATS: 'admin-stats',
  EVENT_ATTENDEES: (eventId: number) => `event-attendees-${eventId}`,
  RESERVATION_DETAILS: (reservationId: number) => `reservation-${reservationId}`,
} as const;

/**
 * Middleware pour cacher les réponses GET
 */
export function cacheMiddleware(durationMinutes: number = 5) {
  return (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `http-cache:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    // Intercepter la méthode json() pour cacher la réponse
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      cache.set(key, data, durationMinutes);
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}
