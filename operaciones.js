const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let juego_terminado = false;

var direccion = "";
var velocidad = 1.2;
var obstaculos = [];

var pausa = false;
var score = 0;
const puntuaciones = [];

var velocidad_bala = 2;
var balas = [];

var balas_enemigo = [];
var velocidad_bala_enemigo = 1;

let bandera_destruido = false;
let mostrar_menu_inicio = true;

//BACKGROUND DEL JUEGO
const fondo_juego = new Image();
fondo_juego.src = "./imagenes/Niveles_Fondos/fondo_3.jpg"

fondo_juego.onload = function () {
    ctx.drawImage(fondo_juego, 0, 0, canvas.width, canvas.height);
};

//MENÚ DE INICIO
const img_menu_inicio = new Image();
img_menu_inicio.src = "./imagenes/Niveles_Fondos/menu_inicio.png"

img_menu_inicio.onload = function () {
    ctx.drawImage(img_menu_inicio, 0, 0, canvas.width, canvas.height);
};

function menu_inicio() {
    ctx.drawImage(img_menu_inicio, 0, 0, canvas.width, canvas.height);

    ctx.textAlign = "left"; 
    ctx.fillStyle = "white";
    ctx.font = "60px Unlock";
    ctx.fillText("Pulsa Enter para comenzar", canvas.width - 860, 500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = .4;
    ctx.strokeText("Pulsa Enter para comenzar", canvas.width - 860, 500);
}

function game_over() {
    ctx.fillStyle = "rgba(34,37, 95, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(217,217,217)";
    ctx.font = "60px Unlock";
    ctx.textAlign = "center";  
    ctx.fillText("Game Over", canvas.width / 2, (canvas.height / 2) - 200);

    ctx.font = "60px Noto Sans";
    ctx.fillText("Puntuación: " + score, canvas.width / 2, (canvas.height / 2) - 100);
}
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

const enemigo_destruccion = new Image();
enemigo_destruccion.src = "./imagenes/Enemigos/Animaciones/enemigo_destruccion.gif";

let imagen_enemigo = new Image();
imagen_enemigo = enemigo_sprite; //Por default, la imagen del enemigo es su sprite original, si este es destruido, su imagén cambiará a la de destrucción


//BALAS
const imagen_bala = new Image();
imagen_bala.src = "./imagenes/balas/balas_1.png"
imagen_bala.onload = function () {
    ctx.drawImage(imagen_bala, this.x, this.y, 800, 100);
};

//SONIDOS
function sonido_disparo() {
    var audio = new Audio('./sonidos/disparo.wav');
    audio.volume = 0.1;
    audio.play();


}
function sonido_enemigo_destruido() {
    var audio = new Audio('./sonidos/enemigo_destruido.wav');
    audio.volume = 0.060;
    audio.play()
}
function sonido_player_dano() {
    var audio = new Audio('./sonidos/player_dano.wav');
    audio.volume = 0.360;
    audio.play()
}
const musica_fondo = new Audio('./Sonidos/Necrofantasia-8-Bit-Remix.wav');
musica_fondo.volume = 0.3;


class Player {
    constructor(x, y, ancho, alto, puntos_hp) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.puntos_hp = puntos_hp;
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

    manejarColision(bala) {
        return (player.x < bala.x + 50 &&
            player.x + player.ancho > bala.x &&
            player.y < bala.y + 50 &&
            player.y + player.alto > bala.y) ||
            (player.x > bala.x - 50 &&
                player.x + player.ancho < bala.x &&
                player.y > bala.y - 50 &&
                player.y + player.alto < bala.y);
    }


}

class Enemigo {
    constructor(x, y, ancho, alto, puntos_hp, imagen_actual, valor_puntos) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.puntos_hp = puntos_hp;
        this.imagen_actual = imagen_actual;
        this.valor_puntos = valor_puntos;

    }

    dibujar() {
        ctx.drawImage(enemigo_sprite, this.x, this.y, 50, 50);
        if (this.puntos_hp <= 0 && !this.puntuacion_dibujada) {
            this.dibujar_puntuacion();
        }

    }

    manejarColision(bala) {
        return this.x < bala.x + 10 &&
            this.x + this.ancho > bala.x &&
            this.y < bala.y + 30 &&
            this.y + this.alto > bala.y;
    }



    disparar_enemigo() {
        let posicion_x = 0;
        let posicion_y = 0;

        //Dependiendo del lado del personaje, acomodar la posición de donde saldrá la bolita
        posicion_x = 0;
        posicion_y = 0;
        balas_enemigo.push({
            x: this.x + posicion_x,
            y: this.y + posicion_y,
            velocidad: velocidad_bala_enemigo,
            direccion: direccion

        });

    }

    destruir_enemigo(enemigo) {
        enemigos_1.splice(enemigo, 1);
        puntuaciones.push({ x: this.x, y: this.y, texto: "+100", tiempo: 0 });
        bandera_destruido = true;
        sonido_enemigo_destruido();


    }

    dibujar_puntuacion() {
        if (bandera_destruido) {
            ctx.fillStyle = "black";
            ctx.font = "40px Georgia";
            ctx.fillText("+100", this.x, this.y, 40);
            bandera_destruido = false


        }

    }

}


