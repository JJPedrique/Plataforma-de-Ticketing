import { createContext, useMemo, useState } from 'react';

export const TicketingContext = createContext();

const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const TicketingProvider = ({ children }) => {
    const [order,setOrder] = useState(null);
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [pay, setPay] = useState(null);

    const totalAmount = useMemo(() => {
        const subtotal = round2(seats.reduce((acc, a) => acc + toNumber(a.price), 0));
        const comision = round2(subtotal * 0.01);
        const total = round2(subtotal + comision);
        return { subtotal, comision, total };
    }, [seats]);

    return (
        <TicketingContext.Provider
            value={{ order, event, seats, pay, totalAmount, setEvent, setSeats, setPay, setOrder }}>
            {children}
        </TicketingContext.Provider>
    );
};