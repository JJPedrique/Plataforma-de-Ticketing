import { Armchair, Minus, Plus, SquareSquare } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { Layer, Stage, Circle, Text, Group, Rect } from "react-konva";

function Canvas({ Data = [], seats = [], onSeatChange }) {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(0.5);
    const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    const SEAT_SPACING = 35;
    const SEAT_RADIUS = 12;
    const PADDING = 30;
    const TITLE_HEIGHT = 45;
    const ZONE_GAP = 30;
    const ZONE_X = 50;

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
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    function getMaxWidth(zoneSeats) {
        if (!zoneSeats || zoneSeats.length === 0) return 0;
        return zoneSeats.reduce((max, s) => (s.coord_x > max ? s.coord_x : max), 0);
    }

    function getMaxHeight(zoneSeats) {
        if (!zoneSeats || zoneSeats.length === 0) return 0;
        return zoneSeats.reduce((max, s) => (s.coord_y > max ? s.coord_y : max), 0);
    }

    // Calculamos dimensiones y posición Y acumulada para cada zona
    const zonesWithLayout = useMemo(() => {
        let currentY = ZONE_GAP;

        return Data.map((zone) => {
            const width = getMaxWidth(zone.seats) * SEAT_SPACING + PADDING * 2 + SEAT_SPACING;
            const height = getMaxHeight(zone.seats) * SEAT_SPACING + PADDING * 2 + TITLE_HEIGHT + SEAT_SPACING;
            const y = currentY;

            // El siguiente bloque empezará exactamente después de esta zona + el gap uniforme
            currentY += height + ZONE_GAP;

            return {
                ...zone,
                layout: { width, height, y },
            };
        });
    }, [Data]);

    return (
        <div>
            <div className="flex gap-3 p-2 m-2 absolute bg-white rounded z-10">
                <button onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(1))))}>
                    <Plus className="size-3" />
                </button>
                <button onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(1))))}>
                    <Minus className="size-3" />
                </button>
                <button onClick={() => setZoom(0.5)}>
                    <SquareSquare className="size-3" />
                </button>
                <span className="font-mono text-sm">{Math.floor(zoom * 100)}%</span>
            </div>

            <div ref={containerRef} className="flex justify-center min-w-250px relative overflow-hidden">
                <Stage
                    x={stagePos.x}
                    y={stagePos.y}
                    width={dimensions.width}
                    height={dimensions.height}
                    scaleX={zoom}
                    scaleY={zoom}
                    className="bg-stone-200 rounded cursor-grab active:cursor-grabbing"
                    draggable
                    onDragEnd={(e) => {
                        if (e.target === e.target.getStage()) {
                            setStagePos({ x: e.target.x(), y: e.target.y() });
                        }
                    }}
                >
                    <Layer>
                        {zonesWithLayout.map((zone, index) => (
                            <Group key={zone.id ?? index} x={ZONE_X} y={zone.layout.y}>
                                <Rect
                                    x={0}
                                    y={0}
                                    fill="white"
                                    cornerRadius={16}
                                    stroke={zone.color_code}
                                    shadowColor="black"
                                    shadowBlur={10}
                                    shadowOpacity={0.05}
                                    shadowOffsetY={4}
                                    width={zone.layout.width}
                                    height={zone.layout.height}
                                />

                                <Text
                                    x={0}
                                    y={PADDING}
                                    text={zone.name}
                                    width={zone.layout.width}
                                    align="center"
                                    fontSize={24}
                                    fontStyle="bold"
                                    fontFamily="sans-serif"
                                    fill="#334155"
                                />

                                {zone.seats.map((seat) => {
                                    const isSelected = seats.some((mySeat) => mySeat.seat.id === seat.id);
                                    const fillColor = !seat.is_availble
                                        ? "oklch(44.6% 0.03 256.802)"
                                        : isSelected
                                        ? "oklch(70.5% 0.213 47.604)"
                                        : "oklch(72.3% 0.219 149.579)";

                                    return (
                                        <Circle
                                            key={seat.id}
                                            x={PADDING + seat.coord_x * SEAT_SPACING}
                                            y={PADDING + TITLE_HEIGHT + seat.coord_y * SEAT_SPACING}
                                            radius={SEAT_RADIUS}
                                            fill={fillColor}
                                            onClick={seat.is_availble ? () => onSeatChange(zone, seat) : undefined}
                                            onTap={seat.is_availble ? () => onSeatChange(zone, seat) : undefined}
                                            onMouseEnter={(e) => {
                                                const stage = e.target.getStage();
                                                stage.container().style.cursor = "pointer";
                                                const pos = stage.getPointerPosition();
                                                setTooltip({
                                                    show: true,
                                                    x: pos.x,
                                                    y: pos.y,
                                                    text: `${zone.name} - Fila : ${seat.row_label} - Asiento : ${seat.seat_number}`,
                                                });
                                            }}
                                            onMouseMove={(e) => {
                                                const stage = e.target.getStage();
                                                const pos = stage.getPointerPosition();
                                                setTooltip((prev) => ({ ...prev, x: pos.x, y: pos.y }));
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.getStage().container().style.cursor = "grab";
                                                setTooltip({ show: false, x: 0, y: 0, text: "" });
                                            }}
                                        />
                                    );
                                })}
                            </Group>
                        ))}
                    </Layer>
                </Stage>

                {tooltip.show && (
                    <div
                        className="absolute z-150 pointer-events-none bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap transition-none"
                        style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
                    >
                        {tooltip.text}
                    </div>
                )}
            </div>

            <div className="flex gap-3 p-2 m-2 bg-white rounded z-10 items-center flex-wrap">
                <h2 className="text-sm">Zonas Disponibles:</h2>
                {zonesWithLayout.map((z, index) => (
                    <button
                        key={z.id ?? index}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-orange-100 transition-colors text-sm"
                        onClick={() =>
                            setStagePos({
                                x: 100 - ZONE_X * zoom,
                                y: 60 - z.layout.y * zoom,
                            })
                        }
                    >
                        <Armchair className="size-4" />
                        {z.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Canvas;