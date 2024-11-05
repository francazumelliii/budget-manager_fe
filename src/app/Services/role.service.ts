import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Delegate } from '../Classes/delegate';
import { Parent } from '../Classes/parent';
import { User } from '../Classes/user';
import { Expense, Income, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project, Role } from '../Interfaces/interface';
import { ServerModule } from '@angular/platform-server';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  delegate!: Delegate;

  constructor(
    private authService: AuthenticationService,
    private parentClass: Parent,
    private userClass: User
  ) { 
    this.initInterface();
  }

  initInterface() {
    if (!this.authService.userInformation) {
      console.warn("User information is not available");
      return;
    }

    if(this.authService.userInformation.role === "PARENT"){
      this.delegate = this.parentClass
    }else if(this.authService.userInformation.role === "USER"){
      this.delegate = this.userClass
    }else {
      console.log("User role not found")
    }
  }

  lastMonthExpenses(limit: number | null): Observable<Expense[]>{
    return this.delegate.lastMonthExpenses(limit)
  }
  lastMonthIncomes(limit: number | null): Observable<Income[]>{
    return this.delegate.lastMonthIncomes(limit)
  }
  postExpense(body: PostExpenseRequest): Observable<Expense>{
    return this.delegate.postExpense(body)
  }
  postIncome(body: PostIncomeRequest): Observable<Income>{
    return this.delegate.postIncome(body)
  }
  postTrip(body: PostProjectRequest) :Observable<Project>{
    return this.delegate.postTrip(body)
  }
  postChild(body: PostChildRequest): Observable<User> | any{
    return this.delegate.postChild(body)
  }
}