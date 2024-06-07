import { Injectable, OnInit, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  user,
} from '@angular/fire/auth';

import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatestWith, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UserProfile } from '../models/userprofile.model';
import { CollectionsService } from './firestorecollections.service';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({ providedIn: 'root' })
export class UserProfileService  {
  private auth = inject(Auth);

  private router = inject(Router);

  private collectionService = inject(CollectionsService);

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

  



  constructor() {
    this.user$
      .pipe(
        filter((user) => user !== null),
        combineLatestWith(this.getUserProfile())
        
      )
      .subscribe({
        next: ([user, existUserProfile]) => {
          if (user) {
            let up: UserProfile = {
              username: user.email ?? 'N/A',
              displayName: user.displayName ?? '',
              lastOnlineDate: new Date(),
              avatarUrl: null,
            };

            up = existUserProfile ? {...up, ...existUserProfile, lastOnlineDate: new Date()} : up;
            const docRef = 
              doc(this.collectionService.userProfileCollection, user.uid);
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
      switchMap(u => of(doc(this.collectionService.userProfileCollection, u!.uid)))
    );
  }

  getUserProfile(): Observable<UserProfile | undefined>{
    return this.getUserRef().pipe(
      switchMap(upr => upr ? fromPromise(getDoc(upr)).pipe(
        map(ds=> ds.data())
      ) : of(undefined))
    );
  }

  updateProfile(value: UserProfile): Observable<void>{
    return this.getUserRef().pipe(
      filter(u => u !== null && u !== undefined),
      switchMap((userRef)=> fromPromise(updateDoc(userRef!, {...value}) ))
    );
  }
}
