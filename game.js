// ============================================================
// MINI FISHING PLAYABLE
// ============================================================
//
// Arquitectura:
//
// ASSETS
// FISH_TYPES
// GAME_CONFIG
// STATE
// CREATE FISH
// INPUT
// FISH AI
// FISHING
// ANIMATION
// RENDER
// GAME LOOP
//
// ============================================================



// ============================================================
// CANVAS
// ============================================================

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");



// ============================================================
// ASSETS
// ============================================================
//
// Aquí añadiremos posteriormente:
// PNG
// Sprite Sheets
// SVG
//
// No necesitamos cambiar la lógica del juego para añadir
// nuevos tipos de assets.
// ============================================================

const ASSETS = {

    // --------------------------------------------------------
    // FISH 1
    // --------------------------------------------------------

    fish1: {

        normal: "fish1.png",

        blink: "fish1_blink.png"

    },


    // --------------------------------------------------------
    // FISH 2
    // --------------------------------------------------------

    fish2: {

        normal: "fish2.png",

        blink: "fish2_blink.png"

    },


    // --------------------------------------------------------
    // FISH 3
    // --------------------------------------------------------

    fish3: {

        sheet: "fish3-sheet.png"

    },


    // --------------------------------------------------------
    // FISH 4
    // --------------------------------------------------------

    fish4: {

        sheet: "fish4-sheet.png"

    },


    // --------------------------------------------------------
    // FISH 5
    // --------------------------------------------------------

    fish5: {

        sheet: "fish5-sheet.png"

    },


    // --------------------------------------------------------
    // FUTURE SVG FISH
    // --------------------------------------------------------
    //
    // Ejemplo:
    //
    // fish6: {
    //
    //     svg: "fish6.svg"
    //
    // }
    //
    // --------------------------------------------------------

};



// ============================================================
// FISH TYPES
// ============================================================
//
// AQUÍ es donde controlaremos cómo se comporta cada pez.
//
// Para cambiar un pez NO tendrás que buscar su comportamiento
// por todo el código.
//
// Solo modificas sus atributos aquí.
// ============================================================

const FISH_TYPES = {

    // ========================================================
    // FISH 1
    // ========================================================

    fish1: {

        id: "fish1",

        asset: "png",

        normalSpeed: 50,

        maxSpeed: 90,

        escapeSpeed: 80,

        escapeRadius: 100,

        resistance: 20,

        pullDifficulty: 1.0,

        spriteWidth: 120,

        spriteHeight: 120

    },


    // ========================================================
    // FISH 2
    // ========================================================

    fish2: {

        id: "fish2",

        asset: "png",

        normalSpeed: 60,

        maxSpeed: 100,

        escapeSpeed: 90,

        escapeRadius: 110,

        resistance: 25,

        pullDifficulty: 1.2,

        spriteWidth: 120,

        spriteHeight: 120

    },


    // ========================================================
    // FISH 3
    // ========================================================

    fish3: {

        id: "fish3",

        asset: "sprite",

        normalSpeed: 55,

        maxSpeed: 100,

        escapeSpeed: 85,

        escapeRadius: 120,

        resistance: 40,

        pullDifficulty: 1.5,

        spriteWidth: 120,

        spriteHeight: 120,

        frameCount: 18,

        fps: 8,

        rows: 4,

        columns: 4

    },


    // ========================================================
    // FISH 4
    // ========================================================

    fish4: {

        id: "fish4",

        asset: "sprite",

        normalSpeed: 65,

        maxSpeed: 110,

        escapeSpeed: 100,

        escapeRadius: 130,

        resistance: 50,

        pullDifficulty: 1.7,

        spriteWidth: 120,

        spriteHeight: 120,

        frameCount: 16,

        fps: 8,

        rows: 4,

        columns: 4

    },


    // ========================================================
    // FISH 5
    // ========================================================

    fish5: {

        id: "fish5",

        asset: "sprite",

        normalSpeed: 70,

        maxSpeed: 120,

        escapeSpeed: 105,

        escapeRadius: 140,

        resistance: 60,

        pullDifficulty: 2.0,

        spriteWidth: 120,

        spriteHeight: 120,

        frameCount: 16,

        fps: 8,

        rows: 4,

        columns: 4

    },


    // ========================================================
    // FUTURE SVG FISH
    // ========================================================
    //
    // fish6: {
    //
    //     id: "fish6",
    //
    //     asset: "svg",
    //
    //     ...
    //
    // }
    //
    // ========================================================

};



