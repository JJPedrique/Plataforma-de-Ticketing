import React, { useState } from 'react';
import { Stage, Layer, Circle, Text, Group, Rect } from 'react-konva';
import { Info, Download } from 'lucide-react';

function getColor(status) {
  if (status === 'seleccionado') {
    return '#f97316';
  } else if (status === 'ocupado') {
    return '#9ca3af';
  } else if (status === 'normal') {
    return '#22c55e';
  }
  return '#22c55e';
}

function generateItems() {
  const items = [];
  let j = 30;
  let g = 1;
  let t = 20;
  let fila = 1;

  for (let i = 0; i < 250; i++) {
    if (i === t) {
      j = j + 30;
      g = 1;
      t = t + 20;
      fila++;
    }
    items.push({
      x: g * 30,
      y: j,
      id: 'Silla' + i + 'fila' + fila,
      status: i % 12 === 0 ? 'ocupado' : 'normal',
      row: fila,
      seat: g,
    });
    g++;
  }
  return items;
}

const ExampleKonvas = () => {
  const stageRef = React.useRef(null);
  const [items, setItems] = useState(generateItems());
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  

  const handleSeatClick = (clickedItem) => {
    if (clickedItem.status === 'ocupado') {
      return;
    }
    setItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.id === clickedItem.id) {
          if (item.status === 'seleccionado') {
            return { ...item, status: 'normal' };
          }
          if (item.status === 'normal') {
            return { ...item, status: 'seleccionado' };
          }
        }
        return item;
      });
      const count = updated.filter((item) => item.status === 'seleccionado').length;
      setSelectedCount(count);
      return updated;
    });
  };

  const downloadImage = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'asientos-seleccionados.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const changeZoom = (factor) => {
    setZoom((currentZoom) =>
      Math.min(3, Math.max(0.5, currentZoom * factor))
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-gray-900">Mapa de asientos</h3>
          <p className="text-sm text-gray-600">Selecciona tus asientos haciendo clic sobre ellos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">Seleccionado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="text-gray-600">Ocupado</span>
            </div>
          </div>
          <button
            onClick={downloadImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Guardar</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="mb-6 text-center">
          <div className="inline-block px-20 py-2 bg-linear-to-r from-gray-700 to-gray-800 text-white text-sm font-medium rounded-t-3xl">
            ESCENARIO
          </div>
          <div className="h-1 bg-linear-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex justify-center min-w-250">
              <div style={{ marginBottom: 8 }}>
        <button onClick={() => changeZoom(1.2)}>+</button>
        <button onClick={() => changeZoom(1 / 1.2)}>-</button>
        <button onClick={() => setZoom(1)}>Reset</button>
        <span style={{ marginLeft: 8 }}>{Math.round(zoom * 100)}%</span>
      </div>
            <Stage width={1000} height={500} ref={stageRef} scaleX={zoom} scaleY={zoom} draggable
        onDragEnd={(event) =>
          setPosition({ x: event.target.x(), y: event.target.y() })
        }
            >
              <Layer>
                {/* <Text text="" fontSize={15} /> */}
                {items.map((item) => (
                  <Circle
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    radius={10}
                    fill={getColor(item.status)}
                    stroke={item.status === 'seleccionado' ? '#ea580c' : item.status === 'ocupado' ? '#6b7280' : '#16a34a'}
                    strokeWidth={item.status === 'seleccionado' ? 2 : 1}
                    opacity={item.status === 'ocupado' ? 0.5 : 1}
                    onClick={() => handleSeatClick(item)}
                    onMouseEnter={() => setHoveredSeat(item)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    style={{ cursor: item.status === 'ocupado' ? 'not-allowed' : 'pointer' }}
                  />
                ))}
                {/* <Text text="" fontSize={15} x={450} y={450} /> */}

                {hoveredSeat && hoveredSeat.status !== 'ocupado' && (
                  <Group x={650} y={0} listening={false}>
                    <Rect width={150} height={34} fill="rgba(17, 24, 39, 0.95)" cornerRadius={6} />
                    <Text
                      x={8}
                      y={9}
                      text={`Fila ${hoveredSeat.row} - Asiento ${hoveredSeat.seat}`}
                      fill="white"
                      fontSize={13}
                    />
                  </Group>
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="h-4 w-4" />
          <span>Haz clic en un asiento para seleccionarlo o deseleccionarlo</span>
        </div>
        
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
            <span>{selectedCount} {selectedCount === 1 ? 'asiento seleccionado' : 'asientos seleccionados'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleKonvas;
