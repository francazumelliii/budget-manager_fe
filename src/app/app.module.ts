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
import { ChartComponent } from './Components/chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './Components/profile/profile.component';
import { ExpenseComponent } from './Components/expense/expense.component';
import { TableComponent } from './Components/table/table.component';
import { PaginatorModule } from 'primeng/paginator';


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
    ChartComponent,
    ProfileComponent,
    ExpenseComponent,
    TableComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    CommonModule,
    FormsModule,
    PaginatorModule,
    ReactiveFormsModule,
    BrowserAnimationsModule



],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
