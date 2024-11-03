import { Injectable } from "@angular/core";
import { Delegate } from "./delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { Expense, Income } from "../Interfaces/interface";

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
}