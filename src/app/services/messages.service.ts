import { Injectable, inject } from '@angular/core';

import { CollectionReference, Firestore, addDoc, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { UserProfile } from '../models/userprofile.model';
import { Message } from '../models/message.model';
import { UserProfileService } from './userProfile.service';
import { Observable, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { toSignal } from '@angular/core/rxjs-interop';
import { CollectionsService } from './firestorecollections.service';


@Injectable({providedIn: 'root'})
export class MessageService {
    private collectionService = inject(CollectionsService);

    

    private userProfileService = inject(UserProfileService);

    private queryMessages = query(
        this.collectionService.messageCollection,
        // where('lastOnlineDate', '>', addHours(new Date(), -2)),
        orderBy('messageSentOn', 'desc')
        // limit(1)
      );

    readonly messages = toSignal(collectionData(this.queryMessages, {
       // idField: 'uniqueId',

      }) as Observable<Message[]>);

    constructor() { }
    

    sentNewMessage(message: string): void{


        this.userProfileService.getUserRef().pipe(
            switchMap((userSent) =>{
                if (userSent){
                    const newMessage: Message ={
                        message,
                        messageSentOn : new Date(),
                        userSent
                    };

                    return fromPromise(addDoc(this.collectionService.messageCollection, newMessage));
                }
                return of(undefined);
            })
        ).subscribe({
            next:(messageDocRef)=>{
                console.log(' message inseted', messageDocRef);
            }
        });
    }

    
}