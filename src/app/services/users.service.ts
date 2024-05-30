import { Injectable, inject } from '@angular/core';
import { UserProfile } from '../models/userprofile.model';
import {
  Firestore,
  collection,
  CollectionReference,
  collectionData,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { addHours } from 'date-fns';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private firestore: Firestore = inject(Firestore);

  private userProfileCollection = collection(
    this.firestore,
    'users'
  ) as CollectionReference<UserProfile>;

  private queryUsersOnline = query(
    this.userProfileCollection,
    where('lastOnlineDate', '>', addHours(new Date(), -2)),
    orderBy('lastOnlineDate', 'desc')
    // limit(1)
  );
  usersOnline$ = collectionData(this.queryUsersOnline, {
    idField: 'uniqueId',
  }) as Observable<UserProfile[]>;
}
