import { Injectable, OnInit, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  user,
} from '@angular/fire/auth';

import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { UserProfile } from '../models/userprofile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService  {
  private auth = inject(Auth);

  private router = inject(Router);

  private firestore: Firestore = inject(Firestore);

  user$ = user(this.auth);

  isLogged = toSignal(
    this.user$.pipe(
      map((user) => {
        const isLogged = user !== null;

        return isLogged;
      })
    ),
    {
      initialValue: false,
    }
  );

  private userProfileCollection = collection(
    this.firestore,
    'users'
  ) as CollectionReference<UserProfile>;



  constructor() {
    this.user$
      .pipe(
        filter((user) => user !== null),
        
      )
      .subscribe({
        next: (user) => {
          if (user) {
            const up: UserProfile = {
              username: user.email ?? 'N/A',
              displayName: user.displayName ?? '',
              lastOnlineDate: new Date(),
              avatarUrl: undefined,
            };
            const docRef = doc(this.userProfileCollection, user.uid);
            setDoc(docRef, up);
          }
        },
      });
  }

  async signOut() {
    await this.auth.signOut();

    this.router.navigateByUrl('/sign-in');
  }

  signinEmailPwd(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password).then((result) => {
      this.router.navigateByUrl('/');
    });
  }

  signinWithGoogle() {
    const providerGoogle = new GoogleAuthProvider();
    providerGoogle.addScope('email');
    signInWithPopup(this.auth, providerGoogle).then(() => {
      this.router.navigateByUrl('/');
    });
  }

  getUserRef(): Observable<DocumentReference<UserProfile> | undefined>{
    

    return this.user$.pipe(
      filter(u => u !== null),
      switchMap(u => of(doc(this.userProfileCollection, u!.uid)))
    );
  }
}
