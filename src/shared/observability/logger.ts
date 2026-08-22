import { redactSensitiveData } from './redact';

type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): void {
    const timestamp = new Date().toISOString();
    const safeContext = context ? redactSensitiveData(context) : undefined;
    const safeError = error instanceof Error ? { name: error.name, message: error.message } : error ? redactSensitiveData(error) : undefined;

    const payload = {
      timestamp,
      level,
      message,
      ...(safeContext && { context: safeContext }),
      ...(safeError && { error: safeError }),
    };

    if (process.env.NODE_ENV !== 'test') {
      switch (level) {
        case 'info':
          console.info(JSON.stringify(payload));
          break;
        case 'warn':
          console.warn(JSON.stringify(payload));
          break;
        case 'error':
          console.error(JSON.stringify(payload));
          break;
      }
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
