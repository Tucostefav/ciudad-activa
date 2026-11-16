// Traduce los códigos de error de Firebase a mensajes claros para el usuario
const MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Ese correo ya está registrado.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a intentar.',
  'auth/network-request-failed': 'No hay conexión a internet.',
  'app/profile-not-found': 'Tu cuenta no tiene un perfil asignado. Contacta al administrador.',
};

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';
  return MESSAGES[code] ?? 'Ocurrió un error inesperado. Intenta de nuevo.';
}
