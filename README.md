# Forest Clash 🌲🔥

**Forest Clash** es un juego de cartas estratégico ambientado en un bosque. Los jugadores compiten para plantar árboles, usar cartas de acción y bloquear al oponente.  
El objetivo es llegar a **20 árboles** antes que tu rival.  

---

## 🎮 Características

- Tablero para jugador y bot con animaciones.
- Cartas con efectos especiales:
  - **Árbol:** Suma puntos a tu puntaje.
  - **Fogata:** Quita 1 carta del tablero enemigo.
  - **Incendio:** Quita 2 cartas del tablero enemigo.
  - **Leñador:** Elimina un árbol del enemigo.
  - **Político:** Bloquea al rival para plantar árboles.
  - **Contrato:** Elimina un Político que te bloquea.
- Panel de reglas y jugadas.
- Barra de progreso de árboles.
- Fondo animado en video y música de ambiente.
- Control de volumen y silenciar audio.

---

## 🛠 Tecnologías

- React
- CSS (animaciones y estilos)
- HTML5 `<video>` y `<audio>` para multimedia

---

## 📂 Estructura del proyecto
Forest-Clash/          # Raíz del proyecto
├── frontend/           # Carpeta del cliente (React)
│   ├── src/
│   │   ├── Game.jsx          # Componente principal del juego
│   │   ├── Cards/            # Componentes de cartas
│   │   ├── Videos/           # Fondos de video y audio
│   │   └── index.jsx
│   ├── public/
│   └── package.json
├── backend/            # Carpeta del servidor (Node.js, Express, etc.)
│   ├── controllers/        # Lógica de las rutas
│   ├── routes/             # Definición de endpoints
│   ├── models/             # Modelos de base de datos
│   ├── server.js           # Archivo principal del servidor
│   └── package.json
├── README.md           # Documentación del proyecto
└── .gitignore          # Archivos y carpetas ignoradas por git

