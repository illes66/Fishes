# AI-Creative-Producer-PI
Easy playable in html5 for job candidacy

## Playable rápido (cozy, pocos segundos)
- Abre `index.html` en navegador.
- Controles: el anzuelo cuelga de la caña, no se mueve directamente.
  - Caña (D-pad derecho, o flechas/WASD): `↑`/`W` sube la caña (0° → 30°, o 60° → 30°),
    `←`/`A` la inclina más hacia atrás (30° → 60°), `→`/`D` la vuelve al reposo (30° → 0°).
  - Reel (pad izquierdo redondo): arrastra hacia arriba-izquierda, o pulsa `Z` + `Espacio`
    juntos, para recoger hilo.
- Objetivo corto: pescar 5 peces para ver el mensaje de clear.

## Dónde cambiar imágenes y animaciones
Todo está señalado dentro de `index.html`:
- `ASSET_PATHS`: rutas a PNG (`rod`, `hook`, `plants`, `fishes[]`).
- `GAME_CONFIG`: velocidad/cantidad de peces y duración de destellos.
- `GAME_CONFIG.rod`: pivote, ángulos (0°/30°/60°) y duración del tween de la caña.
- `GAME_CONFIG.fishingLine`: longitud máx/mín del hilo y velocidad de recogida (`reelInSpeed`).
- Giro de peces al dar la vuelta: en `drawFish()` con `ctx.scale(facingRight ? 1 : -1, 1)`.
- Destellos + texto de captura: en `spawnSparkles()` y bloque `state.message`.

Si una imagen no existe aún, el juego usa dibujos fallback para que siga funcionando.
