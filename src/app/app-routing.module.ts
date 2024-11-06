import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationFormComponent } from './Components/authentication-form/authentication-form.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { ProfileComponent } from './Components/profile/profile.component';

const routes: Routes = [
  {path: "", component: AuthenticationFormComponent},
  {path: "homepage", component: SidebarComponent,children: [{ path: '', component: HomepageComponent }]},
  {path: "profile", component: SidebarComponent,children: [{ path: '', component: ProfileComponent }]},
  {path: "authentication", component: AuthenticationFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
