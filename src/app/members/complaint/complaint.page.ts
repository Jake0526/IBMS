import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.page.html',
  styleUrls: ['./complaint.page.scss'],
})
export class ComplaintPage implements OnInit {

  constructor(private storage: Storage) { }

  userData = {};

  ngOnInit() {
    this.storage.get('userData').then((val) => {
      this.userData = val;
    });
  }

}
