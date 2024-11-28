import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationFormComponent } from './Components/authentication-form/authentication-form.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { Expense } from './Interfaces/interface';
import { ExpenseComponent } from './Components/expense/expense.component';
import { IncomeComponent } from './Components/income/income.component';
import { ChildrenComponent } from './Components/children/children.component';
import { ChildComponent } from './Components/child/child.component';
import { AccountComponent } from './Components/account/account.component';
import { ProjectComponent } from './Components/project/project.component';
import { SingleProjectComponent } from './Components/single-project/single-project.component';

const routes: Routes = [
  {path: "", component: AuthenticationFormComponent},
  {path: "homepage", component: SidebarComponent,children: [{ path: '', component: HomepageComponent }]},
  {path: "profile", component: SidebarComponent,children: [{ path: '', component: ProfileComponent }]},
  {path: "expenses", component: SidebarComponent,children: [{ path: '', component: ExpenseComponent }]},
  {path: "incomes", component: SidebarComponent,children: [{ path: '', component: IncomeComponent }]},
  {path: "account", component: SidebarComponent,children: [{ path: '', component: AccountComponent }]},
  {path: "projects", component: SidebarComponent,children: [{ path: '', component: ProjectComponent }]},
  {path: "projects/:id", component: SidebarComponent,children: [{ path: '', component: SingleProjectComponent }]},
  {path: "children", component: SidebarComponent,children: [{ path: '', component: ChildrenComponent }]},
  {path: "children/:id", component: SidebarComponent,children: [{ path: '', component: ChildComponent }]},
  {path: "authentication", component: AuthenticationFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
