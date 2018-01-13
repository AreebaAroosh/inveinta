import { NgModule } from '@angular/core';

import { firebase } from '../app/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { FirebaseProvider } from './firebase/firebase';

@NgModule({
  providers: [
    FirebaseProvider,
  ],
  imports: [
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
})
export class ProvidersModule {}
