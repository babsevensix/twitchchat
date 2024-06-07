import { inject, Injectable } from '@angular/core';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Message } from '../models/message.model';
import { UserProfile } from '../models/userprofile.model';

@Injectable({providedIn: 'root'})
export class CollectionsService {
    private firestore: Firestore = inject(Firestore);
    
    readonly messageCollection = collection(
        this.firestore,
        'messages'
      ) as CollectionReference<Message>;
    

    readonly userProfileCollection = collection(
        this.firestore,
        'users'
      ) as CollectionReference<UserProfile>;
}