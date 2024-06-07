import { Component, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { UserProfileService } from '../../services/userProfile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private userProfileService = inject(UserProfileService);

  private readonly storage: Storage = inject(Storage);

  frm: FormGroup;

  constructor(fb: FormBuilder){
    this.frm = fb.group({
      displayName : ['', [Validators.required, Validators.minLength(3)]],
      avatarUrl: [''],
    });

    this.userProfileService.getUserProfile()
      .pipe()
      .subscribe({
        next: (u)=>{
          if (u){
            this.frm.setValue({
              displayName: u.displayName,
              avatarUrl: u.avatarUrl
            })
          }
        }
      });

  }

  

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
                // combineLatestWith(this.userProfileService.getUserRef()),
                // switchMap(([url, userDocRef])=>{
                
                //   if (userDocRef){
                //     return fromPromise(updateDoc(userDocRef,{avatarUrl: url} ));
                //   } 
                //   return of(undefined);
                // })
              ).subscribe({
                next: (avatarUrl)=>{
                  this.frm.patchValue({
                    avatarUrl
                  });
                }
              });
              
  
          }
      }
  }

  onSaveChanges(): void{
   

    this.userProfileService.updateProfile(this.frm.value).pipe(

    ).subscribe({
      next: ()=>{

      }
    })
  }

}
