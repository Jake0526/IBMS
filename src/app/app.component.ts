import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appMenu = [
    {
      title: 'Home', url: '/members/tabs/(home:home)', icon: 'home'
    },
    {
      title: 'File Complaint', url: '/members/complaint', icon: 'shuffle'
    }, 
    {
      title: 'Report Incident', url: '/members/report', icon: 'warning'
    }
  ]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.authenticationState.subscribe(state => {
        console.log(state)
        if (state) {
          this.router.navigateByUrl('/members/tabs/(home:home)');
        }else {
          this.router.navigate(['login']);
        }
      })
    });
  }
}
