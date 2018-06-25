export interface Flight {
    flight_no: Number;
    origin: string;
    destination: string;
    departuredatetime: string;
    arrivaldatetime: string;
    aircraft_id: Number;
    carrier: string;
    duration: Number;
    miles: Number;
    inventory_id: Number;
    equipment_id: Number;
    cabintype:String;
    aircraftcapacity:Number;
    legseatsavailable:Number;
    baseseatssold:Number
  }