import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthenticationService } from '../../services/authentication.service';

import { finalize } from 'rxjs/operators';
import { LoadedRouterConfig } from '@angular/router/src/config';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  userData = {
    id: 0
  };

  x = 0;
  images = [];
  currentLat = 0;
  currentLng = 0;
  reportDescription = "";
  formData = new FormData();

  constructor(private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, public loadingCtrl: LoadingController,
    private ref: ChangeDetectorRef, private geolocation: Geolocation,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadStoredImages();

      this.geolocation.getCurrentPosition().then((resp) => {
        this.currentLat = resp.coords.latitude
        this.currentLng = resp.coords.longitude
      }).catch((error) => {
        alert('Error getting location' + error);
      });

      this.storage.get('userData').then((val) => {
        if(val == null) {
          this.authService.logout();
        }

        this.userData.id = val.id;

        console.log(val);
      });
    });
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async selectImage() {
    this.takePicture(this.camera.PictureSourceType.CAMERA);

    // const actionSheet = await this.actionSheetController.create({
    //   header: "Select Image source",
    //   buttons: [{
    //     text: 'Load from Library',
    //     handler: () => {
    //       this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    //     }
    //   },
    //   {
    //     text: 'Use Camera',
    //     handler: () => {
    //       this.takePicture(this.camera.PictureSourceType.CAMERA);
    //     }
    //   },
    //   {
    //     text: 'Cancel',
    //     role: 'cancel'
    //   }
    //   ]
    // });
    // await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        // this.presentToast('File removed.');
      });
    });
  }

  imageLooper() {

    if(this.x < this.images.length) {

      this.file.resolveLocalFilesystemUrl(this.images[this.x].filePath)
      .then(entry => {
          ( < FileEntry > entry).file(file => this.readFile(file))
      })
      .catch(err => {
          this.presentToast('Error while reading file ' + this.images[this.x] + '.');

          this.x+=1;

          this.imageLooper();
      });
    }else {

      this.uploadImageData();
    }
  }

  startUpload(imgEntry) {

    // this.imageLooper();

    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
          ( < FileEntry > entry).file(file => this.readFile(file))
      })
      .catch(err => {
          this.presentToast('Error while reading file.');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });

        this.formData.append('file' + this.x, imgBlob, file.name);

        this.x+=1;

        this.imageLooper();
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData() {
    
    this.formData.append('locationLat', String(this.currentLat));
    this.formData.append('locationLng', String(this.currentLng));
    this.formData.append('description', String(this.reportDescription));
    this.formData.append('imageCount', String(this.images.length));
    this.formData.append('type', 'Emergency');
    this.formData.append('userId', String(this.userData.id));

    alert(this.userData.id);

    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...'
    });
    
    await loading.present();

    this.http.post("http://192.168.0.16:8000/api/submit-report", this.formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          this.presentToast('File upload complete.');

          var count = this.images.length;

          for (var i = 0; i < count; i++) {
            this.deleteImage(this.images[0], 0);
          }

          this.x = 0;
        } else {
          this.presentToast('File upload failed.');

          this.x = 0;
        }
      });
  }
}
