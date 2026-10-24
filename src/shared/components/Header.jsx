import { TicketCheck } from "lucide-react";

function Header() {
    return (
    <nav className="fixed border-b-2 border-b-amber-500 w-full">
        <div className="flex gap-1 place-items-center m-2 ">
            <TicketCheck className="size-12 text-white bg-amber-500 p-2 rounded-full"/> <h1 className="text-2xl font-black">TIKETEKA</h1>
        </div> 
    </nav>
    );
}

export default Header;