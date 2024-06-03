import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { UserProfile } from '../models/userprofile.model';
import { Timestamp } from '@angular/fire/firestore';
import { FirestoreDatePipe } from "../pipes/firestoreDate.pipe";

@Component({
    selector: 'app-sidenav',
    template: `
        <h1 class="text-md font-bold">Users online</h1>
        @for(u of userService.usersOnline$ | async; track $index){
            
            <div class="p-2 flex flex-col items-start justify-start overflow-hidden border-b pb-2 mb-3 hover:bg-gray-100">
                <p class="text-ellipsis overflow-hidden w-full text-xs" >{{u.displayName}} {{u.username}}</p>
                <small>
                    <span>
                        Last viewed 
                    </span>
                    <span>
                        {{ u.lastOnlineDate | fromFirestoreDate | date:'dd/MM/yyyy'}} 
                    </span>
                    <span>
                        {{ u.lastOnlineDate | fromFirestoreDate | date:'HH:mm:ss'}}
                    </span>
                    
                </small>
                    
            </div>
        }
    `,
    styles: `
    :host{
        @apply relative flex flex-col w-full;
    }
    `,
    standalone: true,
    imports: [AsyncPipe, DatePipe, FirestoreDatePipe]
})

export class SideNavComponent  {
    userService = inject(UsersService);

    constructor() { }


}