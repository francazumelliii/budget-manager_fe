import { Timestamp } from "rxjs"

export interface Interface {
}


export interface AuthResponse{
    jwt: string, 
    user: User
}

export interface User{
    name: string,
    surname: string,
    email: string, 
    birthdate: string,
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
    projectId: number
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
    date: string
}

export interface Project{
    id: number,
    name: string, 
    description: string, 
    image: string,
    goalAmount: string,
    expenses: Expense[]
    createdAt: string, 
    creator: SimpleAccount,
    accounts: SimpleAccount[]
}

export interface SimpleAccount{
    name: string,
    surname: string, 
    email: string, 
    image: string
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