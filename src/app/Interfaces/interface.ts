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
    birghdate: string,
    image: string, 
    children: User[] | null,
    parent: User | null
}