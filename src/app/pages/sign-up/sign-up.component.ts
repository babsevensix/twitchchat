import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  user,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
  
} from '@angular/fire/auth';
// import * as auth from 'firebase/auth';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  private auth = inject(Auth);

  private fb = inject(NonNullableFormBuilder);

  signUp: FormGroup | undefined;

  signIn: FormGroup | undefined;

  user$ = user(this.auth);

  ngOnInit(): void {
    this.signUp = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.signIn = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  onCreaUtente(): void {
    if (this.signUp) {
      const value = this.signUp.value;
      createUserWithEmailAndPassword(this.auth, value.email, value.password)
        .then((result) => {
          sendEmailVerification(result.user);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  logout() {
    signOut(this.auth).then(() => {
      console.log('utente sloggato');
    });
  }

  onSignin(): void {
    if (this.signIn) {
      const value = this.signIn.value;
      signInWithEmailAndPassword(this.auth, value.email, value.password).then(
        (result) => {}
      );
    }
  }

  onLoginWithGoogle(): void {
    
    const providerGoogle = new GoogleAuthProvider();
    providerGoogle.addScope('email');
    signInWithPopup(this.auth, providerGoogle).then((result)=>{
      
    })
  }
}
