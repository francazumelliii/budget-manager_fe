import { Observable } from "rxjs";
import { Expense, Income } from "../Interfaces/interface";

export interface Delegate{
    lastMonthExpenses(limit: number | null): Observable<Expense[]>;

    lastMonthIncomes(limit: number | null): Observable<Income[]>;
}