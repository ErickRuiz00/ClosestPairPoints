// Esta archivo contiene todo lo necesario para realizar los dibujos

import { answer, bruteForce, DyC, dividedArray, array3elements } from "./DyC.js";

export var stage = new createjs.Stage("lienzo");
export var pointSize = 9;
export var coord = document.getElementById("coord");
window.addEventListener("resize",inicializarCanvas);

var lienzo = document.querySelector("#lienzo");

var X,Y,W,H,r;              
lienzo.height = 600;
lienzo.width = 1000; 
// Adapta el canvas a los distintos tamaños de pantalla
setTimeout(inicializarCanvas, 100);
function inicializarCanvas(){
    if (lienzo && lienzo.getContext){
        var ctx1 = lienzo.getContext("2d");
        if (ctx1){
            var s = getComputedStyle(lienzo);
            var w = s.width;
            var h = s.height;
                      
            W = lienzo.width = w.split("px")[0];
            H = lienzo.height = h.split("px")[0];
               
            X = Math.floor(W/2);
            Y = Math.floor(H/2);
            r = Math.floor(W/3);
        }
    }
}

// Clase punto
// x -> Coordenada x
// y -> Coordenada y
// draw -> Estructura de la liberia createjs para controlar los dibujos de los puntos
class Point {
    constructor(x, y, draw){
        this.draw = draw;
        this.x = x;
        this.y = y;
    }
}


// La variable stop controla que las animaciones se detenga si por alguna razon
// se ve interrumpido el proceso, por ejemplo, al limpiar el lienzo, 
// 0 -> indica que todo esta en orden, los procesos siguen corrienndo de forma normal
// 1 -> indica que ocurrio alguna interrupción. Detiene cualquier animación en proceso
export var stop = 0;

// La variable block bloquea que se agreguen nuevos puntos mientras esta corriendo
// alguna animacion
// 0 -> indica que puedes continuar dibujando
// 1 -> bloquea cualquier nuevo dibujo o intento de agregar un nuevo punto
var block = 0;
export function setBlock(value){
    block = value;
}

// Listener del click del usuario que ejecuta la posicion para obtener las coordenadas y 
// dibujar el punto
lienzo.addEventListener("click",getPosition);

// Arreglos que contienen los puntos. "shapes" los contiene tal como fueron ingresados, mientras
// que "shapesSort" los tiene ordenados o por ordenar
var shapes = [];
var shapesSort = [];

// Se ejecuta al dar click en el lienzo, obtiene las coordenadas y crea el punto
function getPosition(e){
    if(block == 1)
        return;
    
    // inicializarCanvas();
    if(shapes.length >= 20){
        alert("Haz alcanzado el límite de puntos");
        return
    }
    var rect = lienzo.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    let c = new createjs.Shape();
    if(addPoint(x/10, y/10, c))
        drawCoordinates(shapes);
}

// Determina si un objeto de la clase <Point> es igual a otro, o se solapan entre ellos
// 
// Recibe 2 objetos de la clase <Point>
function isEqual(p1, p2){
    return ((Math.abs(p1.x - p2.x) < 1.7) && Math.abs(p1.y - p2.y) < 1.7)? true : false;
}

// Verifica que el punto no se encuentre ya en el arreglo
// 
// Recibe un objeto <Punto>
function isValid(point){
    for(let i = 0; i < shapes.length; i++){
        if(isEqual(point,shapes[i]))
            return false;
    }

    return true;
}

export function drawCoordinates(shapes){
    stage.removeAllChildren();
    for(let i = 0; i < shapes.length; i++){
        (shapes[i].draw).graphics.beginFill("#fff").drawCircle(shapes[i].x*10,shapes[i].y*10,pointSize);
        stage.addChild(shapes[i].draw);
        stage.update();
    }
}


var addedPoint = document.querySelector(".points");
function addPoint(x, y, c){
    let point = new Point(x,y,c);

    if(isValid(point)){
        shapes.push(point);
        shapesSort.push(point);
        y = lienzo.height - y - 450;
        coord.innerHTML = `x: ${x.toFixed(2)} y: ${y.toFixed(2)}`;
        const p = document.createElement("p");
        p.innerHTML = `x: ${x.toFixed(2)} <br>y: ${y.toFixed(2)}`;
        p.classList.add("item__point")  
        addedPoint.appendChild(p); 
        return true;
    }

    return false;
}

document.getElementById('start_BF').addEventListener("click",start_BF);
document.getElementById('start_BFM').addEventListener("click",start_BF);
export function start_BF(){
    if(block == 1)
        return;
    
    let n = shapes.length;
    
    if(n < 2){
        alert("Agrega al menos 2 puntos");
        return;
    }

    coord.innerHTML = ("Procesando...");
    stop = 0;
    block = 1;
    bruteForce(shapes, n, shapes);
}

document.getElementById('start_DyC').addEventListener("click",start_DyC);
document.getElementById('start_DyCM').addEventListener("click",start_DyC);
export function start_DyC(){
    if(block == 1)
        return;
    
    let n = shapesSort.length;

    if(n < 2){
        alert("Agrega al menos 2 puntos");
        return;
    }

    coord.innerHTML = "Procesando...";
    stop = 0;
    block = 1;

    DyC(shapesSort, n);
}

document.getElementById('random').addEventListener("click",randomPoints);
document.getElementById('randomM').addEventListener("click",randomPoints);
export function randomPoints(){
    if(block == 1)
        return;
    
    if(shapes.length >= 20){
        alert("Haz alcanzado el máximo de puntos");
        return;
    }

    let n = 20 - shapes.length;

    for(let i = 0; i < n;){
        let x = Math.random() * lienzo.width;
        let y = Math.random() * lienzo.height;
        let c = new createjs.Shape();

        if(addPoint(x/10, y/10, c)){
            drawCoordinates(shapes);
            i++;
        }
    }
}

document.getElementById('restart').addEventListener("click",restart);
document.getElementById('restartM').addEventListener("click",restart);
export function restart(){
    block = 0;
    stop = 1;
    shapes.length = 0;
    shapesSort.length = 0;
    dividedArray.length = 0;
    array3elements.length = 0;
    var info = document.querySelectorAll(".item__point");
    for(let item of info){
        item.remove();
    }
    coord.innerHTML = "";
    stage.removeAllChildren();
    inicializarCanvas();
}