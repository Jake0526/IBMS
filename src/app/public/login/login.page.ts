import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  username = "";
  password = "";

  constructor(private authService: AuthenticationService, 
              private http: HTTP, private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: '',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  login() {

    let data = {
      'username': this.username,
      'password': this.password
    };

    let headers = {
        'Content-Type': 'application/json'
    };

    this.http.setDataSerializer('json');
    this.http.post('http://localhost:8000/api/auth/login', data, headers)
    .then(data => {
      var result = JSON.parse(data.data);

      console.log(data);

      if (!result) {
        console.log("Incorrect Username or password");
        this.presentAlert("Incorrect Username or password");

        this.password = "";
      }else {
        console.log(data.status);
        console.log(JSON.parse(data.data)); // data received by server
        console.log(data.headers);

        this.authService.login();

        this.password = "";
      }
    })
    .catch(error => {
      console.log("error");
      console.log(error);

      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);

    });
  }
}
