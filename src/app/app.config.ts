import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: "boxbox-80475", 
      appId: "1:624517284379:web:7be43fe24ecfdbf6bfaebe", 
      storageBucket: "boxbox-80475.firebasestorage.app", 
      apiKey: "AIzaSyClgaLnJGgwvfxaOpqbcIZhMryEBhGkRkM", 
      authDomain: "boxbox-80475.firebaseapp.com", 
      messagingSenderId: "624517284379" })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())]
};
