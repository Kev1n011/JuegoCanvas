const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");



var super_x = 100;
var super_y = 100;
var direccion = "";
var velocidad = 1.2;
var obstaculos = [];

var pausa = false;
var score = 0;

var velocidad_bala = 2;
var balas = [];

//SPRITES DEL JUGADOR
const player_sprite = new Image();
player_sprite.src = "./imagenes/player/player.png"

player_sprite.onload = function () {
    ctx.drawImage(player_sprite, this.x, this.y, 200, 100);
};

//SPRITES DEL ENEMIGO
const enemigo_sprite = new Image();
enemigo_sprite.src = "./imagenes/Enemigos/enemigo1.png"

enemigo_sprite.onload = function () {
    ctx.drawImage(enemigo_sprite, this.x, this.y, 200, 100);
};

const imagen_bala = new Image();
imagen_bala.src = "./imagenes/balas/bala.png"
imagen_bala.onload = function () {
    ctx.drawImage(imagen_bala, this.x, this.y, 800, 100);
};

//SONIDOS
function sonido_disparo() {
    var audio = new Audio('./sonidos/disparo.wav');
    audio.volume = 0.1;
    audio.play();

}

class Player {
    constructor(x, y, ancho, alto) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }

    dibujar() {
        ctx.drawImage(player_sprite, this.x, this.y, 80, 80);
    }

    disparar() {
        let posicion_x = 0;
        let posicion_y = 0;

        //Dependiendo del lado del personaje, acomodar la posición de donde saldrá la bolita
        posicion_x = 35;
        posicion_y = -35;
        balas.push({
            x: player.x + posicion_x,
            y: player.y + posicion_y,
            velocidad: velocidad_bala,
            direccion: direccion
        });
        sonido_disparo();
    }

}

class Enemigo {
    constructor(x, y, ancho, alto, puntos_hp) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.puntos_hp = puntos_hp;
    }

    dibujar() {
        ctx.drawImage(enemigo_sprite, this.x, this.y, 50, 50);
    }

  
}



const player = new Player(100, 500, 100, 100);


//AQUÍ, SE CREAN LAS FILAS DE LOS ENEMIGOS CON UN FOR QUE CREA LOS OBJETOS Y LOS ALMACENA EN UN ARREGLO
let salto_posicion_x = 80;
let salto_posicion_y = 50;
let enemigo1_x = 300;
let enemigo1_y = 100;

const enemigos_1 = {};
let filas_enemigos = 0;
let columnas_enemigos = 10;
let bandera_filas = 0;


//SE CREAN LOS ENEMIGOS
while(bandera_filas < 3){
    for (filas_enemigos; filas_enemigos < columnas_enemigos; filas_enemigos++){
        console.log(filas_enemigos)
        enemigo1_x += salto_posicion_x;
        enemigos_1[filas_enemigos] = new Enemigo(enemigo1_x, enemigo1_y, 50, 50,1);
        console.log(enemigos_1[filas_enemigos])
    }
    
    enemigo1_x = 300
    enemigo1_y += salto_posicion_y;
    console.log(enemigo1_x)
    columnas_enemigos += 10;
    console.log(columnas_enemigos)
    bandera_filas++;

}

setInterval(function() {
    for (let i = 0; i < 30; i++) {
        enemigos_1[i].x += 20; // Mueve los enemigos 20 en X cada segundo
    }
}, 1500); 

paint();

var teclapresionada = {};
document.addEventListener("keydown", function (e) {
    teclapresionada[e.code] = true;

    if (!pausa) {
        if (teclapresionada['KeyA']) {
            direccion = "izquierda";
            player.x -= velocidad;
        }
        if (teclapresionada['KeyD']) {
            direccion = "derecha";
            player.x += velocidad;
        }

        if (teclapresionada['KeyC']) {
            player.disparar();
        }
    }

    if (e.code === 'Space') {
        pausa = !pausa;
    }
});


document.addEventListener("keyup", function (e) {
    delete teclapresionada[e.code];
});


function update() {
    if (!pausa) {
        switch (direccion) {
            case "izquierda":
                player.x -= velocidad;
                if (player.x < -110) {
                    player.x = 1500

                }
                break;
            case "derecha":
                player.x += velocidad;
                if (player.x > 1500) {
                    player.x = -100;

                }
        }

        // Actualiza y dibuja balas

        balas.forEach((bala, index) => {
            bala.y -= bala.velocidad;
            ctx.drawImage(imagen_bala, bala.x, bala.y, 10, 30);
        });

       
    }


}


function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //fondo del canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.dibujar();
    for (let i = 0; i < 30; i++){
        enemigos_1[i].dibujar();
    }
    ctx.font = "30px Georgia";
    ctx.fillStyle = "gray";
    ctx.fillText("Score: " + score, 100, 30);

    if (pausa) {
        ctx.fillStyle = "rgba(100,100,100,.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "black";
        ctx.font = "100px Georgia";
        ctx.fillText("Pausa", (canvas.width / 2) - 100, canvas.height / 2);
    }
    update();
    requestAnimationFrame(paint)


}

requestAnimationFrame(paint)

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());



