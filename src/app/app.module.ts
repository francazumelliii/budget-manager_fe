import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthenticationFormComponent } from './Components/authentication-form/authentication-form.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AvatarComponent } from './Components/avatar/avatar.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { DynamicListComponent } from './Components/dynamic-list/dynamic-list.component';
import { QuickaccessBtnComponent } from './Components/quickaccess-btn/quickaccess-btn.component';
import { ModalComponent } from './Components/modal/modal.component';
import { Toast, ToastModule } from 'primeng/toast';
import { QuickaccessModalComponent } from './Components/quickaccess-modal/quickaccess-modal.component';
import { SelectComponent } from './Components/select/select.component';
import { ChartComponent } from './Components/chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './Components/profile/profile.component';
import { ExpenseComponent } from './Components/expense/expense.component';
import { TableComponent } from './Components/table/table.component';
import { PaginatorModule } from 'primeng/paginator';
import { FrequencyIconComponent } from './Components/frequency-icon/frequency-icon.component';
import { CategoryIconComponent } from './Components/category-icon/category-icon.component';
import { IncomeComponent } from './Components/income/income.component';
import { MessageService } from 'primeng/api';
import { ChildrenComponent } from './Components/children/children.component';
import { CardComponent } from './Components/card/card.component';
import { ChildComponent } from './Components/child/child.component';
import { AccountComponent } from './Components/account/account.component';
import { ProjectComponent } from './Components/project/project.component';

import { AccountIconComponent } from './Components/account-icon/account-icon.component';
import { SearchAccountComponent } from './Components/search-account/search-account.component';
import { OptionModalComponent } from './Components/option-modal/option-modal.component';
import { SingleProjectComponent } from './Components/single-project/single-project.component';
import { ChoosePersonModalComponent } from './Components/choose-person-modal/choose-person-modal.component';
import { AccountIconCompleteComponent } from './Components/account-icon-complete/account-icon-complete.component';
import { Interceptor } from './Security/interceptor.service';
import { AccountModalComponent } from './Components/account-modal/account-modal.component';



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
    FrequencyIconComponent,
    CategoryIconComponent,
    IncomeComponent,
    ChildrenComponent,
    CardComponent,
    ChildComponent,
    AccountComponent,
    ProjectComponent,
    AccountIconComponent,
    SearchAccountComponent,
    OptionModalComponent,
    SingleProjectComponent,
    ChoosePersonModalComponent,
    AccountIconCompleteComponent,
    AccountModalComponent,



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
    BrowserAnimationsModule,
    ToastModule



],
  providers: [
    /* {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }, */
    provideClientHydration(),
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
