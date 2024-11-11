import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Delegate } from '../Classes/delegate';
import { Parent } from '../Classes/parent';
import { User } from '../Classes/user';
import {
  Expense,
  Income,
  Page,
  PostChildRequest,
  PostExpenseRequest,
  PostIncomeRequest,
  PostProjectRequest,
  Project,
  Role,
  WeeklyStats,
} from '../Interfaces/interface';
import { ServerModule } from '@angular/platform-server';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
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
      console.warn('User information is not available');
      return;
    }

    if (this.authService.userInformation.role === 'PARENT') {
      this.delegate = this.parentClass;
    } else if (this.authService.userInformation.role === 'USER') {
      this.delegate = this.userClass;
    } else {
      console.log('User role not found');
    }
  }

  lastMonthExpenses(limit: number | null): Observable<Expense[]> {
    return this.delegate.lastMonthExpenses(limit);
  }
  lastMonthIncomes(limit: number | null): Observable<Income[]> {
    return this.delegate.lastMonthIncomes(limit);
  }
  postExpense(body: PostExpenseRequest): Observable<Expense> {
    return this.delegate.postExpense(body);
  }
  postIncome(body: PostIncomeRequest): Observable<Income> {
    return this.delegate.postIncome(body);
  }
  postTrip(body: PostProjectRequest): Observable<Project> {
    return this.delegate.postTrip(body);
  }
  postChild(body: PostChildRequest): Observable<User> | any {
    return this.delegate.postChild(body);
  }
  monthlyStatsPerWeek(date: string = '', weeklyDivided: boolean = true ): Observable<WeeklyStats[]> {
    return this.delegate.monthlyStatsPerWeek(date, weeklyDivided);
  }
  monthlyStats(date: string){
    return this.delegate.monthlyStats(date);
  }
  allExpensesPaging(page: number, size: number ,order: string, direction: string): Observable<Page<Expense>>{
    return this.delegate.allExpensesPaging(page, size, order, direction)
  }
  allIncomesPaging(page: number, size: number ,order: string, direction :string): Observable<Page<Income>>{
    return this.delegate.allIncomesPaging(page, size, order, direction)
  }
}
