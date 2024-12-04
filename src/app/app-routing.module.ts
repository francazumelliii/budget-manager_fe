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
import { authGuard } from './Guards/auth.guard';

const routes: Routes = [
  {path: "", pathMatch: "full",  component: AuthenticationFormComponent},
  {path: "homepage", component: SidebarComponent,children: [{ path: '', component: HomepageComponent }], canActivate: [authGuard]},
  {path: "profile", component: SidebarComponent,children: [{ path: '', component: ProfileComponent }], canActivate: [authGuard]},
  {path: "expenses", component: SidebarComponent,children: [{ path: '', component: ExpenseComponent }], canActivate: [authGuard]},
  {path: "incomes", component: SidebarComponent,children: [{ path: '', component: IncomeComponent }], canActivate: [authGuard]},
  {path: "account", component: SidebarComponent,children: [{ path: '', component: AccountComponent }], canActivate: [authGuard]},
  {path: "projects", component: SidebarComponent,children: [{ path: '', component: ProjectComponent }], canActivate: [authGuard]},
  {path: "projects/:id", component: SidebarComponent,children: [{ path: '', component: SingleProjectComponent }], canActivate: [authGuard]},
  {path: "children", component: SidebarComponent,children: [{ path: '', component: ChildrenComponent }], canActivate: [authGuard]},
  {path: "children/:id", component: SidebarComponent,children: [{ path: '', component: ChildComponent }], canActivate: [authGuard]},
  {path: "authentication", component: AuthenticationFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
