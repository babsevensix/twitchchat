import {formatDate} from '@angular/common';
import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import firebase from 'firebase/app';


@Pipe({
    name: 'fromFirestoreDate',
    standalone: true,
})
export class FirestoreDatePipe implements PipeTransform {

    

    transform(timestamp: any, format?: string): Date |string {
        if (!timestamp?.toDate) {
            return '';
        }
        return timestamp.toDate();
    }
}