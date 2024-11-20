import { Injectable } from "@angular/core";
import { Delegate } from "./delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { Expense, Income, MonthlyStats, Page, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project, ShareRequest, SimpleAccount, WeeklyStats } from "../Interfaces/interface";
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
    removeAccountFromProject(projectId: number ,email: string, option: 'keep' | 'remove'): Observable<Project>{
        return this.dbService.delete(`/account/me/projects/${projectId}/remove?email=${email}&option=${option}`)
    }
}