//Se crea el jugador
const player = new Player(50, 750, 0, 0, 2);

//AQUÍ, SE CREAN LAS FILAS DE LOS ENEMIGOS CON UN FOR QUE CREA LOS OBJETOS Y LOS ALMACENA EN UN ARREGLO
let salto_posicion_x = 100;
let salto_posicion_y = 70;
let enemigo1_x = 300;
let enemigo1_y = 100;

const enemigos_1 = [];
let filas_enemigos = 0;
let columnas_enemigos = 10;
let bandera_filas = 0;


//SE CREAN LOS ENEMIGOS
while (bandera_filas < 3) {
    for (filas_enemigos; filas_enemigos < columnas_enemigos; filas_enemigos++) {
        console.log(filas_enemigos)
        enemigo1_x += salto_posicion_x;
        enemigos_1[filas_enemigos] = new Enemigo(enemigo1_x, enemigo1_y, 50, 50, 1, imagen_enemigo, 100);
        console.log(enemigos_1[filas_enemigos])
    }

    enemigo1_x = 300
    enemigo1_y += salto_posicion_y;
    console.log(enemigo1_x)
    columnas_enemigos += 10;
    console.log(columnas_enemigos)
    bandera_filas++;
}
/*
TODO:
PARA QUE LA POSICION y CAMBIE, SE DEBE POSICIONARSE EN LA ULTIMA COLUMNA, Y VALIDAR LA COLISION CON EL LIMITE DEL CANVAS,
SI COLISIONA, AVANZAR HACIA ABAJO Y RETROCEDER x
*/
let bajar_una_vez = true;
let retroceder = false;
let alcanzado_limite = false;
if (!pausa) {

}
setInterval(function () {

    if (!pausa && !mostrar_menu_inicio && !juego_terminado) {
        //Si los enemigos alcanzan el límite y deben bajar una vez
        if (alcanzado_limite && bajar_una_vez) {
            for (let i = enemigos_1.length - 1; i >= 0; i--) {

                enemigos_1[i].y += 50;  //Baja a todos los enemigos 50 puntos en Y
                console.log("ada")

                //Estos dos if son para evitar de que a la hora de que los enemigos bajen, estos bajen en diagonal.
                //Esto ocurre debido a que se están ejecutando simultaneamente el codigo de bajar verticalmente y el de el movimiento horizontal
                if (retroceder) {
                    enemigos_1[i].x += 20;
                } else {
                    enemigos_1[i].x -= 20;
                }

            }

            bajar_una_vez = false;
        }

        //Mueve los enemigos si no están retrocediendo
        if (!retroceder) {
            for (let i = enemigos_1.length - 1; i >= 0; i--) {
                enemigos_1[i].x += 20;
                //Verifica si algún enemigo alcanza el límite del canvas
                if (enemigos_1[i].x + enemigos_1[i].ancho >= canvas.width - 100) {
                    alcanzado_limite = true;
                    retroceder = true;
                    bajar_una_vez = true;
                }
            }
        }
        if (retroceder) {
            for (let i = enemigos_1.length - 1; i >= 0; i--) {
                enemigos_1[i].x -= 20;
                //Verifica si algún enemigo alcanza el límite
                if (enemigos_1[i].x <= 0) {
                    alcanzado_limite = true;
                    retroceder = false;
                    bajar_una_vez = true;
                }
            }
        }
        //Vuelve a activar  el movimiento después de retroceder

    }
}, 300);

