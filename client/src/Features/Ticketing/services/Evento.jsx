import { BDD } from "../../../Data/Mock_v2";

export function GetEventAll(){
    return BDD.events.filter(event => event.isActive).map((event) => ({
    ...event, venue: BDD.venues.find((venue) => venue.id === event.venue_id)}));
}

export function GetEventByName(text){
    return BDD.events.filter(event => event.isActive && event.title.includes(text)).map((event) => ({
    ...event, venue: BDD.venues.find((venue) => venue.id === event.venue_id)}));
}

export function GetEventById(id){
    return BDD.events.filter(event => event.isActive && event.id == id).map((event) => ({
    ...event, venue: BDD.venues.find((venue) => venue.id === event.venue_id)}));
}