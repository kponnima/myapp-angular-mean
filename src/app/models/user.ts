export interface User {
    _id: number;
    username: string;
    password: string;
    email: string;
    phone: number;
    date_created: Date;
    role_id: number;
    privilege_id: number;
    status_id: number;
}