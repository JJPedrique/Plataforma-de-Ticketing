import { Minus, Plus, SquareSquare } from "lucide-react";
import { useEffect, useState, useRef, useContext } from "react";
import { Layer, Stage, Circle, Text, Group, Rect } from "react-konva";
import { TicketingContext } from "../Context/TicketingContext";

function Canvas({ Data }) {
    const {seats,onSeatChange} = useContext(TicketingContext);
    
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(0.5);
    const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth, 
                    height: containerRef.current.offsetHeight || 400, 
                });
            }
        };

        updateDimensions();
        const resizeObserver = new ResizeObserver(() => updateDimensions());
        if (containerRef.current) { resizeObserver.observe(containerRef.current); }
        return () => resizeObserver.disconnect();
    }, []);

    function getMaxWidth(seats) {
        if (!seats || seats.length === 0) return 0; 
        return seats.reduce((max, s) => (s.coord_x > max ? s.coord_x : max), 0);
    }

    function getMaxHeight(seats) {
        if (!seats || seats.length === 0) return 0;
        return seats.reduce((max, s) => (s.coord_y > max ? s.coord_y : max), 0);
    }

    const SEAT_SPACING = 35;
    const SEAT_RADIUS = 12;  
    const PADDING = 30;      
    const TITLE_HEIGHT = 45; 
    const ZONE_GAP = 40;     

    return (
        <div>
            <div className="flex gap-3 p-2 m-2 absolute bg-white rounded z-100">
                <button onClick={() => zoom <= 1.5 ? setZoom(zoom + 0.1) : 1.5}><Plus className="size-3"/></button>
                <button onClick={() => zoom >= 0.6 ? setZoom(zoom - 0.1) : 0.6}><Minus className="size-3"/></button>
                <button onClick={() => setZoom(0.5)}><SquareSquare className="size-3"/></button>
                <span className="font-mono text-sm">{Math.floor(zoom * 100)}%</span>
            </div>

            <div ref={containerRef} className="flex justify-center min-w-250px relative overflow-hidden">
                
                <Stage width={dimensions.width} height={dimensions.height} scaleX={zoom} scaleY={zoom} className="bg-stone-200 rounded cursor-grab active:cursor-grabbing" draggable>
                    <Layer>
                        {Data.zones.map((zone, index) => (
                            <Group key={index} x={50} y={index * (getMaxHeight(zone.seats) * SEAT_SPACING + (PADDING * 2) + TITLE_HEIGHT + SEAT_SPACING + ZONE_GAP)}>
                                <Rect x={0} y={0} fill="white" cornerRadius={16}
                                    shadowColor="black" shadowBlur={10} shadowOpacity={0.05} shadowOffsetY={4}
                                    width={getMaxWidth(zone.seats) * SEAT_SPACING + (PADDING * 2) + SEAT_SPACING} 
                                    height={getMaxHeight(zone.seats) * SEAT_SPACING + (PADDING * 2) + TITLE_HEIGHT + SEAT_SPACING}
                                />
                                
                                <Text x={0} y={PADDING} text={zone.name} 
                                    width={getMaxWidth(zone.seats) * SEAT_SPACING + (PADDING * 2) + SEAT_SPACING}
                                    align="center"  fontSize={24}fontStyle="bold" fontFamily="sans-serif" fill="#334155"
                                />

                                {zone.seats.map(seat => (
                                    <Circle key={seat.id}
                                        x={PADDING + (seat.coord_x * SEAT_SPACING)} 
                                        y={PADDING + TITLE_HEIGHT + (seat.coord_y * SEAT_SPACING)} 
                                        radius={SEAT_RADIUS}
                                        fill={seats.some(mySeat => mySeat.seat.id === seat.id)? "oklch(70.5% 0.213 47.604)":"oklch(72.3% 0.219 149.579)"} 
                                        onClick={() => onSeatChange(zone,seat)} 
                                        onTap={() => onSeatChange(zone,seat)}
                                        
                                        onMouseEnter={(e) => {
                                            const stage = e.target.getStage();
                                            stage.container().style.cursor = 'pointer';
                                            const pos = stage.getPointerPosition();
                                            setTooltip({ show: true, x: pos.x, y: pos.y, text: zone.name + " - Fila : " + seat.row_label + " - Asiento : " + seat.seat_number });
                                        }}
                                        onMouseMove={(e) => {
                                            const stage = e.target.getStage();
                                            const pos = stage.getPointerPosition();
                                            setTooltip(prev => ({ ...prev, x: pos.x, y: pos.y }));
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.getStage().container().style.cursor = 'grab';
                                            setTooltip({ show: false, x: 0, y: 0, text: "" });
                                        }}
                                    />
                                ))}
                            </Group>                        
                        ))}
                    </Layer>
                </Stage>
                {tooltip.show && (
                <div className="absolute z-150 pointer-events-none bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap transition-none"
                    style={{top: tooltip.y + 15, left: tooltip.x + 15,}}>
                        {tooltip.text}
                </div>)}
            </div>
        </div>
    );
}

export default Canvas;