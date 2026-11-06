import { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    
    const [event,setEvent] = useState(null);
    const [seats,setSeats] = useState([]);
    const [pay, setPay] = useState(null);

    const onEventChange = (event) => {
        
    }

    const onSeatChange = (seat) =>{

    }

    const onPayChange = (pay) =>{

    }

    return (
        <ThemeContext.Provider value={{ event, seats, pay, onEventChange, onSeatChange, onPayChange }}>
            {children}
        </ThemeContext.Provider>
    );
};