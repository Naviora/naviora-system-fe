/**
 * Centralized logging utility
 * Replaces scattered console.log/console.error calls throughout the app
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  component?: string;
  function?: string;
  userId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isClient = typeof window !== "undefined";

  /**
   * Format log message with context
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = this.getPrefix(level);

    let formattedMessage = `${prefix} [${timestamp}] ${message}`;

    if (context?.component) {
      formattedMessage += ` | Component: ${context.component}`;
    }

    if (context?.function) {
      formattedMessage += ` | Function: ${context.function}`;
    }

    return formattedMessage;
  }

  /**
   * Get emoji prefix for log level
   */
  private getPrefix(level: LogLevel): string {
    const prefixes = {
      debug: "🔍",
      info: "ℹ️",
      warn: "⚠️",
      error: "🚨",
    };
    return prefixes[level];
  }

  /**
   * Debug logging (development only)
   */
  debug(message: string, data?: unknown, context?: LogContext): void {
    if (!this.isDevelopment) return;

    const formattedMessage = this.formatMessage("debug", message, context);
    console.debug(formattedMessage, data);
  }

  /**
   * Info logging
   */
  info(message: string, data?: unknown, context?: LogContext): void {
    if (!this.isDevelopment) return;

    const formattedMessage = this.formatMessage("info", message, context);
    console.info(formattedMessage, data);
  }

  /**
   * Warning logging
   */
  warn(message: string, data?: unknown, context?: LogContext): void {
    const formattedMessage = this.formatMessage("warn", message, context);
    console.warn(formattedMessage, data);
  }

  /**
   * Error logging
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const formattedMessage = this.formatMessage("error", message, context);
    console.error(formattedMessage, error);

    // In production, you might want to send errors to a logging service
    if (!this.isDevelopment && this.isClient) {
      this.sendToLoggingService(message, error, context);
    }
  }

  /**
   * API request logging
   */
  apiRequest(
    method: string,
    url: string,
    data?: unknown,
    context?: LogContext
  ): void {
    if (!this.isDevelopment) return;

    const message = `API Request: ${method.toUpperCase()} ${url}`;
    this.info(message, data, { ...context, function: "API Request" });
  }

  /**
   * API response logging
   */
  apiResponse(
    method: string,
    url: string,
    status: number,
    data?: unknown,
    context?: LogContext
  ): void {
    if (!this.isDevelopment) return;

    const message = `API Response: ${method.toUpperCase()} ${url} | Status: ${status}`;

    if (status >= 400) {
      this.error(message, data, { ...context, function: "API Response" });
    } else {
      this.info(message, data, { ...context, function: "API Response" });
    }
  }

  /**
   * User action logging
   */
  userAction(action: string, data?: unknown, context?: LogContext): void {
    if (!this.isDevelopment) return;

    const message = `User Action: ${action}`;
    this.info(message, data, { ...context, function: "User Action" });
  }

  /**
   * Performance logging
   */
  performance(label: string, startTime: number, context?: LogContext): void {
    if (!this.isDevelopment) return;

    const duration = performance.now() - startTime;
    const message = `Performance: ${label} took ${duration.toFixed(2)}ms`;
    this.info(message, { duration }, { ...context, function: "Performance" });
  }

  /**
   * Form submission logging
   */
  formSubmission(
    formName: string,
    success: boolean,
    data?: unknown,
    context?: LogContext
  ): void {
    const message = `Form Submission: ${formName} ${
      success ? "succeeded" : "failed"
    }`;

    if (success) {
      this.info(message, data, { ...context, function: "Form Submission" });
    } else {
      this.error(message, data, { ...context, function: "Form Submission" });
    }
  }

  /**
   * Authentication logging
   */
  auth(
    action: string,
    success: boolean,
    data?: unknown,
    context?: LogContext
  ): void {
    const message = `Auth: ${action} ${success ? "succeeded" : "failed"}`;

    if (success) {
      this.info(message, data, { ...context, function: "Authentication" });
    } else {
      this.warn(message, data, { ...context, function: "Authentication" });
    }
  }

  /**
   * Send errors to logging service (production)
   */
  private sendToLoggingService(
    message: string,
    error: unknown,
    context?: LogContext
  ): void {
    // Implement your logging service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.

    // For now, we'll just store in localStorage as a fallback
    try {
      const errorLog = {
        message,
        error: error instanceof Error ? error.message : String(error),
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      const existingLogs = JSON.parse(
        localStorage.getItem("error_logs") || "[]"
      );
      existingLogs.push(errorLog);

      // Keep only last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }

      localStorage.setItem("error_logs", JSON.stringify(existingLogs));
    } catch (localStorageError) {
      console.error("Failed to store error log:", localStorageError);
    }
  }

  /**
   * Get error logs (for debugging)
   */
  getErrorLogs(): unknown[] {
    try {
      return JSON.parse(localStorage.getItem("error_logs") || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Clear error logs
   */
  clearErrorLogs(): void {
    try {
      localStorage.removeItem("error_logs");
    } catch {
      // Ignore
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };

// Convenience methods for common use cases
export const log = {
  debug: (message: string, data?: unknown, context?: LogContext) =>
    logger.debug(message, data, context),
  info: (message: string, data?: unknown, context?: LogContext) =>
    logger.info(message, data, context),
  warn: (message: string, data?: unknown, context?: LogContext) =>
    logger.warn(message, data, context),
  error: (message: string, error?: unknown, context?: LogContext) =>
    logger.error(message, error, context),

  // Specialized logging
  api: {
    request: (method: string, url: string, data?: unknown) =>
      logger.apiRequest(method, url, data),
    response: (method: string, url: string, status: number, data?: unknown) =>
      logger.apiResponse(method, url, status, data),
  },

  user: (action: string, data?: unknown, context?: LogContext) =>
    logger.userAction(action, data, context),

  performance: (label: string, startTime: number, context?: LogContext) =>
    logger.performance(label, startTime, context),

  form: (
    formName: string,
    success: boolean,
    data?: unknown,
    context?: LogContext
  ) => logger.formSubmission(formName, success, data, context),

  auth: (
    action: string,
    success: boolean,
    data?: unknown,
    context?: LogContext
  ) => logger.auth(action, success, data, context),
};
