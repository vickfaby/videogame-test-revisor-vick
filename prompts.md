# Registro de prompts — chat (Temple Run / videogame-test-revisor-vick)

Este archivo recopila **literalmente** los mensajes de encargo y seguimiento enviados en el chat, en orden.

---

## Prompt 1 — Brief inicial del juego

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

---

## Prompt 2 — Escalonar obstáculos entre carriles

excelente, ahora, garantiza que los obstauclos en cada carril aparezca con cierta diferencia de posicion, esto para que el personaje pueda alcanzar a cambiar de carril.
Es decir, nunca en ambos carriles debe aparecer un objeto a la misma altura.

---

## Prompt 3 — Separación mínima 1.5× altura del personaje

*(Mensaje acompañado de captura de pantalla: ejemplo de dos obstáculos al mismo nivel en ambos carriles — caso a evitar.)*

te ajdunto un ejemplo de lo que no debe suceder, dos obstaculos no deberian aparecer siempre al mismo nivel ya que el personaje se queda sin oportunitdad de esquievar cambiando de carril.
La distancia entre objetos de diferentes carriles debe ser almenos 1.5 veces la altura del personaje

---

## Prompt 4 — Registrar prompts en prompts.md

excelente, ahora, registra todos los prompts ingresados en este chat en el archivo prompts.md

---

## Nota

La implementación del juego vive en la carpeta **`templeRun-VIC/`**, donde también hay un `prompts.md` con resumen del encargo, proceso de desarrollo y desafíos.