// ============================================================
// SPAWN CONFIGURATION
// ============================================================
//
// AQUÍ controlamos EXACTAMENTE qué peces aparecen.
//
// Ya NO usamos:
// Math.random() para decidir el tipo.
//
// Por ejemplo:
//
// fish1
// fish1
// fish2
// fish3
// fish4
// fish5
//
// significa que habrá exactamente esos peces.
//
// ============================================================

const SPAWN_SEQUENCE = [

    "fish1",

    "fish1",

    "fish2",

    "fish2",

    "fish3",

    "fish3",

    "fish4",

    "fish4",

    "fish5",

    "fish5",

    "fish3",

    "fish4"

];



// ============================================================
// GAME CONFIG
// ============================================================

const GAME_CONFIG = {

    fishCount:
        SPAWN_SEQUENCE.length,


    // --------------------------------------------------------
    // HOOK
    // --------------------------------------------------------

    hookSpeed: 150,


    hookRadius: 0.1,


    // --------------------------------------------------------
    // FISH
    // --------------------------------------------------------

    fishMinY: 220,

    fishMaxY: 440,


    // --------------------------------------------------------
    // FISH ESCAPE
    // --------------------------------------------------------

    escapeAcceleration: 180,


    // --------------------------------------------------------
    // FISHING
    // --------------------------------------------------------

    pullStrength: 18,

    resistanceRecovery: 8,


    // --------------------------------------------------------
    // SPARKLES
    // --------------------------------------------------------

    sparkleLife: 0.5

};



// ============================================================
// LOADED IMAGES
// ============================================================

const images = {};



// ============================================================
// STATE
// ============================================================

const state = {

    fish: [],

    sparkles: [],

    bubbles: [],


    hook: {

        x: 240,

        y: 160,

        vx: 0,

        vy: 0,

        radius:
            GAME_CONFIG.hookRadius

    },


    // --------------------------------------------------------
    // CURRENT FISH
    // --------------------------------------------------------

    hookedFish: null,


    // --------------------------------------------------------
    // SCORE
    // --------------------------------------------------------

    score: 0,


    message:
        "Catch my skills!",


    messageTimer:
        2.5

};



// ============================================================
// INPUT
// ============================================================

const keyState =
    new Set();


window.addEventListener(
    "keydown",
    (event) => {

        keyState.add(
            event.key
        );

    }
);


window.addEventListener(
    "keyup",
    (event) => {

        keyState.delete(
            event.key
        );

    }
);



// ============================================================
// LOAD IMAGE
// ============================================================

function loadImage(src) {

    return new Promise(
        (resolve) => {

            const img =
                new Image();


            img.onload =
                () => {

                    resolve(img);

                };


            img.onerror =
                () => {

                    console.warn(
                        "Could not load:",
                        src
                    );

                    resolve(null);

                };


            img.src = src;

        }
    );

}



// ============================================================
// LOAD ASSETS
// ============================================================

async function loadAssets() {


    for (
        const key in ASSETS
    ) {

        const asset =
            ASSETS[key];


        if (
            asset.normal
        ) {

            images[key] = {

                normal:
                    await loadImage(
                        asset.normal
                    ),

                blink:
                    await loadImage(
                        asset.blink
                    )

            };

        }


        else if (
            asset.sheet
        ) {

            images[key] =
                await loadImage(
                    asset.sheet
                );

        }


        else if (
            asset.svg
        ) {

            images[key] =
                await loadImage(
                    asset.svg
                );

        }

    }

}



// ============================================================
// RANDOM
// ============================================================

function rand(min, max) {

    return (
        Math.random() *
        (max - min)
        + min
    );

}



// ============================================================
// CREATE FISH
// ============================================================
//
// El tipo viene de SPAWN_SEQUENCE.
//
// No hay random para decidir qué especie aparece.
// ============================================================

