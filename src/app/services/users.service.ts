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
import { CollectionsService } from './firestorecollections.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private collectionService = inject(CollectionsService);

  private queryUsersOnline = query(
    this.collectionService.userProfileCollection,
    where('lastOnlineDate', '>', addHours(new Date(), -2)),
    orderBy('lastOnlineDate', 'desc')
    // limit(1)
  );

  
  usersOnline$ = collectionData(this.queryUsersOnline, {
    idField: 'uniqueId',
  }) as Observable<UserProfile[]>;
}
