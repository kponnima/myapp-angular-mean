export interface Charge {
    id: string;
    object: string;
    amount: number;
    amount_refunded: number;
    application: string;
    application_fee: string;
    balance_transaction: string;
    captured: boolean;
    created: Date;
    currency: string;
    customer: string;
    description: string;
    destination: string;
    dispute: string;
    failure_code: string;
    failure_message: string;
    fraud_details: {};
    invoice: string;
    livemode: boolean;
    metadata: Metadata[];
    on_behalf_of: string;
    order: string;
    outcome: Outcome[];
    paid: boolean;
    receipt_email: string;
    receipt_number: string;
    refunded: boolean;
    refunds: Refunds[];
    review: string;
    shipping: string;
    source: Source[];
    source_transfer: string;
    statement_descriptor: string;
    status: string;
    transfer_group: string;
}
export interface Metadata {
    order_id: string;
}
export interface Outcome {
    network_status: string;
    reason: string;
    risk_level: string;
    seller_message: string;
    type: string;
}
export interface Refunds {
    object: string;
    data: {};
    has_more: boolean;
    total_count: number;
    url: string;
}
export interface Source {
    id: string;
    object: string;
    address_city: string;
    address_country: string;
    address_line1: string;
    address_line1_check: string;
    address_line2: string;
    address_state: string;
    address_zip: string;
    address_zip_check: string;
    brand: string;
    country: string;
    customer: string;
    cvc_check: string;
    dynamic_last4: string;
    exp_month: number;
    exp_year: number,
    fingerprint: string;
    funding: string;
    last4: string;
    metadata: {},
    name: string;
    tokenization_method: string;
}