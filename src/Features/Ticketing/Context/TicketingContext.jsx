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

    function onSeatChange(seat){
        if(seat.status==="Ocupado"){return;}
        if(seat.status==="Disponible"){seat.status="Seleccionado";            
            setSeats(prev => [...prev,seat]);
        }else{seat.status="Disponible";
            setSeats(prev => prev.filter(s => s.id !== seat.id));
        }
        window.scrollTo({top: 0,behavior: "smooth"});
    }
    
    const onPayChange = (pay) =>{

    }

    return (
        <TicketingContext.Provider value={{ event, seats, pay, onEventChange, onSeatChange, onPayChange }}>
            {children}
        </TicketingContext.Provider>
    );
};