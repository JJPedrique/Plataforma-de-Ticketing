# Plataforma de Ticketing

![Estado de CI](https://img.shields.io/badge/CI-no_configurado-lightgrey)
![Pruebas](https://img.shields.io/badge/tests-no_configurados-lightgrey)
![Cobertura](https://img.shields.io/badge/coverage-no_disponible-lightgrey)
![Licencia](https://img.shields.io/badge/license-no_especificada-lightgrey)

Plataforma web para gestionar eventos y sus recintos y para ofrecer un flujo de selección de asientos y compra de entradas. Reúne en un mismo proyecto una interfaz React y una API basada en FastAPI.

## Características principales

- Registro, inicio de sesión, recuperación de contraseña y gestión de perfil.
- Gestión de eventos y precios asociados a zonas.
- Organización de recintos, zonas y asientos.
- Flujo de compra con selección de evento, asiento y método de pago.
- Consulta del historial de entradas.
- Interfaz con rutas protegidas según autenticación y rol.

## Stack tecnológico

- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic.
- **Frontend:** React, Vite, React Router, Tailwind CSS, Konva y Axios.
- **Base de datos:** PostgreSQL mediante Psycopg.
- **DevOps y herramientas:** npm, entornos virtuales de Python y Oxlint.

## Requisitos previos e instalación

Necesitas Git, Node.js 20.19+ (o 22.12+), npm, Python 3.10+ y una instancia de PostgreSQL disponible. Docker no es necesario para la configuración actual del proyecto.

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/JJPedrique/Plataforma-de-Ticketing.git
cd Plataforma-de-Ticketing
npm install
npm run dev
```
## Diagrama de Base de Datos

<img src="Ticketing BDD.png">