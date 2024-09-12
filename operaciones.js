const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");



var super_x = 100;
var super_y = 100;
var direccion = "";
var velocidad = 1.2;
var obstaculos = [];

var pausa = false;
var score = 0;




class Rectangulo {
    constructor(x, y, ancho, alto, color) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.color = color;
    }

    dibujar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }

}


const player = new Rectangulo(100, 500, 100, 100, "red");



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
        }
    }

    if (e.code === 'Space') {
        pausa = !pausa;
    }
});

document.addEventListener("keyup", function (e) {
    delete teclapresionada[e.code];
});
document.addEventListener("keypress", function (e) {
    var tecla_presionada = e.keyCode;
    console.log("tecla: " + tecla_presionada)

    if (tecla_presionada == 32) {
        pausa = !pausa;
    }
    //a = 97 s = 115 d = 100 w = 119
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



    }



}

function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //fondo del canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);



   
    player.dibujar();
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



