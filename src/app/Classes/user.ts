import { Injectable } from '@angular/core';
import { Delegate } from './delegate';
import { DatabaseService } from '../Services/database.service';
import { Observable, of } from 'rxjs';
import {
  Expense,
  Friend,
  Income,
  MonthlyStats,
  Page,
  PatchAccountRequest,
  PatchSharedRequest,
  PostChildRequest,
  PostExpenseRequest,
  PostIncomeRequest,
  PostProjectRequest,
  Project,
  SimpleAccount,
  WeeklyStats,
} from '../Interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class User implements Delegate {
  constructor(private dbService: DatabaseService) {}

  lastMonthExpenses(limit: number | null): Observable<Expense[]> {
    return this.dbService.get(
      `/account/me/expenses/recent${limit !== null ? '?limit=' + limit : null}`
    );
  }
  lastMonthIncomes(limit: number | null): Observable<Income[]> {
    return this.dbService.get(
      `/account/me/incomes/recent${limit != null ? '?limit=' + limit : null}`
    );
  }
  postExpense(body: PostExpenseRequest): Observable<Expense> {
    return this.dbService.post('/account/me/expenses', body);
  }
  postIncome(body: PostIncomeRequest): Observable<Income> {
    return this.dbService.post('/account/me/incomes', body);
  }
  postTrip(body: PostProjectRequest): Observable<Project> {
    return this.dbService.post('/account/me/projects', body);
  }
  postChild(body: PostChildRequest): any {
    return null;
  }
  monthlyStatsPerWeek(
    date: string = '',
    weeklyDivided: boolean = true
  ): Observable<WeeklyStats[]> {
    return this.dbService.get(
      `/account/me/expenses/stats/monthly?date=${date}&weeklyDivided=${weeklyDivided}`
    );
  }
  monthlyStats(date: string = ''): Observable<MonthlyStats> {
    return this.dbService.get(`/account/me/stats/monthly?date=${date}`);
  }
  allExpensesPaging(
    page: number,
    size: number,
    order: string,
    direction: string
  ): Observable<Page<Expense>> {
    return this.dbService.get(
      `/account/me/expenses/all?page=${page}&size=${size}&order=${order}&direction=${direction}`
    );
  }
  allIncomesPaging(
    page: number,
    size: number,
    order: string,
    direction: string
  ): Observable<Page<Income>> {
    return this.dbService.get(
      `/account/me/incomes/all?page=${page}&size=${size}&order=${order}&direction=${direction}`
    );
  }
  allExpensesInExpiration(): Observable<Expense[]> {
    return this.dbService.get(`/account/me/expenses/expiring`);
  }
  allChildExpenses(id: number, page: number ,size: number, order: string, direction: string): Observable<Page<Expense>> {
    const emptyPage: Page<Expense> = {
        page: 0,
        size: page,  
        records: [],  
        totalRecords: 0, 
        totalPages: 0,  
    };
    return of(emptyPage);
  }
  allChildIncomes(id: number, page: number ,size: number, order: string, direction: string): Observable<Page<Income>> {
    const emptyPage: Page<Income> = {
        page: 0,
        size: page,  
        records: [],  
        totalRecords: 0, 
        totalPages: 0,  
    };
    return of(emptyPage);
  }
  allProjectsPaging(page: number ,size: number ,order: string, direction: string): Observable<Page<Project>>{
    return this.dbService.get(`/account/me/projects/all?page=${page}&size=${size}&order=${order}&direction=${direction}`)
  }
  childMonthlyStats(id: number, date: string | null): null {
    return null;
  }
  searchAccount(email: string): Observable<SimpleAccount>{
    return this.dbService.get(`/account/search?email=${email}`)
  }
  postShareProject(emails: string[], projectId: number): Observable<Project>{
    const body = {emails: emails, projectId: projectId}
    return this.dbService.post(`/account/me/project/add`, body)
  }
  removeAccountFromProject(projectId: number ,email: string, option: 'keep' | 'remove'): Observable<Project>{
    return this.dbService.delete(`/account/me/projects/${projectId}/remove?email=${email}&option=${option}`)
  }
  deleteExpense(id: number):Observable<any>{
    return this.dbService.delete(`/account/me/expenses/${id}`)
  }
  getProject(id: number ): Observable<Project>{
    return this.dbService.get(`/account/me/projects/${id}`)
  }
  patchShared(obj: PatchSharedRequest, projectId: number, expenseId: number): Observable<Project>{
    return this.dbService.patch(`/account/me/projects/${projectId}/expense/${expenseId}`, obj)
  }
  getFriends(): Observable<Friend[]>{
    return this.dbService.get(`/account/me/friends`)
  }
  patchAccount(body: PatchAccountRequest): Observable<User>{
    return this.dbService.patch("/account/me",body)
  } 
  deleteAccount():Observable<any>{
    return this.dbService.delete("/account/me")
  }
  deleteProject(id: number): Observable<any>{
    return this.dbService.delete(`/account/me/projects/${id}`)
  }
  patchProject(body: PostProjectRequest, id: number): Observable<Project>{
    return this.dbService.patch(`/account/me/projects/${id}`, body)
  
  }
  patchExpense(body: PostExpenseRequest, id: number): Observable<Expense>{
    return this.dbService.patch(`/account/me/expenses/${id}`, body)
  }
  patchIncome(body: PostIncomeRequest, id: number): Observable<Income>{
      return this.dbService.patch(`/account/me/incomes/${id}`, body)
  }
  deleteIncome(id: number): Observable<any>{
    return this.dbService.delete(`/account/me/incomes/${id}`)
  }
  allChildProjects(id: number): Observable<Project[]>{
    const project: Project = {
      id: 0,
      name: "", 
      description: "", 
      image: "",
      goalAmount: 0,
      expenses: [],
      createdAt: "", 
      creator: {
        name: "",
        surname: "",
        email: '',
        image: '',
        splitAmount: 0
      },
      accounts: []

    }
    return of(Array(project))
  }
  childProjectById(childId: number | null, projectId: number): Observable<Project>{
    const project: Project = {
      id: 0,
      name: "", 
      description: "", 
      image: "",
      goalAmount: 0,
      expenses: [],
      createdAt: "", 
      creator: {
        name: "",
        surname: "",
        email: '',
        image: '',
        splitAmount: 0
      },
      accounts: []

    }
    return of (project)
}
}
