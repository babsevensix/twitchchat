import { Component, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { combineLatestWith, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { UserProfileService } from '../../services/userProfile.service';
import { updateDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private userProfileService = inject(UserProfileService);

  private readonly storage: Storage = inject(Storage);

    uploadFile(input: HTMLInputElement) {
        if (!input.files) return

        const files: FileList = input.files;

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file) {
                const storageRef = ref(this.storage, file.name);
                uploadBytesResumable(storageRef, file);
                
                
                fromPromise( getDownloadURL(storageRef))
                .pipe(
                  combineLatestWith(this.userProfileService.getUserRef()),
                  switchMap(([url, userDocRef])=>{
                  
                    if (userDocRef){
                      return fromPromise(updateDoc(userDocRef,{avatarUrl: url} ));
                    } 
                    return of(undefined);
                  })
                ).subscribe();
                
    
            }
        }
    }


}
