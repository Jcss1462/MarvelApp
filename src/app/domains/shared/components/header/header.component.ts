import { Component, inject } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  imports: [RouterOutlet,RouterLinkWithHref],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  private spinnerService = inject(SpinnerService);
  private userService = inject(UserService);
  private localStorageService = inject(LocalStorageService);

  userData=this.localStorageService.userData;

  logOut(){
    this.localStorageService.removeUserDataLocalStorage();
  }

  toogleNavVar(){

    const navMenu = document.getElementById("right-panel");
    if(navMenu!=null){
      navMenu.classList.toggle('open');
    }
   
  }

}
