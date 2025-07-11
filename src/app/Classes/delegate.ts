import { Observable } from "rxjs";
import { Account, AuthResponse, Expense, Friend, Income, MonthlyStats, Page, PatchAccountRequest, PatchChildRequest, PatchSharedRequest, PostChildRequest, PostExpenseRequest, PostIncomeRequest, PostProjectRequest, Project, SimpleAccount, User, WeeklyStats } from '../Interfaces/interface';

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
    
    allProjectsPaging(page: number ,size: number ,order: string, direction: string) :Observable<Page<Project>>

    allExpensesInExpiration(): Observable<Expense[]>
    
    allChildExpenses(id: number,page: number ,size: number, order: string, direction: string): Observable<Page<Expense>>

    allChildIncomes(id: number,page: number ,size: number, order: string, direction: string): Observable<Page<Income>> 

    childMonthlyStats(id: number, date: string | null): Observable<MonthlyStats> | null

    searchAccount(email: string): Observable<SimpleAccount>
    
    postShareProject(emails: string[], projectId: number): Observable<Project>

    removeAccountFromProject(projectId: number ,email: string): Observable<Project>
    
    deleteExpense(id: number):Observable<any>

    getProject(id: number): Observable<Project>
    
    patchShared(obj: PatchSharedRequest, projectId: number ,expenseId: number): Observable<Project>
    
    getFriends():Observable<Friend[]>

    patchAccount(body: PatchAccountRequest): Observable<any>

    deleteAccount(): Observable<any>

    deleteProject(id: number): Observable<any>

    patchProject(body: PostProjectRequest, id: number): Observable<Project>

    patchExpense(body: PostExpenseRequest, id: number): Observable<Expense>

    patchIncome(body: PostIncomeRequest, id: number): Observable<Income>

    deleteIncome(id: number): Observable<any>

    allChildProjects(id: number): Observable<Project[]>

    childProjectById(childId: number | null, projectId: number ): Observable<Project>

    patchChild(childId: number | null, body: PatchChildRequest): Observable<Account>

    deleteChild(childId: number | null): Observable<any>

    switchToParent(): Observable<AuthResponse>

    exportData(): Observable<Blob>

}
