import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  // { path: '', redirectTo: 'home',pathMatch: 'full' }
  //{ path: 'home', loadChildren: './home/home.module#HomePageModule' },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'complaint', loadChildren: './complaint/complaint.module#ComplaintPageModule' },
  // { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  {
    path: 'members',
    canActivate: [AuthGuardService],
    loadChildren: './members/member-routing.module#MemberRoutingModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
