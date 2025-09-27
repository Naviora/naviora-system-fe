import { ERROR_CODES, SUCCESS_CODES } from "./codes";

// Error Messages Map
export const ERROR_MESSAGES = {
  // Authentication Errors
  [ERROR_CODES.INVALID_CREDENTIALS]:
    "Invalid email or password. Please check your credentials and try again.",
  [ERROR_CODES.TOKEN_EXPIRED]: "Your session has expired. Please log in again.",
  [ERROR_CODES.TOKEN_INVALID]:
    "Invalid authentication token. Please log in again.",
  [ERROR_CODES.UNAUTHORIZED_ACCESS]:
    "You are not authorized to access this resource.",
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]:
    "You do not have sufficient permissions to perform this action.",
  [ERROR_CODES.EMAIL_NOT_VERIFIED]:
    "Please verify your email address before continuing.",
  [ERROR_CODES.ACCOUNT_LOCKED]:
    "Your account has been locked. Please contact support.",

  // Validation Errors
  [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: "Please fill in all required fields.",
  [ERROR_CODES.INVALID_EMAIL_FORMAT]: "Please enter a valid email address.",
  [ERROR_CODES.INVALID_PASSWORD_FORMAT]:
    "Password must meet the required format.",
  [ERROR_CODES.PASSWORD_TOO_WEAK]:
    "Password is too weak. Please choose a stronger password.",
  [ERROR_CODES.PASSWORDS_DO_NOT_MATCH]:
    "Passwords do not match. Please try again.",
  [ERROR_CODES.INVALID_INPUT_FORMAT]:
    "Invalid input format. Please check your data.",
  [ERROR_CODES.VALUE_OUT_OF_RANGE]: "Value is out of acceptable range.",

  // User Management Errors
  [ERROR_CODES.USER_NOT_FOUND]:
    "User not found. Please check the user information.",
  [ERROR_CODES.USER_ALREADY_EXISTS]:
    "A user with this information already exists.",
  [ERROR_CODES.EMAIL_ALREADY_IN_USE]:
    "This email address is already in use. Please use a different email.",
  [ERROR_CODES.USERNAME_ALREADY_TAKEN]:
    "This username is already taken. Please choose a different username.",
  [ERROR_CODES.USER_CREATION_FAILED]:
    "Failed to create user. Please try again.",
  [ERROR_CODES.USER_UPDATE_FAILED]:
    "Failed to update user information. Please try again.",
  [ERROR_CODES.USER_DELETION_FAILED]:
    "Failed to delete user. Please try again.",

  // Resource Errors
  [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested resource was not found.",
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]:
    "A resource with this information already exists.",
  [ERROR_CODES.RESOURCE_CREATION_FAILED]:
    "Failed to create resource. Please try again.",
  [ERROR_CODES.RESOURCE_UPDATE_FAILED]:
    "Failed to update resource. Please try again.",
  [ERROR_CODES.RESOURCE_DELETION_FAILED]:
    "Failed to delete resource. Please try again.",
  [ERROR_CODES.RESOURCE_ACCESS_DENIED]:
    "You do not have permission to access this resource.",

  // Database Errors
  [ERROR_CODES.DATABASE_CONNECTION_ERROR]:
    "Unable to connect to database. Please try again later.",
  [ERROR_CODES.DATABASE_QUERY_ERROR]:
    "Database query failed. Please try again.",
  [ERROR_CODES.DATABASE_CONSTRAINT_VIOLATION]:
    "Operation violates database constraints.",
  [ERROR_CODES.DATABASE_TIMEOUT]:
    "Database operation timed out. Please try again.",

  // File Upload Errors
  [ERROR_CODES.FILE_TOO_LARGE]:
    "File is too large. Please choose a smaller file.",
  [ERROR_CODES.INVALID_FILE_TYPE]:
    "Invalid file type. Please choose a different file.",
  [ERROR_CODES.FILE_UPLOAD_FAILED]: "File upload failed. Please try again.",
  [ERROR_CODES.FILE_NOT_FOUND]: "File not found. Please check the file path.",
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]:
    "Storage quota exceeded. Please free up some space.",

  // Network & External Service Errors
  [ERROR_CODES.NETWORK_ERROR]:
    "Network error occurred. Please check your connection.",
  [ERROR_CODES.SERVICE_UNAVAILABLE]:
    "Service is currently unavailable. Please try again later.",
  [ERROR_CODES.EXTERNAL_API_ERROR]:
    "External service error. Please try again later.",
  [ERROR_CODES.TIMEOUT_ERROR]: "Request timed out. Please try again.",
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]:
    "Rate limit exceeded. Please wait before trying again.",

  // System Errors
  [ERROR_CODES.INTERNAL_ERROR]:
    "An internal error occurred. Please try again later.",
  [ERROR_CODES.CONFIGURATION_ERROR]:
    "System configuration error. Please contact support.",
  [ERROR_CODES.MAINTENANCE_MODE]:
    "System is currently under maintenance. Please try again later.",
  [ERROR_CODES.FEATURE_DISABLED]: "This feature is currently disabled.",

  // Business Logic Errors
  [ERROR_CODES.BUSINESS_RULE_VIOLATION]: "Operation violates business rules.",
  [ERROR_CODES.OPERATION_NOT_ALLOWED]: "This operation is not allowed.",
  [ERROR_CODES.INVALID_STATE]: "Invalid state for this operation.",
  [ERROR_CODES.DEPENDENCY_ERROR]: "Dependency error occurred.",
} as const;

