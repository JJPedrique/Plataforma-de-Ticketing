import { createContext, useMemo, useState } from 'react';

export const TicketingContext = createContext();

export const TicketingProvider = ({ children }) => {
    const [order,setOrder] = useState(null);
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [pay, setPay] = useState(null);

    function onEventChange(newEvent) {
        setEvent((prev) => (prev === newEvent ? null : newEvent));
        setSeats([]);
    }

    function onSeatChange(zone, seat) {
        setSeats((prev) => {
            const exists = prev.some((s) => s.seat.id === seat.id);
            if (exists) {
                return prev.filter((s) => s.seat.id !== seat.id);
            }
            return [...prev, { zone: zone.name, price: zone.price, seat }];
        });
    }

    const totalAmount = useMemo(() => {
        const subtotal = seats.reduce((acc, a) => acc + a.price, 0);
        const comision = subtotal * 0.01;
        const total = subtotal + comision;
        return { subtotal, comision, total };
    }, [seats]);

    return (
        <TicketingContext.Provider
            value={{ order, event, seats, pay, totalAmount, onEventChange, onSeatChange, setPay, setOrder }}>
            {children}
        </TicketingContext.Provider>
    );
};