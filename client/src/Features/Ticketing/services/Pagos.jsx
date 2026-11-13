import { BDD } from "../../../Data/Mock_v2";

export function GetPagosAll(){
    return BDD.payMethods.filter(pay => pay.is_Active);
}

export function AddOrder(Data){
    const NEXT_ID = BDD.orders.length;
    BDD.orders.push({...Data,id:NEXT_ID});
    return NEXT_ID;
}

export function UpdateOrden(id, nuevoStatus) {
    const orden = BDD.orders.find(item => item.id === id);
    orden.status = nuevoStatus;
}

export function AddTikets(Data){
    const NEXT_ID = BDD.tickets.length;
    BDD.tickets.push({...Data,id:NEXT_ID});
}