function createFish(typeId) {


    const config =
        FISH_TYPES[typeId];


    const leftToRight =
        Math.random() > 0.5;


    const direction =
        leftToRight
            ? 1
            : -1;


    return {

        // ----------------------------------------------------
        // TYPE
        // ----------------------------------------------------

        type:
            typeId,


        config:
            config,


        // ----------------------------------------------------
        // POSITION
        // ----------------------------------------------------

        x:
            leftToRight
                ? rand(80, 260)
                : rand(700, 900),


        y:
            rand(
                GAME_CONFIG.fishMinY,
                GAME_CONFIG.fishMaxY
            ),


        // ----------------------------------------------------
        // MOVEMENT
        // ----------------------------------------------------

        vx:
            direction *
            rand(
                config.normalSpeed * 0.8,
                config.normalSpeed
            ),


        vy: 0,


        // ----------------------------------------------------
        // ANIMATION
        // ----------------------------------------------------

        frame: 0,

        animationTimer: 0,


        // ----------------------------------------------------
        // BLINK
        // ----------------------------------------------------

        blinking: false,

        blinkTimer:
            rand(2, 5),


        // ----------------------------------------------------
        // BUBBLES
        // ----------------------------------------------------

        bubbleTimer:
            rand(2, 6),


        // ----------------------------------------------------
        // FISHING
        // ----------------------------------------------------

        hooked: false,

        resistance:
            config.resistance,


        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        caught: false,

        escaped: false

    };

}



// ============================================================
// RESET FISH
// ============================================================

function resetFish() {

    state.fish =
        SPAWN_SEQUENCE.map(
            createFish
        );

}



// ============================================================
// HOOK INPUT
// ============================================================

function updateHook(dt) {


    const speed =
        GAME_CONFIG.hookSpeed;


    // --------------------------------------------------------
    // MOVEMENT
    // --------------------------------------------------------

    if (
        keyState.has("ArrowLeft") ||
        keyState.has("a") ||
        keyState.has("A")
    ) {

        state.hook.x -=
            speed * dt;

    }


    if (
        keyState.has("ArrowRight") ||
        keyState.has("d") ||
        keyState.has("D")
    ) {

        state.hook.x +=
            speed * dt;

    }


    if (
        keyState.has("ArrowUp") ||
        keyState.has("w") ||
        keyState.has("W")
    ) {

        state.hook.y -=
            speed * dt;

    }


    if (
        keyState.has("ArrowDown") ||
        keyState.has("s") ||
        keyState.has("S")
    ) {

        state.hook.y +=
            speed * dt;

    }


    clampHook();

}



// ============================================================
// IS PLAYER PULLING?
// ============================================================
//
// Arrow Up o SPACE = recoger hilo.
// ============================================================

function isPulling() {

    return (

        keyState.has("ArrowUp") ||

        keyState.has("w") ||

        keyState.has("W") ||

        keyState.has(" ")

    );

}



// ============================================================
// CLAMP HOOK
// ============================================================

function clampHook() {

    state.hook.x =
        Math.max(
            80,
            Math.min(
                canvas.width - 60,
                state.hook.x
            )
        );


    state.hook.y =
        Math.max(
            110,
            Math.min(
                canvas.height - 40,
                state.hook.y
            )
        );

}



// ============================================================
// FISH AI
// ============================================================
//
// Los peces intentan evitar el hook.
//
// IMPORTANTE:
//
// No pueden escapar instantáneamente.
// La aceleración y velocidad máxima están limitadas.
// ============================================================

function updateFishEscape(
    f,
    dt
) {


    if (
        f.hooked
    ) {

        return;

    }


    const dx =
        f.x -
        state.hook.x;


    const dy =
        f.y -
        state.hook.y;


    const distance =
        Math.hypot(
            dx,
            dy
        );


    // --------------------------------------------------------
    // Dentro del radio de peligro
    // --------------------------------------------------------

    if (
        distance <
        f.config.escapeRadius
    ) {


        if (
            distance > 0
        ) {

            const nx =
                dx / distance;


            const ny =
                dy / distance;


            // ----------------------------------------------
            // Acelerar alejándose del hook
            // ----------------------------------------------

            f.vx +=
                nx *
                GAME_CONFIG.escapeAcceleration *
                dt;


            f.vy +=
                ny *
                GAME_CONFIG.escapeAcceleration *
                dt;

        }

    }


    // --------------------------------------------------------
    // LIMITAR VELOCIDAD
    // --------------------------------------------------------

    const speed =
        Math.hypot(
            f.vx,
            f.vy
        );


    if (
        speed >
        f.config.maxSpeed
    ) {

        const factor =
            f.config.maxSpeed /
            speed;


        f.vx *= factor;

        f.vy *= factor;

    }


    // --------------------------------------------------------
    // Movimiento
    // --------------------------------------------------------

    f.x +=
        f.vx * dt;


    f.y +=
        f.vy * dt;


    // --------------------------------------------------------
    // Recuperación vertical
    // --------------------------------------------------------

    f.vy *=
        0.98;


    // --------------------------------------------------------
    // Bordes
    // --------------------------------------------------------

    if (
        f.x < 50
    ) {

        f.x = 50;

        f.vx =
            Math.abs(f.vx);

    }


    if (
        f.x >
        canvas.width - 50
    ) {

        f.x =
            canvas.width - 50;

        f.vx =
            -Math.abs(f.vx);

    }


    if (
        f.y < GAME_CONFIG.fishMinY
    ) {

        f.y =
            GAME_CONFIG.fishMinY;

        f.vy =
            Math.abs(f.vy);

    }


    if (
        f.y >
        GAME_CONFIG.fishMaxY
    ) {

        f.y =
            GAME_CONFIG.fishMaxY;

        f.vy =
            -Math.abs(f.vy);

    }

}



