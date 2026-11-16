// Copiar este archivo como environment.ts y environment.prod.ts (production: true)
// y completar con la configuración web del proyecto en Firebase:
// Consola de Firebase > Configuración del proyecto > Tus apps > App web.
// Los archivos reales no se suben al repositorio (están en .gitignore).

export const environment = {
  production: false,
  // true para trabajar con los emuladores locales de Firebase
  useEmulators: false,
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};
