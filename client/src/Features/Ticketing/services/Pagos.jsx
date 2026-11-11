import { BDD } from "../../../Data/Mock_v2";

export function GetPagosAll(){
    return BDD.payMethods.filter(pay => pay.is_Active);
}