// ============================================================
// FISH ANIMATION
// ============================================================

function updateFishAnimation(
    f,
    dt
) {


    // --------------------------------------------------------
    // BLINK
    // --------------------------------------------------------

    if (
        f.type === "fish1" ||
        f.type === "fish2"
    ) {

        f.blinkTimer -=
            dt;


        if (
            f.blinkTimer <= 0
        ) {

            f.blinking =
                !f.blinking;


            f.blinkTimer =
                f.blinking
                    ? 0.12
                    : rand(2, 5);

        }

    }


    // --------------------------------------------------------
    // SPRITE SHEETS
    // --------------------------------------------------------

    if (
        f.config.asset ===
        "sprite"
    ) {

        f.animationTimer +=
            dt;


        const duration =
            1 /
            f.config.fps;


        if (
            f.animationTimer >=
            duration
        ) {

            f.animationTimer -=
                duration;


            f.frame++;


            if (
                f.frame >=
                f.config.frameCount
            ) {

                f.frame = 0;

            }

        }

    }

}



// ============================================================
// HOOK FISH
// ============================================================

function tryHookFish() {


    // Ya estamos pescando un pez
    if (
        state.hookedFish
    ) {

        return;

    }


    for (
        const f of state.fish
    ) {


        if (
            f.caught ||
            f.escaped
        ) {

            continue;

        }


        const dx =
            f.x -
            state.hook.x;


        const dy =
            f.y -
            state.hook.y;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance <
            state.hook.radius +
            f.config.spriteHeight *
            0.35
        ) {


            // ------------------------------------------------
            // PEZ ENGANCHADO
            // ------------------------------------------------

            f.hooked = true;


            state.hookedFish =
                f;


            state.message =
                "¡Hooked! Now pull!";


            state.messageTimer =
                1;


            break;

        }

    }

}



// ============================================================
// FISH RESISTANCE
// ============================================================

function updateFishing(
    dt
) {


    const f =
        state.hookedFish;


    if (
        !f
    ) {

        return;

    }


    // --------------------------------------------------------
    // El pez permanece ligado al hook.
    // --------------------------------------------------------

    f.x =
        state.hook.x;


    f.y =
        state.hook.y;



    // --------------------------------------------------------
    // PLAYER PULLING
    // --------------------------------------------------------

    if (
        isPulling()
    ) {


        // El jugador reduce resistencia

        f.resistance -=

            GAME_CONFIG.pullStrength *

            dt /

            f.config.pullDifficulty;



        // ----------------------------------------------------
        // PEZ SE RESISTE
        // ----------------------------------------------------

        f.vx +=
            rand(-20, 20) *
            dt;


    }


    else {


        // ----------------------------------------------------
        // SI NO TIRA:
        //
        // El pez recupera resistencia.
        // ----------------------------------------------------

        f.resistance +=

            GAME_CONFIG.resistanceRecovery *

            dt;

    }


    // --------------------------------------------------------
    // LIMITAR RESISTENCIA
    // --------------------------------------------------------

    f.resistance =
        Math.max(
            0,
            Math.min(
                f.config.resistance,
                f.resistance
            )
        );


    // --------------------------------------------------------
    // CAPTURA
    // --------------------------------------------------------

    if (
        f.resistance <= 0
    ) {

        catchFish(f);

    }

}



// ============================================================
// CATCH FISH
// ============================================================

function catchFish(f) {


    f.caught = true;


    f.hooked = false;


    state.hookedFish =
        null;


    state.score++;


    state.message =
        "Skill caught! ✨";


    state.messageTimer =
        1.2;


    spawnSparkles(
        f.x,
        f.y
    );


    if (
        state.score >=
        GAME_CONFIG.fishCount
    ) {

        state.message =
            "¡You got your new member team!";


        state.messageTimer =
            3;

    }

}



// ============================================================
// SPARKLES
// ============================================================