setInterval(function () {

    if (!pausa && !mostrar_menu_inicio && !juego_terminado) {
        let numero_aleatorio = Math.floor(Math.random() * enemigos_1.length);
        enemigos_1[numero_aleatorio].disparar_enemigo()

    }
}, 1000);
function volver_jugar() {
    //Restablecer variables
    direccion = "";
    velocidad = 1.2;
    obstaculos = [];
    pausa = false;
    score = 0;
    puntuaciones.length = 0;
    velocidad_bala = 2;
    balas.length = 0;
    balas_enemigo.length = 0;
    velocidad_bala_enemigo = 1;
    bandera_destruido = false;
    mostrar_menu_inicio = true;
    juego_terminado = false;

    //Restablecer el estado del jugador
    player.x = 50;
    player.y = 750;
    player.puntos_hp = 2;

    //Reconfigurar los enemigos
    enemigos_1.length = 0;
    let salto_posicion_x = 100;
    let salto_posicion_y = 70;
    let enemigo1_x = 300;
    let enemigo1_y = 100;
    let filas_enemigos = 0;
    let columnas_enemigos = 10;
    let bandera_filas = 0;

    while (bandera_filas < 3) {
        for (filas_enemigos; filas_enemigos < columnas_enemigos; filas_enemigos++) {
            enemigo1_x += salto_posicion_x;
            enemigos_1[filas_enemigos] = new Enemigo(enemigo1_x, enemigo1_y, 50, 50, 1, imagen_enemigo, 100);
        }

        enemigo1_x = 300;
        enemigo1_y += salto_posicion_y;
        columnas_enemigos += 10;
        bandera_filas++;
    }

    // Reiniciar fondo y música
    fondo_juego.onload = function () {
        ctx.drawImage(fondo_juego, 0, 0, canvas.width, canvas.height);
    };
   
}
paint();
var teclapresionada = {};
document.addEventListener("keydown", function (e) {
    teclapresionada[e.code] = true;

    if (!pausa && !mostrar_menu_inicio && !juego_terminado) {
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
    if (teclapresionada['Enter']) {
        if (juego_terminado) {
            musica_fondo.pause();
            musica_fondo.currentTime = 0;
            volver_jugar();
        } else {
            mostrar_menu_inicio = false;
            setTimeout(() => {
                musica_fondo.play();
                musica_fondo.loop = true;
            }, 1000);
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
    if (!pausa && !mostrar_menu_inicio && !juego_terminado) {
        switch (direccion) {
            case "izquierda":
                if (velocidad == 0 && player.x >= canvas.width - 120) {
                    velocidad = 1.2;
                    console.log(velocidad)
                }
                player.x -= velocidad;
                if (player.x <= 0) {
                    velocidad = 0;

                }
                break;
            case "derecha":
                if (velocidad == 0 && player.x <= 0) {
                    velocidad = 1.2;
                    console.log(velocidad);
                }
                player.x += velocidad;
                if (player.x >= canvas.width - 120) {
                    velocidad = 0;
                    console.log(player.x)

                }
        }


        //Dibuja las balas disparadas por el jugador
        balas.forEach((bala, balaIndex) => {
            bala.y -= bala.velocidad;
            ctx.drawImage(imagen_bala, bala.x, bala.y, 30, 30);

            //Revisa colisiones entre las balas y los enemigos
            for (let i = enemigos_1.length - 1; i >= 0; i--) {
                const enemigo = enemigos_1[i];

                if (enemigo.manejarColision(bala)) {
                    console.log('Colisión detectada');

                    //Eliminar la bala
                    balas.splice(balaIndex, 1);
                    enemigo.puntos_hp--;

                    //Si el enemigo tiene 0 puntos de vida, eliminarlo
                    if (enemigo.puntos_hp <= 0) {
                        console.log('Enemigo eliminado');
                        score += enemigo.valor_puntos;
                        enemigos_1[i].destruir_enemigo(i);
                        bandera_destruido = true;



                    }

                }
            }
        });

        //ACTUALIZACIÓN DE BALA PARA LOS ENEMIGOS
        balas_enemigo.forEach((bala, balaIndex) => {
            bala.y += bala.velocidad;
            ctx.drawImage(imagen_bala, bala.x, bala.y, 50, 50);

            if (player.manejarColision(bala)) {
                console.log('Colisión detectada con jugador');

                //Eliminar la bala
                balas_enemigo.splice(balaIndex, 1);
                player.puntos_hp--;
                console.log(player.puntos_hp);
                sonido_player_dano();

                //Si el jugador tiene 0 puntos de vida, eliminarlo
                if (player.puntos_hp <= 0) {
                    console.log('Jugador eliminado');
                    juego_terminado = true;
                }
            }
        });



    }


}


function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //fondo del canvas


    ctx.drawImage(fondo_juego, 0, 0, canvas.width, canvas.height);

    player.dibujar();
    for (let i = enemigos_1.length - 1; i >= 0; i--) {
        enemigos_1[i].dibujar();

    }
    // Dibuja las puntuaciones
    ctx.fillStyle = "black";
    ctx.font = "40px Georgia";
    for (let i = puntuaciones.length - 1; i >= 0; i--) {
        let puntuacion = puntuaciones[i];
        ctx.fillText(puntuacion.texto, puntuacion.x, puntuacion.y - puntuacion.tiempo);
        puntuacion.tiempo += .4; // Cambia la velocidad de desaparición aquí
        if (puntuacion.tiempo > 50) { // Después de 50 píxeles de movimiento, elimina la puntuación
            puntuaciones.splice(i, 1);
        }
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
    if (mostrar_menu_inicio) {
        menu_inicio();

    }
    if (juego_terminado) {
        game_over();
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






