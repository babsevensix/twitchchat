import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { UserProfile } from '../models/userprofile.model';
import { Timestamp } from '@angular/fire/firestore';
import { FirestoreDatePipe } from "../pipes/firestoreDate.pipe";

@Component({
    selector: 'app-sidenav',
    template: `
        @for(u of userService.usersOnline$ | async; track $index){
            <div class="flex flex-col items-start justify-start">
                <p>{{u.displayName}}</p>
                <small>{{ u.lastOnlineDate | fromFirestoreDate | date:'dd/MM/yyyy'}}</small>
                <small>{{ u.lastOnlineDate | fromFirestoreDate | date:'HH:mm:ss'}}</small>
            </div>
        }
    `,
    styles: ``,
    standalone: true,
    imports: [AsyncPipe, DatePipe, FirestoreDatePipe]
})

export class SideNavComponent  {
    userService = inject(UsersService);

    constructor() { }


}