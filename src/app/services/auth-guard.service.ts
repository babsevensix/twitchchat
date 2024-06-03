import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { UserProfileService } from './userProfile.service';


export const authGuard: CanActivateFn =(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>{
  const userProfile = inject(UserProfileService);
  const router = inject(Router);

  const isLogged = userProfile.isLogged();
  console.log(' auth guard ', isLogged);
  if (!isLogged){
    router.navigateByUrl('/sign-in');
  }

  return isLogged;

  
  //return true;

};
