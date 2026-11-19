import { createContext, useMemo, useState } from 'react';

export const TicketingContext = createContext();

export const TicketingProvider = ({ children }) => {
    const [order,setOrder] = useState(null);
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [pay, setPay] = useState(null);

    const totalAmount = useMemo(() => {
        const subtotal = seats.reduce((acc, a) => acc + a.price, 0);
        const comision = subtotal * 0.01;
        const total = subtotal + comision;
        return { subtotal, comision, total };
    }, [seats]);

    return (
        <TicketingContext.Provider
            value={{ order, event, seats, pay, totalAmount, setEvent, setSeats, setPay, setOrder }}>
            {children}
        </TicketingContext.Provider>
    );
};