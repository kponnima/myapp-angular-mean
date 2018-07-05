export interface Payment {
    token: string;
    card_id: string;
    order_id: string;
    customer_id: string;
    last4: string;
    brand: string;
    description: string;
    paid_status: boolean;
    currency:string;
    amount: number;
    statement_description: string;
    status: string;
}