// Success Messages Map
export const SUCCESS_MESSAGES = {
  // Authentication Success
  [SUCCESS_CODES.LOGIN_SUCCESS]: "Successfully logged in. Welcome back!",
  [SUCCESS_CODES.LOGOUT_SUCCESS]: "Successfully logged out. See you next time!",
  [SUCCESS_CODES.REGISTRATION_SUCCESS]:
    "Account created successfully. Welcome!",
  [SUCCESS_CODES.PASSWORD_RESET_SUCCESS]: "Password reset successfully.",
  [SUCCESS_CODES.EMAIL_VERIFIED]: "Email verified successfully.",

  // User Management Success
  [SUCCESS_CODES.USER_CREATED]: "User created successfully.",
  [SUCCESS_CODES.USER_UPDATED]: "User information updated successfully.",
  [SUCCESS_CODES.USER_DELETED]: "User deleted successfully.",
  [SUCCESS_CODES.PROFILE_UPDATED]: "Profile updated successfully.",

  // Resource Success
  [SUCCESS_CODES.RESOURCE_CREATED]: "Resource created successfully.",
  [SUCCESS_CODES.RESOURCE_UPDATED]: "Resource updated successfully.",
  [SUCCESS_CODES.RESOURCE_DELETED]: "Resource deleted successfully.",
  [SUCCESS_CODES.RESOURCE_RETRIEVED]: "Resource retrieved successfully.",

  // Operation Success
  [SUCCESS_CODES.OPERATION_COMPLETED]: "Operation completed successfully.",
  [SUCCESS_CODES.DATA_SAVED]: "Data saved successfully.",
  [SUCCESS_CODES.EMAIL_SENT]: "Email sent successfully.",
  [SUCCESS_CODES.FILE_UPLOADED]: "File uploaded successfully.",
  [SUCCESS_CODES.BACKUP_CREATED]: "Backup created successfully.",
} as const;

// Utility functions to get messages
export const getErrorMessage = (
  errorCode: keyof typeof ERROR_CODES
): string => {
  return ERROR_MESSAGES[ERROR_CODES[errorCode]] || "An unknown error occurred.";
};

export const getSuccessMessage = (
  successCode: keyof typeof SUCCESS_CODES
): string => {
  return (
    SUCCESS_MESSAGES[SUCCESS_CODES[successCode]] ||
    "Operation completed successfully."
  );
};

// Default messages
export const DEFAULT_MESSAGES = {
  LOADING: "Loading...",
  NO_DATA: "No data available.",
  CONFIRM_DELETE: "Are you sure you want to delete this item?",
  UNSAVED_CHANGES: "You have unsaved changes. Are you sure you want to leave?",
  OPERATION_CANCELLED: "Operation cancelled.",
  TRY_AGAIN: "Please try again.",
  CONTACT_SUPPORT: "If the problem persists, please contact support.",
} as const;
