export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export const ErrorCodes = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  SERVER_ERROR: "SERVER_ERROR",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  DUPLICATE: "DUPLICATE",

  // Unknown errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.INVALID_CREDENTIALS]: "Email ou mot de passe incorrect",
  [ErrorCodes.SESSION_EXPIRED]: "Votre session a expiré. Veuillez vous reconnecter.",
  [ErrorCodes.UNAUTHORIZED]: "Vous n'êtes pas autorisé à accéder à cette ressource",
  [ErrorCodes.FORBIDDEN]: "Vous n'avez pas les permissions nécessaires",
  [ErrorCodes.NETWORK_ERROR]: "Erreur de connexion. Veuillez vérifier votre connexion Internet",
  [ErrorCodes.TIMEOUT]: "La requête a expiré. Veuillez réessayer",
  [ErrorCodes.SERVER_ERROR]: "Erreur serveur. Veuillez réessayer plus tard",
  [ErrorCodes.VALIDATION_ERROR]: "Les données fournies sont invalides",
  [ErrorCodes.INVALID_INPUT]: "Entrée invalide",
  [ErrorCodes.NOT_FOUND]: "La ressource demandée n'a pas été trouvée",
  [ErrorCodes.CONFLICT]: "Un conflit s'est produit. Veuillez réessayer",
  [ErrorCodes.DUPLICATE]: "Cette ressource existe déjà",
  [ErrorCodes.UNKNOWN_ERROR]: "Une erreur inconnue s'est produite",
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return ErrorMessages[error.code] || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return ErrorMessages[ErrorCodes.UNKNOWN_ERROR]
}

export function handleAPIError(error: any): AppError {
  if (error instanceof AppError) {
    return error
  }

  // Handle fetch errors
  if (error instanceof TypeError) {
    if (error.message.includes("fetch")) {
      return new AppError(ErrorCodes.NETWORK_ERROR, 0, ErrorMessages[ErrorCodes.NETWORK_ERROR], error)
    }
  }

  // Handle HTTP errors
  if (error.statusCode) {
    switch (error.statusCode) {
      case 401:
        return new AppError(ErrorCodes.INVALID_CREDENTIALS, 401, ErrorMessages[ErrorCodes.INVALID_CREDENTIALS], error)
      case 403:
        return new AppError(ErrorCodes.FORBIDDEN, 403, ErrorMessages[ErrorCodes.FORBIDDEN], error)
      case 404:
        return new AppError(ErrorCodes.NOT_FOUND, 404, ErrorMessages[ErrorCodes.NOT_FOUND], error)
      case 409:
        return new AppError(ErrorCodes.CONFLICT, 409, ErrorMessages[ErrorCodes.CONFLICT], error)
      case 500:
      case 502:
      case 503:
        return new AppError(ErrorCodes.SERVER_ERROR, error.statusCode, ErrorMessages[ErrorCodes.SERVER_ERROR], error)
      default:
        return new AppError(
          ErrorCodes.UNKNOWN_ERROR,
          error.statusCode,
          error.message || ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
          error,
        )
    }
  }

  return new AppError(ErrorCodes.UNKNOWN_ERROR, 0, ErrorMessages[ErrorCodes.UNKNOWN_ERROR], error)
}

export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const message = getErrorMessage(error)

  console.error(`[${timestamp}] ${context || "Error"}:`, {
    message,
    error,
    stack: error instanceof Error ? error.stack : undefined,
  })

  // In production, send to error tracking service (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry.captureException(error)
    // Example: LogRocket.captureException(error)
  }
}
