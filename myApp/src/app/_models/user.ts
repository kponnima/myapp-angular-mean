export interface User {
    _id:Number;
    userName: string;
    password: string;
    email:string;
    phone:Number;
    date_created:Date;
    role_id: Number;
    privilege_id:Number;
    status_id:Number
}