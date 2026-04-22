# Prompts y proceso — Temple Run (templeRun-VIC)

## Registro literal de prompts (chat completo)

Los mismos mensajes están copiados en la raíz del repositorio: **`../prompts.md`**.

### Prompt 1 — Brief inicial del juego

Actua como un experto desarrollador de videojuegos.

Analiza lo que hay en este proyecto, hay un ejemplo de como quedaria el videojuego de snake. Te paso las intrucciones:

Elige un concepto de juego: Puede ser cualquier tipo de juego que te interese desarrollar, desde un juego de plataformas hasta un puzzle o un juego de estrategia.(VAMOS A CREAR UN JUEGO TIPO TEMPLE RUN)

Crea los archivos necesarios: Dentro de la carpeta con el nombre de tu juego y tus iniciales (por ejemplo, `yourGameName-Initials`), añade todos los archivos necesarios para tu juego, incluyendo un HTML denominado index.html, CSS y JavaScript. Si tu juego requiere imágenes u otros recursos, asegúrate de incluirlos también.

Desarrolla el juego: Usa vanilla para el desarrollo del videojuego.
Asegúrate de que tu juego sea interactivo y funcione correctamente en los navegadores web.

Documenta tu proceso: En un archivo prompts.md dentro de la misma carpeta, incluye los prompts utilizados. Además, si quieres, describe el proceso de desarrollo de tu juego, incluyendo cualquier desafío que hayas enfrentado y cómo lo superaste.

Mecanica del juego temple run
investiga en interner la mecanida de este modelo de juego

Usa un fondo movil sencillo, solo se usaran 2 carriles, obstaculos intermitentes en cada uno de los 2 carriles.

el usuario tendrá dos botones, [mover izquierda] y [mover derecha] el personaje del usuario va a estar fijo pero con animacion de que esta moviendose hacia adelante, se reubicara sobre cada carril dependiento del boton que haya presionadel usuario.
Si el usuario choca con un objetivo saldrá un menu de reiniciar.
no es necesario manejar ningun tipo de puntaje.
Te adjunto screnshot de un ejemplo de otro videojuego.

### Prompt 2 — Escalonar obstáculos entre carriles

excelente, ahora, garantiza que los obstauclos en cada carril aparezca con cierta diferencia de posicion, esto para que el personaje pueda alcanzar a cambiar de carril.
Es decir, nunca en ambos carriles debe aparecer un objeto a la misma altura.

### Prompt 3 — Separación mínima 1.5× altura del personaje

*(Captura adjunta en el chat: dos obstáculos al mismo nivel en ambos carriles.)*

te ajdunto un ejemplo de lo que no debe suceder, dos obstaculos no deberian aparecer siempre al mismo nivel ya que el personaje se queda sin oportunitdad de esquievar cambiando de carril.
La distancia entre objetos de diferentes carriles debe ser almenos 1.5 veces la altura del personaje

### Prompt 4 — Registrar prompts en prompts.md

excelente, ahora, registra todos los prompts ingresados en este chat en el archivo prompts.md

---

## Prompts utilizados (resumen del encargo)

1. **Rol y contexto:** Actuar como experto desarrollador de videojuegos; analizar el proyecto con ejemplo Snake; elegir concepto **Temple Run** (corredor infinito).
2. **Estructura:** Carpeta `nombreJuego-Iniciales` con `index.html`, CSS, JS vanilla; recursos si hacen falta; `prompts.md` con prompts y proceso.
3. **Mecánica:** Investigar mecánica tipo Temple Run; fondo móvil sencillo; **2 carriles**; obstáculos **intermitentes** en cada carril; botones **mover izquierda** y **mover derecha**; personaje **fijo** con sensación de avance; cambio de carril según botón; **choque → menú reiniciar**; **sin puntaje**.
4. **Referencia visual:** Captura estilo Temple Run (atardecer, puente, perspectiva tercera persona).
5. **Iteración:** Obstáculos en ambos carriles nunca a la misma altura; separación entre carriles ≥ **1.5×** altura del personaje; registro de prompts en `prompts.md`.

## Mecánica de Temple Run (investigación breve)

- **Corredor infinito en tercera persona:** el personaje avanza solo; el jugador reacciona (giros, saltos, deslizamientos en el juego original).
- **En esta versión 2D:** se simula el avance moviendo el suelo y los obstáculos **hacia el jugador**; el avatar permanece en la parte inferior y solo **cambia de carril**.
- **Obstáculos intermitentes:** no es un muro continuo; aparecen grupos o carriles vacíos para permitir esquivar cambiando de lado.

## Proceso de desarrollo

1. **Escena:** Cielo en gradiente (atardecer), capas de nubes y montañas con animación lenta, pista con `perspective` y `rotateX` ligero para acercarse al screenshot de referencia.
2. **Fondo en movimiento:** Franjas en la pista (`repeating-linear-gradient` + `animation`) y línea central animada para reforzar la sensación de velocidad.
3. **Carriles:** Dos mitades del ancho; el jugador usa `data-lane` y `translateX(±25%)` para alinearlo al centro de cada mitad.
4. **Obstáculos:** Elementos posicionados en `%` desde arriba; en cada spawn se elige un patrón aleatorio (solo izquierda, solo derecha, ambos o ninguno) para mantenerlos **intermitentes** y jugables.
5. **Colisión:** `getBoundingClientRect()` del escenario y del cuerpo del jugador frente a cada obstáculo en el **mismo carril**, con un pequeño margen para evitar fallos por un píxel.
6. **Game over:** Overlay con mensaje y botón **Reiniciar**; teclado ←/→ (y A/D) como apoyo opcional en escritorio.

## Desafíos y cómo se abordaron

| Desafío | Solución |
|--------|----------|
| Perspectiva 2D vs 3D | Pista con CSS 3D suave + scroll vertical de texturas, sin motor 3D. |
| Colisión con transformaciones | Medir rectángulos en píxeles relativos al escenario y convertir a % para coherencia al redimensionar. |
| Dificultad | Velocidad base + multiplicador que crece lentamente hasta un tope; spawn con filas que a veces dejan carriles libres. |

## Archivos del juego

- `index.html` — Estructura, HUD, escenario, controles, overlay.
- `styles.css` — Estilos, animaciones de fondo, jugador y UI.
- `game.js` — Bucle `requestAnimationFrame`, spawns, carriles, colisión, reinicio.
