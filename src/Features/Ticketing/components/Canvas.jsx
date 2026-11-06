import { Minus, Plus, SquareSquare } from "lucide-react";
import { useEffect, useState, useRef, useContext } from "react";
import { Layer, Stage, Circle } from "react-konva";
import { TicketingContext } from "../Context/TicketingContext";

function generateItems(width,height) {
    const items = [];

    let AUTO_INCREMENT = 1
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            items.push({id:AUTO_INCREMENT, section: "pobres", x: j, y: i, status:'Disponible'});
            AUTO_INCREMENT++;
        }
    }
    return items;
}

function Canvas({onClick}) {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(0.5);
    const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
    useEffect(() => {
        const updateDimensions = () => {
        if (containerRef.current) {
            setDimensions({width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight || 400, });}
        };

        updateDimensions();
        const resizeObserver = new ResizeObserver(() => updateDimensions());
        if (containerRef.current) {resizeObserver.observe(containerRef.current);}
        return () => resizeObserver.disconnect();
    },[]);

    const [items,setItems] = useState(generateItems(25,10));
    const {onSeatChange} = useContext(TicketingContext);

    return ( <>
        <div className="overflow-x-auto bord">
            <div className="flex gap-3 p-2 m-2 absolute bg-amber-50 rounded z-100">
                <button onClick={() => zoom <= 1.5 ? setZoom(zoom + 0.1) : 1.5}><Plus className="size-3"/></button>
                <button onClick={() => zoom >= 0.6 ? setZoom(zoom - 0.1) : 0.5}><Minus className="size-3"/></button>
                <button onClick={() => setZoom(0.5)}><SquareSquare className="size-3"/></button>
                <span className="font-mono text-sm">{Math.floor(zoom * 100)}%</span>
            </div>

            <div ref={containerRef} className="flex justify-center min-w-250">
            <Stage width={dimensions.width} height={dimensions.height} scaleX={zoom} scaleY={zoom} className="bg-stone-200 rounded" draggable>
                <Layer>
                    {items.map(i =>
                        <Circle key={i.id}
                        fill={`${i.status=="Seleccionado" ? ("oklch(70.5% 0.213 47.604)"): 
                                i.status=="Ocupado" ? ("oklch(70.7% 0.022 261.325)"): 
                                ("oklch(72.3% 0.219 149.579)")}`}  
                        x={i.x*48} y={i.y*48} radius={15}
                        style={{ cursor: i.status === 'Ocupado' ? 'not-allowed' : 'pointer' }}
                        onClick={() => onSeatChange(i)} onTap={() => onSeatChange(i)}/>)}
                </Layer>
            </Stage>
            </div>
        </div>
    </> );
}
export default Canvas;

