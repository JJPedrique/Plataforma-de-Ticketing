import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group  } from 'react-konva';

function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getColor(isBooked) {
  if (isBooked==='selecionado') {
    return "red";
  } else if (isBooked==='ocupado') {
    return "lightgrey";
  } else if (isBooked==='normal') {
    return "#1b728d";
  }
}




function generateItems() {
  {/* generador de salas crea los asientos y sus propiedades como coordenadas xy su id y estatus(normal,seleccionado por el usario y ocupado)*/}
  const items = [];
  let j=30
  let g=1
  let t=20
  {/* generador de salas crea los asientos y sus propiedades como coordenadas xy su id y estatus(normal,seleccionado por el usrio y ocupado)*/}
  let fila=1
 

  for (let i = 0; i < 250; i++) {
    if(i===t){
      j=j+30;
      g=1;
      t=t+20;
      fila++
    }
    {/* toda la info de las sillas se guarda en items esto lo digo con el fin de guardar los procesos a hacer y para la bdd */}
    items.push({
      x: g*30,
      y: j,
      id: 'Silla'+ i+"fila"+fila,
      color: '#1b728d',/*la logica de los colores van en getcolor()*/ 
      status:'normal',/* normal,selecionado(por el usuario),ocupado*/
    });
    g++
  }
  return items;
}



const ExampleKonvas = () => {
  const stageRef = React.useRef(null);

  const [items, setItems] = React.useState(generateItems());
  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    console.log(uri);
    // we also can save uri as file
    downloadURI(uri, 'stage.png');
  };

  const [color, setColor] = React.useState('green');
  const rectRef = React.useRef();

  React.useEffect(() => {
    if (rectRef.current) {
      rectRef.current.cache();
    }
  }, []);

  const handleClick = (ccds) => {
    setColor(ccds);

    rectRef.current.cache();
  };

  const handlover = (mids) => {
    idsilla(mids)

    rectRef.current.cache();
  };
  const [hovered, setHovered] = useState(false);
  const[silla,idsilla]=React.useState('Sillas');
  

  return (
    <>
    <button onClick={handleExport}>Click aqui para guardar en img las posiciones selecionadas </button>
    {/*escenario tipo generico*/}
 
    <Stage width={1000} height={500}  ref={stageRef}>
      <Layer>
        <Text text="Domodin de Dimsdale" fontSize={15} />
         {items.map((item) => (
          
          
          <Circle
            key={item.id}
            name={item.id}
       
            x={item.x}
            y={item.y}
            fill={getColor(item.status)}
            radius={10}
            status={item.status}
            onClick={e => {
        if (item.status==='ocupado') {
          return;
        }
        if (item.status==='selecionado') {
          item.status='normal';
          handleClick(item.status)
        } else {
          item.status='selecionado';
          handleClick(item.status)
        }
      }}
          onMouseEnter={() =>{ setHovered(true)
            handlover(item.id)


          }}
          onMouseLeave={() => setHovered(false)}
          />
        )
        )}
      <Text text="Escenario" fontSize={15} x={300}
          y={450}/>
          
          {hovered && (
          <Group x={650} y={0} listening={false}>
            <Rect width={150} height={34} fill="black" cornerRadius={6} />
            <Text
              x={8}
              y={9}
              text={silla}
              fill="white"
              fontSize={14}
            />
          </Group>
        )}

        
      </Layer>
    </Stage>
  </>
  );
};

export default ExampleKonvas;
