export interface Traveler {
  username: string;
  pnrno: string;
  traveler_id: string;
  travelerfirstname: string;
  travelermiddlename: string;
  travelerlastname: string;
  traveleraddress: string;
  travelerzipcode: string;
  traveleremail: string;
  travelerphone: string;
  travelerseatpreference: string;
  travelerspecialservices: string;
  travelermealpreference: string;
  needpassport: boolean;
  passportno: string;
  passportexpiry: string;
  passportissuingcountry: string;
  passportcountryofcitizenship: string;
  passportcountryofresidence: string;
  emergencycontactfirstname: string;
  emergencycontactmiddlename: string;
  emergencycontactlastname: string;
  emergencycontactaddress: string;
  emergencycontactzipcode: number;
  emergencycontactemail: string;
  emergencycontactphone: string;
}
