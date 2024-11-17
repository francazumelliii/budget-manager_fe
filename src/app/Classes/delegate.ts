import { Observable } from "rxjs";
import { Expense, Income, MonthlyStats, Page, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project, User, WeeklyStats } from "../Interfaces/interface";

export interface Delegate{
    lastMonthExpenses(limit: number | null): Observable<Expense[]>;

    lastMonthIncomes(limit: number | null): Observable<Income[]>;

    postExpense(body: PostExpenseRequest): Observable<Expense>; 

    postIncome(body: PostIncomeRequest): Observable<Income>;

    postTrip(body: PostProjectRequest): Observable<Project>;

    postChild(body: PostChildRequest): Observable<User> | any;

    monthlyStatsPerWeek(date: string, weeklyDivided: boolean): Observable<WeeklyStats[]>

    monthlyStats(date: string): Observable<MonthlyStats>

    allExpensesPaging(page: number, size :number ,order: string, direction: string): Observable<Page<Expense>>

    allIncomesPaging(page: number, size: number, order: string, direction: string): Observable<Page<Income>>

    allExpensesInExpiration(): Observable<Expense[]>
    
    allChildExpenses(id: number,page: number ,size: number, order: string, direction: string): Observable<Page<Expense>>

    allChildIncomes(id: number,page: number ,size: number, order: string, direction: string): Observable<Page<Income>> 

    childMonthlyStats(id: number, date: string | null): Observable<MonthlyStats> | null
}