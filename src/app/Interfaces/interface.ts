import { Timestamp } from "rxjs"
import { ProjectComponent } from '../Components/project/project.component';
import { StringOrNumberOrDate } from "@swimlane/ngx-charts";

export interface Interface {
}


export interface AuthResponse{
    jwt: string, 
    user: User
}

export interface User{
    id: number 
    name: string,
    surname: string,
    email: string, 
    birthdate: string,
    defaultCurrency: string,
    image: string, 
    children: User[] | null,
    parent: User | null
    role: Role
}
export interface Account{

    id: number 
    name: string,
    surname: string,
    email: string, 
    birthdate: string,
    defaultCurrency: string,
    image: string, 
    children: User[] | null,
    parent: User | null
    role: Role
}
export enum Role{
    PARENT,
    USER
}

export interface Menu{
    name: string,
    icon: string,
    value: any
}

export interface Expense{
    id: number,
    name: string,
    description: string, 
    amount: number,
    frequency: string, 
    createdAt: string, 
    date: string,
    image: string, 
    category: Category,
    participants: SimpleAccount[]
    projectId: number,
    accountId: number
}
export interface Category{
    id: number,
    name: string,
    description: string, 
    image: string
}

export interface Income{
    id: number, 
    name: string, 
    description: string, 
    amount: number ,
    image: string, 
    createdAt: string, 
    date: string,
    frequency: string
}

export interface Project{
    id: number,
    name: string, 
    description: string, 
    image: string,
    goalAmount: number,
    expenses: Expense[]
    createdAt: string, 
    creator: SimpleAccount,
    accounts: SimpleAccount[]
}

export interface SimpleAccount{
    id: number | null,
    name: string,
    surname: string, 
    email: string, 
    image: string,
    splitAmount: number
}

export interface PostExpenseRequest{
    name: string,
      amount: number,
      description: string,
      frequency: string,
      categoryId: number | null,
      projectId: number | null,
      image: string,
      date: string
}

export interface PostIncomeRequest{
    name: string, 
    description: string, 
    frequency: string, 
    amount: number, 
    date: string, 
    image: string
}

export interface PostProjectRequest{
    name: string,
    description: string, 
    image: string, 
    goalAmount: number
}

export interface PostChildRequest{
    name: string,
    surname: string, 
    email: string, 
    password: string, 
    birthdate: string, 
    image: string
}

export interface WeeklyStats{
    name: string,
    series: {name: string, value: number, extra: any}[]
}

export interface MonthlyStats{
    totalExpense: number,
    totalIncome: number
}

export interface TableList{
    headers: string[],
    values: any
}
export interface Page<T> {
    page: number;            
    size: number;            
    records: T[];            
    totalRecords: number;    
    totalPages: number;      
    filters?: { [key: string]: any }; 
    orderBy?: string;        
}

export interface Pagination{
    rows: number ,
    first: number ,
    totalRecords: number ,
    rowsPerPageOptions: number[]
}

export interface ShareRequest{
    projectId: number,
    emails: string[]
}

export interface PatchSharedRequest{
    shared: SimpleAccount[]
}

export interface LinearChart{
    name: string, 
    series: {
        name: string,
        value: any
    }[]

}

export interface Friend{
    name: string, 
    surname: string, 
    email: string,
    project: Project,
    addedAt: string
}

export interface PatchAccountRequest{
    name: string,
    surname: string,
    defaultCurrency: string
}

export interface PatchChildRequest{
    name: string,
    surname: string
}
