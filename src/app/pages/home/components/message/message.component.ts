import { Component, computed, inject, input } from '@angular/core';
import { Message } from '../../../../models/message.model';
import { getDoc } from '@angular/fire/firestore';
import { AsyncPipe, DatePipe, JsonPipe, NgClass } from '@angular/common';
import { FirestoreDatePipe } from '../../../../pipes/firestoreDate.pipe';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ JsonPipe, AsyncPipe, FirestoreDatePipe, DatePipe, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  private auth = inject(Auth);
  
  message = input.required<Message>();

  userSent = computed(async ()=>{
    const msg = this.message();
    const userDoc = await getDoc(msg.userSent)
    
    return userDoc.data();
  });



  messageSentFromMe = computed(()=>{
    const msg = this.message();
    
    return this.auth.currentUser?.uid === msg.userSent.id;
  });

}
