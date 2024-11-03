import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthenticationFormComponent } from './Components/authentication-form/authentication-form.component';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AvatarComponent } from './Components/avatar/avatar.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { DynamicListComponent } from './Components/dynamic-list/dynamic-list.component';
import { QuickaccessBtnComponent } from './Components/quickaccess-btn/quickaccess-btn.component';
import { ModalComponent } from './Components/modal/modal.component';
import { QuickaccessModalComponent } from './Components/quickaccess-modal/quickaccess-modal.component';
import { SelectComponent } from './Components/select/select.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthenticationFormComponent,
    SidebarComponent,
    AvatarComponent,
    HomepageComponent,
    DynamicListComponent,
    QuickaccessBtnComponent,
    ModalComponent,
    QuickaccessModalComponent,
    SelectComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule



],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
