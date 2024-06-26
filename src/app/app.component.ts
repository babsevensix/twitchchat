import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import { UserProfileService } from './services/userProfile.service';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideNavComponent } from "./components/sidenav.component";
import { MatIconButton } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, SignUpComponent, 
      RouterLink,
      MatSidenavModule, MatListModule, 
      MatIconModule, CommonModule, MatToolbarModule,
      MatIconButton, SideNavComponent, MatMenuModule]
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

  private activatedRoute = inject(ActivatedRoute);

  
  ngOnInit(): void {
    this.userProfileService.user$.subscribe({
      next: (u)=>{
        console.log(' user ', this.activatedRoute.snapshot.pathFromRoot);
        // if (u){
        //   if (this.activatedRoute.snapshot.url.some(us => us.path === 'sign-in')){
            void this.router.navigateByUrl('/');
        //   }
          
        // }
      }
    })
  }


  onSignOut(): void{

    this.userProfileService.signOut();
  }
}
