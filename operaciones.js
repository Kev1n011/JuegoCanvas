const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


var direccion = "";
var velocidad = 1.2;
var obstaculos = [];

var pausa = false;
var score = 0;

var velocidad_bala = 2;
var balas = [];

var balas_enemigo = [];
var velocidad_bala_enemigo = 2;

//BACKGROUND DEL JUEGO
const fondo_juego = new Image();
fondo_juego.src = "./imagenes/Niveles_Fondos/fondo_3.jpg"

fondo_juego.onload = function () {
    ctx.drawImage(fondo_juego, 0, 0, canvas.width, canvas.height);
};
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
function sonido_enemigo_destruido(){
    var audio = new Audio('./sonidos/enemigo_destruido.wav');
    audio.volume = 0.1;
    audio.autoplay = true;
    audio.play()
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

// Cargar imágenes de destrucción
const frames_destruccion = [];
for (let i = 1; i <= 7; i++) {
    const img = new Image();
    img.src = `./imagenes/Enemigos/Animaciones/enemigo_destruccion_${i}.gif`;
    frames_destruccion.push(img);
}
class Enemigo {
    constructor(x, y, ancho, alto, puntos_hp, imagen_actual) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.puntos_hp = puntos_hp;
        this.imagen_actual = imagen_actual;
        this.destruido = false; 
        this.frame_actual = 0; 
        this.tiempo_frame = 100; 
        this.last_update = Date.now(); // Para controlar el tiempo de actualización
        this.animacion_terminada = false; // Para saber si la animación ha terminado
        this.destruccion_timer = null
    }

    dibujar() {
        if (this.destruido) {
            // Controlar el tiempo y mostrar la imagen correcta
            const now = Date.now();
            if (now - this.last_update > this.tiempo_frame) {
                this.frame_actual++;
                this.last_update = now;
                if (this.frame_actual >= frames_destruccion.length) {
                    this.animacion_terminada = true;
                }
            }
            if (!this.animacion_terminada) {
                ctx.drawImage(frames_destruccion[this.frame_actual], this.x, this.y, 50, 50);
            }
        } else {
            ctx.drawImage(this.imagen_actual, this.x, this.y, 50, 50);
        }
    }

    manejarColision(bala) {
        return this.x < bala.x + 10 &&
            this.x + this.ancho > bala.x &&
            this.y < bala.y + 30 &&
            this.y + this.alto > bala.y;
    }

    destruir() {
        this.destruido = true;
        this.destruccion_timer = setTimeout(() => {

            //Elimina el enemigo después de mostrar el GIF durante 2 segundos
            const index = enemigos_1.indexOf(this);
            if (index > -1) {
                enemigos_1.splice(index, 1);
            }
        }, 1000);
    }

    disparar_enemigo() {
        let posicion_x = 0;
        let posicion_y = 0;

        //Dependiendo del lado del personaje, acomodar la posición de donde saldrá la bolita
        posicion_x = 35;
        posicion_y = -35;
        balas.push({
            x: this.x + posicion_x,
            y: this.y + posicion_y,
            velocidad: velocidad_bala,
            direccion: direccion
        });
        sonido_enemigo_destruido();
    }


}


//Se crea el jugador
const player = new Player(50, 750);

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
        enemigos_1[filas_enemigos] = new Enemigo(enemigo1_x, enemigo1_y, 50, 50, 1, imagen_enemigo);
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

    if (!pausa) {
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
                if (enemigos_1[i].x + enemigos_1[i].ancho >= 1400) {
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
        enemigos_1[1].disparar_enemigo()
        //Vuelve a activar  el movimiento después de retroceder

    }
}, 300);

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
                if (velocidad == 0 && player.x >= 1400) {
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
                if (player.x >= 1400) {
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
                        // Muestra el GIF durante 2 segundos antes de eliminar el enemigo

                        enemigo.destruir();
                        sonido_enemigo_destruido();



                    }

                }
            }
        });

        //ACTUALIZACIÓN DE BALA PARA LOS ENEMIGOS
        balas_enemigo.forEach((bala, balaIndex) => {
            bala.y += bala.velocidad;
            ctx.drawImage(imagen_bala, bala.x, bala.y, 30, 30);

            //Revisa colisiones entre las balas y los enemigos
            
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
    ctx.font = "30px Georgia";
    ctx.fillStyle = "gray";
    ctx.fillText("Score: " + score, 100, 30);

    if (pausa) {
        ctx.fillStyle = "rgba(100,100,100,.5)"
        ctx.fillRect(0, 0, canvas.height, canvas.width)
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



