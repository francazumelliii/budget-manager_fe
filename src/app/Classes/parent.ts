import { Injectable } from "@angular/core";
import { Delegate } from "./delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable, of } from "rxjs";
import { Account, AuthResponse, Expense, Friend, Income, MonthlyStats, Page, PatchAccountRequest, PatchChildRequest, PatchSharedRequest, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project, Role, ShareRequest, SimpleAccount, WeeklyStats } from "../Interfaces/interface";
import { User } from "./user";
import { start } from "node:repl";

@Injectable({
    providedIn: 'root'
})
export class Parent implements Delegate{

    constructor(
        private dbService: DatabaseService
    ){}

    lastMonthExpenses(limit: number | null): Observable<Expense[]>{
        return this.dbService.get(`/account/me/expenses/recent${limit !== null ? '?limit=' + limit : null}`)
    }
    lastMonthIncomes(limit: number | null): Observable<Income[]>{
        return this.dbService.get(`/account/me/incomes/recent${limit != null ? '?limit=' + limit : null}`)
    }

    postExpense(body: PostExpenseRequest): Observable<Expense>{
        return this.dbService.post("/account/me/expenses", body)
    }

    postIncome(body: PostIncomeRequest): Observable<Income>{
        return this.dbService.post("/account/me/incomes", body)
    }

    postTrip(body: PostProjectRequest): Observable<Project>{
        return this.dbService.post("/account/me/projects", body)
    }
    postChild(body: PostChildRequest): Observable<User>{
        return this.dbService.post("/account/me/children", body)
    }
    monthlyStatsPerWeek(date: string = "", weeklyDivided: boolean = true): Observable<WeeklyStats[]>{
        return this.dbService.get(`/account/me/expenses/stats/monthly?date=${date}&weeklyDivided=${weeklyDivided}`)
    }
    monthlyStats(date: string = ""): Observable<MonthlyStats>{
        return this.dbService.get(`/account/me/stats/monthly?date=${date}`)
    }
    allExpensesPaging(page: number, size: number ,order: string, direction: string): Observable<Page<Expense>>{
        return this.dbService.get(`/account/me/expenses/all?page=${page}&size=${size}&order=${order}&direction=${direction}`)
    }
    allIncomesPaging(page: number ,size: number, order: string, direction: string): Observable<Page<Income>>{
        return this.dbService.get(`/account/me/incomes/all?page=${page}&size=${size}&order=${order}&direction=${direction}`)
    }
    allProjectsPaging(page: number ,size: number ,order: string, direction: string): Observable<Page<Project>>{
        return this.dbService.get(`/account/me/projects/all?page=${page}&size=${size}&order=${order}&direction=${direction}`)
    }
    allExpensesInExpiration(): Observable<Expense[]>{
        return this.dbService.get(`/account/me/expenses/expiring`)
    }
    allChildExpenses(id: number, page: number ,size: number, order: string, direction: string): Observable<Page<Expense>>{
        return this.dbService.get(`/account/me/parent/${id}/expenses/all?page=${page}&size=${size}&order=${order}&direction=${direction}`)
    }
    allChildIncomes(id: number,page: number ,size: number, order: string, direction: string): Observable<Page<Expense>>{
        return this.dbService.get(`/account/me/parent/${id}/incomes/all?page=${page}&size=${size}&order=${order}&direction=${direction}`)
    }
    childMonthlyStats(id: number, date: string | null): Observable<MonthlyStats>{
        return this.dbService.get(`/account/me/parent/${id}/stats${date != null ? ('?date=' + date) : null}`)
    }
    searchAccount(email: string): Observable<SimpleAccount>{
        return this.dbService.get(`/account/search?email=${email}`)
    }
    postShareProject(emails: string[], projectId: number): Observable<Project>{
        const body: ShareRequest = {emails: emails, projectId: projectId}
        return this.dbService.post(`/account/me/project/add`, body)
    }
    removeAccountFromProject(projectId: number ,email: string): Observable<Project>{
        return this.dbService.delete(`/account/me/projects/${projectId}/remove?email=${email}`)
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
    patchAccount(body: PatchAccountRequest): Observable<any>{
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
        return this.dbService.get(`/account/me/parent/${id}/projects`)
    }
    childProjectById(childId: number | null, projectId: number): Observable<Project>{
        return this.dbService.get(`/account/me/parent/${childId}/projects/${projectId}`)
    }
    patchChild(childId: number | null, body: PatchChildRequest): Observable<Account>{
        return this.dbService.patch(`/account/me/parent/${childId}`, body)
    }
    deleteChild(childId: number | null): Observable<any>{
        return this.dbService.delete(`/account/me/parent/${childId}`)
    }
    switchToParent():Observable<AuthResponse>{
        const user: Account= {
            id: 0,
            name: "",
            surname: "",
            email: "", 
            birthdate: "",
            defaultCurrency: "",
            image: "", 
            children: null,
            parent: null,
            role: Role.USER
          }
          return of({jwt: "", user: user})
    }

    exportData(): Observable<Blob> {
        return this.dbService.getBlob(`/account/me/export-excel`)
    }
}