import { Observable } from "rxjs";
import { Expense, Income, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project, User } from "../Interfaces/interface";

export interface Delegate{
    lastMonthExpenses(limit: number | null): Observable<Expense[]>;

    lastMonthIncomes(limit: number | null): Observable<Income[]>;

    postExpense(body: PostExpenseRequest): Observable<Expense>; 

    postIncome(body: PostIncomeRequest): Observable<Income>;

    postTrip(body: PostProjectRequest): Observable<Project>;

    postChild(body: PostChildRequest): Observable<User> | any;
}