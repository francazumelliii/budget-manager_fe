import { Injectable } from "@angular/core";
import { Delegate } from "./delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { Expense, Income, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project } from "../Interfaces/interface";
import { User } from "./user";

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
}