import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Delegate } from '../Classes/delegate';
import { Parent } from '../Classes/parent';
import { User } from '../Classes/user';
import {
  Account,
  AuthResponse,
  Expense,
  Friend,
  Income,
  MonthlyStats,
  Page,
  PatchAccountRequest,
  PatchChildRequest,
  PatchSharedRequest,
  PostChildRequest,
  PostExpenseRequest,
  PostIncomeRequest,
  PostProjectRequest,
  Project,
  Role,
  SimpleAccount,
  WeeklyStats,
} from '../Interfaces/interface';
import { ServerModule } from '@angular/platform-server';
import { Observable } from 'rxjs';
import { start } from 'node:repl';
import { promises } from 'node:dns';
import exp from 'node:constants';

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
  allExpensesPaging(childId: number | null, page: number, size: number ,order: string, direction: string): Observable<Page<Expense>> {
    if(childId == null){
      return this.delegate.allExpensesPaging(page, size, order, direction)
    }else{
      return this.delegate.allChildExpenses(childId,page,size,order,direction)
    }
  }
  allIncomesPaging(childId: number | null , page: number, size: number ,order: string, direction :string): Observable<Page<Income>>{
    if(childId == null){
      return this.delegate.allIncomesPaging(page, size, order, direction)
    }else {
      return this.delegate.allChildIncomes(childId, page,size,order,direction)
    }
  }
  allProjectsPaging(page: number ,size: number, order: string, direction: string): Observable<Page<Project>>{
    return this.delegate.allProjectsPaging(page, size, order, direction)
  }
  allExpensesInExpiration(): Observable<Expense[]>{
    return this.delegate.allExpensesInExpiration()
  }
  allChildExpenses(id: number, page: number ,size: number, order: string, direction: string): Observable<Page<Expense>> | null{
    return this.delegate.allChildExpenses(id, page,size,order,direction)
  }
  allChildIncomes(id: number, page: number ,size: number, order: string, direction: string): Observable<Page<Income>> | null{
    return this.delegate.allChildIncomes(id, page,size,order,direction)
  }
  childMonthlyStats(id: number ,date: string | null): Observable<MonthlyStats> | null{
    return this.delegate.childMonthlyStats(id, date)
  }
  searchAccount(email: string): Observable<SimpleAccount>{
    return this.delegate.searchAccount(email);
  }
  postShareProject(emails: string[], projectId: number): Observable<Project>{
    return this.delegate.postShareProject(emails, projectId);
  }
  removeAccountFromProject(projectId: number, email: string): Observable<Project>{
    return this.delegate.removeAccountFromProject(projectId, email)
  }
  deleteExpense(id: number):Observable<any>{
    return this.delegate.deleteExpense(id)
  }
  getProject(childId: number | null , id: number): Observable<Project>{
    if(childId === null){
      return this.delegate.getProject(id);
    }else{
      return this.delegate.childProjectById(childId,id)
    }
  }
  patchShared(obj: PatchSharedRequest, projectId: number ,expenseId: number): Observable<Project>{
    return this.delegate.patchShared(obj, projectId, expenseId)
  }
  getFriends(): Observable<Friend[]>{
    return this.delegate.getFriends()
  }
  patchAccount(body: PatchAccountRequest) :Observable<any>{
    return this.delegate.patchAccount(body)
  }
  deleteAccount():Observable<any>{
    return this.delegate.deleteAccount()
  }
  deleteProject(id: number): Observable<any>{
    return this.delegate.deleteProject(id)
  }
  patchProject(body: PostProjectRequest, id: number): Observable<Project>{
    return this.delegate.patchProject(body, id)
  }
  patchExpense(body: PostExpenseRequest, id: number): Observable<Expense>{
    return this.delegate.patchExpense(body, id)
  }
  patchIncome(body: PostIncomeRequest, id: number): Observable<Income>{
    return this.delegate.patchIncome(body, id)
  }
  deleteIncome(id: number): Observable<any>{
    return this.delegate.deleteIncome(id)
  }
  allChildProjects(id: number): Observable<Project[]>{
    return this.delegate.allChildProjects(id)
  }
  patchChild(childId: number | null, body: PatchChildRequest): Observable<Account>{
    return this.delegate.patchChild(childId, body)
  }
  deleteChild(childId: number | null): Observable<any>{
    return this.delegate.deleteChild(childId)
  }
  switchToParent():Observable<AuthResponse>{
    return this.delegate.switchToParent()
  }
  exportData(): Observable<Blob>{
    return this.delegate.exportData()
  }
}
