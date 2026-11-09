import { Minus, Plus, SquareSquare } from "lucide-react";
import { useEffect, useState, useRef, useContext } from "react";
import { Layer, Stage, Circle, Rect, Text, Group } from "react-konva";
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
    const padding = 48;
    const radius = 16;

    return ( <>
        <div>
            <div className="flex gap-3 p-2 m-2 absolute bg-white rounded z-100">
                <button onClick={() => zoom <= 1.5 ? setZoom(zoom + 0.1) : 1.5}><Plus className="size-3"/></button>
                <button onClick={() => zoom >= 0.6 ? setZoom(zoom - 0.1) : 0.6}><Minus className="size-3"/></button>
                <button onClick={() => setZoom(1)}><SquareSquare className="size-3"/></button>
                <span className="font-mono text-sm">{Math.floor(zoom * 100)}%</span>
            </div>

            <div ref={containerRef} className="flex justify-center min-w-250">
            <Stage width={dimensions.width} height={dimensions.height} scaleX={zoom/2} scaleY={zoom/2} className="bg-stone-200 rounded" draggable>
                <Layer>
                    <Group>
                        <Rect x={-padding*1.15} y={-padding*2}
                        width={25*padding*1.05} height={10*padding*1.2}
                        fill="white" cornerRadius={16} />

                        <Text x={0} y={-padding*1.65} width={25*padding}
                        text="Zone 1"
                        align="center" fontSize={padding}
                        fontFamily="Arial" fill="black"/>
                        
                        {items.map(i =>
                            <Circle key={i.id}
                            fill={`${i.status=="Seleccionado" ? ("oklch(70.5% 0.213 47.604)"): 
                                    i.status=="Ocupado" ? ("oklch(70.7% 0.022 261.325)"): 
                                    ("oklch(72.3% 0.219 149.579)")}`}  
                            x={i.x*padding} y={i.y*padding} radius={radius}
                            style={{ cursor: i.status === 'Ocupado' ? 'not-allowed' : 'pointer' }}
                            onClick={() => onSeatChange(i)} onTap={() => onSeatChange(i)}/>)}
                    </Group>
                </Layer>
            </Stage>
            </div>
        </div>
    </> );
}
export default Canvas;

