export interface Flight {
  flight_no: number;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  aircraft_no: number;
  price: number;
  duration: number;
  distance: number;
  cancelStatus: boolean;
  departureGate: string;
  arrivalGate: string;
  inventory_no: number;
  mealService: [string];
  webCheckinTime: string;
}