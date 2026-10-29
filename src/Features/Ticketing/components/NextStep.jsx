import { MoveLeft, MoveRight } from "lucide-react";

function NextStep({LoR,Text,onClick,isDisabled=false}) {
    return ( <>
        <button disabled={isDisabled} className="flex gap-2" type="button" onClick={onClick}>
            {LoR ? (
            <>
                <MoveLeft className={`${isDisabled ? ("text-stone-500"):("text-orange-500 font-bold")}`}/>
                <span className={`${isDisabled ? ("text-stone-500"):("text-orange-500 font-bold")}`}>{Text}</span>
            </>
            ) : (
            <>
                <span className={`${isDisabled ? ("text-stone-500"):("text-orange-500 font-bold")}`}>{Text}</span>
                <MoveRight className={`${isDisabled ? ("text-stone-500"):("text-orange-500 font-bold")}`}/>
            </>)}
        </button>
    </> );
}

export default NextStep;