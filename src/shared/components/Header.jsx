import { TicketCheck } from "lucide-react";

function Header() {
    return (
    <nav className="sticky border-b-2 border-b-amber-500 w-full">
        <div className="flex gap-2 place-items-center m-2 flex-1">
            <TicketCheck className="size-12 text-white bg-amber-500 p-2 rounded-full"/> <h1 className="text-2xl font-black">TIKETEKA</h1>
        </div> 
    </nav>
    );
}

export default Header;