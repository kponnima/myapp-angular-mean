export interface Reservation {
  pnrno: string;
  total_amount: number;
  card_token: string,
  paymentstatus: string;
  segment_count: number;
  segment_id: number;
  flight_no: number;
  origin: string;
  destination: string;
  departuredatetime: string;
  arrivaldatetime: string;
  price: number;
  cabintype: string;
  seatno: string;
  passenger_count: number;
  traveler_id: string;
}

