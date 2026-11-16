// Genera src/environments/environment.ts y environment.prod.ts a partir de
// variables de entorno. Lo usa el pipeline (las claves vienen de los secretos
// de GitHub) y también sirve en local si existe un archivo .env.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const keys = {
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
};

const firebase = {};
const missing = [];
for (const [field, envName] of Object.entries(keys)) {
  firebase[field] = process.env[envName] ?? '';
  if (!firebase[field]) missing.push(envName);
}

if (missing.length) {
  console.warn(`Faltan variables: ${missing.join(', ')}`);
}

const content = (production) =>
  `export const environment = ${JSON.stringify({ production, firebase }, null, 2)};\n`;

mkdirSync('src/environments', { recursive: true });
writeFileSync('src/environments/environment.ts', content(false));
writeFileSync('src/environments/environment.prod.ts', content(true));
console.log('Archivos de environment generados.');
