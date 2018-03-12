import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService:UserService, private auth:AuthService, router:Router){
    auth.user$.subscribe(user => {
      if(user){
        userService.save(user); //everytime user logs in he will be stored in db which is not very effective, it actually happens only at registration time.
        let returnUrl = localStorage.getItem('returnUrl');
        router.navigateByUrl(returnUrl);
      }
    })
  }
}
