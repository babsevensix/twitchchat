import { Component, OnInit, inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { NonNullableFormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { UserProfileService } from '../../services/user.profile';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit{


  userProfile = inject(UserProfileService);



  private fb = inject(NonNullableFormBuilder);
  signIn: FormGroup | undefined;

  private router = inject(Router);
  ngOnInit(): void {
    

    this.signIn = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }


  onSignin(): void {
    if (this.signIn) {
      const value = this.signIn.value;
      
      this.userProfile.signinEmailPwd(value.email, value.password);
    }
  }

  onLoginWithGoogle(): void {
    this.userProfile.signinWithGoogle();
  }
  
}
