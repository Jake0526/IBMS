import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appMenu = [
    {
      title: 'Home', url: '/', icon: 'home'
    },
    {
      title: 'File Complaint', url: '/complaint', icon: 'shuffle'
    }, 
    {
      title: 'Report Incident', url: '/report', icon: 'warning'
    }, 
    {
      title: 'Logout', url: '/login', icon: 'log-out'
    }
  ]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