function spawnSparkles(
    x,
    y
) {


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const angle =
            Math.PI *
            2 *
            i /
            18;


        const speed =
            rand(
                30,
                120
            );


        state.sparkles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life:
                GAME_CONFIG.sparkleLife

        });

    }

}



// ============================================================
// UPDATE SPARKLES
// ============================================================

function updateSparkles(
    dt
) {


    state.sparkles =
        state.sparkles.filter(
            (p) => {


                p.life -=
                    dt;


                p.x +=
                    p.vx *
                    dt;


                p.y +=
                    p.vy *
                    dt;


                p.vx *=
                    0.96;


                p.vy *=
                    0.96;


                return (
                    p.life > 0
                );

            }
        );

}



// ============================================================
// DRAW FISH
// ============================================================

function drawFish(f) {


    if (
        f.caught
    ) {

        return;

    }


    const facingRight =
        f.vx >= 0;


    const targetW =
        f.config.spriteWidth;


    const targetH =
        f.config.spriteHeight;


    ctx.save();


    ctx.translate(
        f.x,
        f.y
    );


    ctx.scale(
        facingRight
            ? 1
            : -1,
        1
    );



    // ========================================================
    // PNG
    // ========================================================

    if (
        f.config.asset ===
        "png"
    ) {


        const fish =
            images[f.type];


        if (
            !fish
        ) {

            ctx.restore();

            return;

        }


        const sprite =
            f.blinking &&
            fish.blink

                ? fish.blink

                : fish.normal;


        if (
            sprite
        ) {

            ctx.drawImage(

                sprite,

                -targetW / 2,

                -targetH / 2,

                targetW,

                targetH

            );

        }

    }



    // ========================================================
    // SPRITE SHEET
    // ========================================================

    else if (
        f.config.asset ===
        "sprite"
    ) {


        const sheet =
            images[f.type];


        if (
            !sheet
        ) {

            ctx.restore();

            return;

        }


        const frameWidth =
            sheet.width /
            f.config.columns;


        const frameHeight =
            sheet.height /
            f.config.rows;


        const column =
            f.frame %
            f.config.columns;


        const row =
            Math.floor(
                f.frame /
                f.config.columns
            );


        ctx.drawImage(

            sheet,

            column *
                frameWidth,

            row *
                frameHeight,

            frameWidth,

            frameHeight,

            -targetW / 2,

            -targetH / 2,

            targetW,

            targetH

        );

    }



    // ========================================================
    // SVG
    // ========================================================

    else if (
        f.config.asset ===
        "svg"
    ) {

        const svg =
            images[f.type];


        if (
            svg
        ) {

            ctx.drawImage(

                svg,

                -targetW / 2,

                -targetH / 2,

                targetW,

                targetH

            );

        }

    }


    ctx.restore();

}



// ============================================================
// DRAW HOOK
// ============================================================

function drawHook() {


    ctx.strokeStyle =
        "#1c2125";


    ctx.lineWidth = 2;


    ctx.beginPath();


    ctx.moveTo(
        280,
        150
    );


    ctx.lineTo(
        state.hook.x,
        state.hook.y
    );


    ctx.stroke();



    // --------------------------------------------------------
    // Simple hook
    // --------------------------------------------------------

    ctx.strokeStyle =
        "#465055";


    ctx.lineWidth = 3;


    ctx.beginPath();


    ctx.arc(

        state.hook.x,

        state.hook.y,

        14,

        -0.4,

        Math.PI * 1.3

    );


    ctx.stroke();

}



// ============================================================
// DRAW SPARKLES
// ============================================================

function drawSparkles() {


    for (
        const p of state.sparkles
    ) {


        ctx.globalAlpha =
            Math.max(
                0,
                p.life /
                GAME_CONFIG.sparkleLife
            );


        ctx.fillStyle =
            "#fff7a8";


        ctx.fillRect(

            p.x - 2,

            p.y - 2,

            4,

            4

        );

    }


    ctx.globalAlpha =
        1;

}



// ============================================================
// DRAW UI
// ============================================================

