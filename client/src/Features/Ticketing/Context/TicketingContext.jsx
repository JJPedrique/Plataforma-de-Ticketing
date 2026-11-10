import { createContext, useState } from 'react';

export const TicketingContext = createContext();

export const TicketingProvider = ({ children }) => {
    
    const [event,setEvent] = useState(null);
    const [seats,setSeats] = useState([]);
    const [pay, setPay] = useState(null);

    function onEventChange(event){
        setEvent((prev) => (prev === event ? null : event));
        setSeats([]);
        window.scrollTo({top: 0,behavior: "smooth"});
    }

    function onSeatChange(zone, seat) {
        if (!seats.some(s => s.seat.id === seat.id)) {setSeats(prev => [...prev, { zone: zone.name, seat: seat }]);
        } else {setSeats(prev => prev.filter(s => s.seat.id !== seat.id));}
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    const onPayChange = (pay) =>{

    }

    return (
        <TicketingContext.Provider value={{ event, seats, pay, onEventChange, onSeatChange, onPayChange }}>
            {children}
        </TicketingContext.Provider>
    );
};