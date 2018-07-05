export interface Flight {
    flight_no: number;
    origin: string;
    destination: string;
    departuredatetime: string;
    arrivaldatetime: string;
    aircraft_id: number;
    carrier: string;
    price: number;
    duration: number;
    miles: number;
    inventory_id: number;
    equipment_id: number;
    cabintype:String;
    aircraftcapacity:number;
    legseatsavailable:number;
    baseseatssold:number;
  }