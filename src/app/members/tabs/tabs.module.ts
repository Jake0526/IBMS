import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';
import { ProfilePageModule } from '../profile/profile.module';
import { HomePageModule } from '../home/home.module';
import { NotificationPageModule } from '../notification/notification.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsRoutingModule,
    HomePageModule,
    ProfilePageModule,
    NotificationPageModule
  ],
  declarations: [TabsComponent]
})
export class TabsModule { }
