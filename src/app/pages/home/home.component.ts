import { AsyncPipe, JsonPipe, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
  where,
  addDoc,
  docData,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  CollectionReference,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, map, from, switchMap } from 'rxjs';
import { UserProfile } from '../../models/userprofile.model';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { addHours } from 'date-fns';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  uniqueId = new FormControl<string>('');

  private usersService = inject(UsersService);
  private auth = inject(Auth);

  private firestore: Firestore = inject(Firestore);

  userLogged$ = user(this.auth);

  users$: Observable<UserProfile[]>;

  usersFiltered$: Observable<UserProfile[]>;

  private userProfileCollection = collection(
    this.firestore,
    'users'
  ) as CollectionReference<UserProfile>;

  constructor() {
    //Riferimento alla collection

    //Get dei dati dalla collection
    this.users$ = collectionData(this.userProfileCollection, {
      idField: 'uniqueId',
    }) as Observable<UserProfile[]>;
    // this.users$ = (collectionData(userProfileCollection) as Observable<UserProfile[]>).pipe(
    //   map(users =>{
    //     return users.filter(m => m.username.startsWith('Al'))
    //   })
    // );
    // const q = query(
    //   this.userProfileCollection,
    //   where('username', '>', 'Al'),
    //   where('username', '<', 'Am'),
    //   orderBy('username', 'asc')
    //   // limit(1)
    // );
    // this.usersFiltered$ = collectionData(q, {
    //   idField: 'uniqueId',
    // }) as Observable<UserProfile[]>;

    this.usersFiltered$ = this.usersService.usersOnline$;
  }

  onAddUser() {
    const up: Partial<UserProfile> = {
      username: formatDate(new Date(), 'hh:mm:ss', 'en'),
    };

    fromPromise(addDoc(this.userProfileCollection, up))
      .pipe(
        switchMap((docRef) => {
          return docData(docRef, { idField: 'uniqueId' });
        })
      )
      .subscribe((doc) => {
        console.log(doc);
      });
  }

  async onDelete() {
    const docRef = doc(this.userProfileCollection, this.uniqueId.value!);
    await deleteDoc(docRef);
    this.uniqueId.setValue('');
    console.log(' documento cancellato ');
  }

  async onUpdateDoc() {
    const docRef = doc(this.userProfileCollection, this.uniqueId.value!);

    getDoc(docRef).then((d)=>{
      const up = d.data();
      setDoc(docRef, {...up, lastOnlineDate: addHours(new Date(), -3) })
    });

    // updateDoc(docRef, {
    //   displayName: `DN: ${formatDate(new Date(), 'hh:mm:ss', 'en')}`,
    // });
  }
}
