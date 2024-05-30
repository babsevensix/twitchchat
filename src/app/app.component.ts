import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import { UserProfileService } from './services/user.profile';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideNavComponent } from "./components/sidenav.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, SignUpComponent, MatSidenavModule, MatListModule, MatIconModule, CommonModule, MatToolbarModule, SideNavComponent]
})
export class AppComponent implements OnInit {
  
  title = 'twitchchat';

  showSubmenu= false;
  isExpanded = false;
  showSubSubMenu = false;
  isShowing = false;

  isLogged = computed(()=>{
    return this.userProfileService.isLogged();
  })

  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  
  ngOnInit(): void {
    this.userProfileService.user$.subscribe({
      next: (u)=>{
        if (u){
          this.router.navigateByUrl('/');
        }
      }
    })
  }


  onSignOut(): void{

    this.userProfileService.signOut();
  }
}
