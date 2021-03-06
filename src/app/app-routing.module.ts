import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import { RecordComponent } from './record/record.component';




const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'record', component: RecordComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes) 
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
