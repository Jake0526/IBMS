import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', 
    // canActivate: [AuthGuardService],
    loadChildren: './members/tabs/tabs.module#TabsModule' 
  },
  { path: 'complaint', loadChildren: './complaint/complaint.module#ComplaintPageModule' },
  { path: 'report', loadChildren: './report/report.module#ReportPageModule' },
];
1
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
