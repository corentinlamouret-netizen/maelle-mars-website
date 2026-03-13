/**
 * Système de logging structuré
 * Centralise tous les logs pour meilleure observabilité
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    };
  }

  private outputLog(entry: LogEntry): void {
    const logString = JSON.stringify(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(logString);
        }
        break;
      case LogLevel.INFO:
        console.log(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.ERROR:
        console.error(logString);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.formatLogEntry(LogLevel.DEBUG, message, context);
    this.outputLog(entry);
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.formatLogEntry(LogLevel.INFO, message, context);
    this.outputLog(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.formatLogEntry(LogLevel.WARN, message, context);
    this.outputLog(entry);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.formatLogEntry(LogLevel.ERROR, message, context, error);
    this.outputLog(entry);
  }
}

export const logger = new Logger();

/**
 * Décorateur pour logger les appels de fonction
 */
export function logFunction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startTime = Date.now();
    logger.debug(`[${propertyKey}] Début de l'exécution`, { args });

    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      logger.info(`[${propertyKey}] Exécution réussie`, {
        duration: `${duration}ms`,
        resultType: typeof result,
      });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`[${propertyKey}] Erreur lors de l'exécution`, error as Error, {
        duration: `${duration}ms`,
      });
      throw error;
    }
  };

  return descriptor;
}

/**
 * Middleware Express pour logger les requêtes
 */
export function requestLogger(req: any, res: any, next: any) {
  const startTime = Date.now();
  const { method, path, query, body } = req;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    logger.info(`${method} ${path}`, {
      statusCode,
      duration: `${duration}ms`,
      query: Object.keys(query).length > 0 ? query : undefined,
      bodySize: body ? JSON.stringify(body).length : 0,
    });
  });

  next();
}

/**
 * Middleware Express pour logger les erreurs
 */
export function errorLogger(err: any, req: any, res: any, next: any) {
  logger.error(`Erreur non gérée : ${err.message}`, err, {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
  });

  next(err);
}