function drawUI() {


    ctx.fillStyle =
        "#083450";


    ctx.font =
        "700 28px Arial, Helvetica, sans-serif";


    ctx.fillText(

        `Peces: ${state.score}/${GAME_CONFIG.fishCount}`,

        20,

        40

    );


    // --------------------------------------------------------
    // FISHING RESISTANCE
    // --------------------------------------------------------

    const f =
        state.hookedFish;


    if (
        f
    ) {


        const barWidth =
            180;


        const barHeight =
            16;


        const x = 20;

        const y = 55;


        // Background

        ctx.fillStyle =
            "rgba(0,0,0,.25)";


        ctx.fillRect(

            x,
            y,

            barWidth,
            barHeight

        );


        // Resistance

        const ratio =
            f.resistance /
            f.config.resistance;


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(

            x,
            y,

            barWidth *
                ratio,

            barHeight

        );


        ctx.fillStyle =
            "#083450";


        ctx.font =
            "600 14px Arial";


        ctx.fillText(

            "PULL!",

            x + barWidth + 10,

            y + 13

        );

    }


    // --------------------------------------------------------
    // MESSAGE
    // --------------------------------------------------------

    if (
        state.messageTimer >
        0
    ) {


        ctx.fillStyle =
            "#ffffff";


        ctx.strokeStyle =
            "rgba(0,0,0,.26)";


        ctx.lineWidth =
            4;


        ctx.font =
            "800 42px Arial, Helvetica, sans-serif";


        const textWidth =
            ctx.measureText(
                state.message
            ).width;


        const textX =
            (
                canvas.width -
                textWidth
            ) *
            0.5;


        ctx.strokeText(

            state.message,

            textX,

            90

        );


        ctx.fillText(

            state.message,

            textX,

            90

        );

    }

}



// ============================================================
// DRAW SCENE
// ============================================================

function drawScene() {


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    // --------------------------------------------------------
    // WATER / BACKGROUND
    // --------------------------------------------------------

    // El fondo se controla principalmente desde CSS.


    // --------------------------------------------------------
    // FISH
    // --------------------------------------------------------

    state.fish.forEach(
        drawFish
    );


    // --------------------------------------------------------
    // HOOK
    // --------------------------------------------------------

    drawHook();


    // --------------------------------------------------------
    // EFFECTS
    // --------------------------------------------------------

    drawSparkles();


    // --------------------------------------------------------
    // UI
    // --------------------------------------------------------

    drawUI();

}



// ============================================================
// POINTER CONTROL
// ============================================================

function pointerToHook(
    event
) {


    const rect =
        canvas.getBoundingClientRect();


    state.hook.x =

        (
            event.clientX -
            rect.left
        ) /

        rect.width *

        canvas.width;


    state.hook.y =

        (
            event.clientY -
            rect.top
        ) /

        rect.height *

        canvas.height;


    clampHook();

}



canvas.addEventListener(

    "pointerdown",

    pointerToHook

);


canvas.addEventListener(

    "pointermove",

    (event) => {

        if (
            event.buttons
        ) {

            pointerToHook(
                event
            );

        }

    }

);



// ============================================================
// MAIN UPDATE
// ============================================================

function update(
    dt
) {


    // --------------------------------------------------------
    // HOOK
    // --------------------------------------------------------

    updateHook(
        dt
    );


    // --------------------------------------------------------
    // TRY TO HOOK FISH
    // --------------------------------------------------------

    tryHookFish();


    // --------------------------------------------------------
    // FISH
    // --------------------------------------------------------

    for (
        const f of state.fish
    ) {


        if (
            f.caught
        ) {

            continue;

        }


        if (
            !f.hooked
        ) {

            updateFishEscape(
                f,
                dt
            );

        }


        updateFishAnimation(
            f,
            dt
        );

    }


    // --------------------------------------------------------
    // FISHING
    // --------------------------------------------------------

    updateFishing(
        dt
    );


    // --------------------------------------------------------
    // EFFECTS
    // --------------------------------------------------------

    updateSparkles(
        dt
    );


    // --------------------------------------------------------
    // REMOVE CAUGHT FISH
    // --------------------------------------------------------

    state.fish =
        state.fish.filter(
            (f) =>
                !f.caught
        );


    // --------------------------------------------------------
    // MESSAGE
    // --------------------------------------------------------

    if (
        state.messageTimer >
        0
    ) {

        state.messageTimer -=
            dt;

    }

}



// ============================================================
// GAME LOOP
// ============================================================

let lastTime = 0;


function loop(
    timestamp
) {


    const dt =
        Math.min(

            0.033,

            (
                timestamp -
                lastTime
            ) /
            1000 ||
            0.016

        );


    lastTime =
        timestamp;


    update(
        dt
    );


    drawScene();


    requestAnimationFrame(
        loop
    );

}



// ============================================================
// START
// ============================================================

loadAssets()
    .then(
        () => {

            resetFish();

            requestAnimationFrame(
                loop
            );

        }
    );