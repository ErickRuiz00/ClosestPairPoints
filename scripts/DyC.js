import {setBlock, stop, pointSize, coord, stage, drawCoordinates} from "./draw.js";

// Esta archivo contiene los algoritmos necesarios para realizar las animaciones, asi
// como la resolucion del problema

const red = 'ff2d2d', green = '39f533', orange = 'ffaf54', blue = '7697ff';

var ctx = lienzo.getContext("2d");
// Funcion auxiliar para calcular  y retornar la distancia entre 2 puntos
// 
// Recibe 2 objetos de la clase <Point>
export function dist(p1, p2){
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + 
                     (p1.y - p2.y) * (p1.y - p2.y));
}

export function answer(array, n){
    let min_dist = [0, 0, Number.MAX_VALUE];
    stage.removeAllChildren();
    // stage.update();

    for(let i = 0; i < n; i++){
        giveColor(array[i], green)
        for(let j = i + 1; j < n; j++){
            let current = dist(array[i], array[j]);
            if(current < min_dist[2]){
                min_dist[0] = array[i];
                min_dist[1] = array[j];
                min_dist[2] = current;
            }
        }
    }

    giveColor(min_dist[0], blue);
    giveColor(min_dist[1], blue);
    drawLine(min_dist[0], min_dist[1]);
    coord.innerHTML = `La distancia mínima es: ${min_dist[2].toFixed(2)}`
    
}

function giveColor(point, color){
    (point.draw).graphics.beginFill(`#${color}`).drawCircle(point.x * 10, point.y * 10, pointSize);
    stage.addChild(point.draw);
    stage.update();
}


function drawLine(from, to){
    ctx.globalCompositeOperation = 'destination-over';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.moveTo(from.x * 10, from.y * 10);
    ctx.lineTo(to.x * 10, to.y * 10);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
}

export function bruteForce(array, n, array2){
    var i = 0, j;

    drawCoordinates(array2);
    // Dibujar la división de cada sección de 3 puntos DyC, y prevenir que se dibuje
    // si se dibujan 2 o 3 puntos para la animación de bruteForce
    if(n != array2.length){
        var start = array[0].x * 10, 
            end = array[n - 1].x * 10 - start;
            drawDiv(start, end);
    }
    
    // Controla el pasar por todos los puntos y ponerlos en proceso (orange)
    var id_i = setTimeout(function drawOrange(){
        // Cada dibujo va encima del anterior
        ctx.globalCompositeOperation = 'source-over';

        // Si se interrumpe el proceso por alguna razón, detiene la animación
        if(stop == 1){
            clearTimeout(id_i);
            return 0;
        }

        // Caso "base"
        // Si termina de evaluar todos los puntos, dibuja la linea entre los más cercanos
        // y detiene el bucle
        if(n == i){
            clearTimeout(id_i);
            if(n == array2.length){
                answer(array2, n);
            }
            setBlock(0);
            return;
        }

        // Colorea el punto que será procesado en color naranja.
        giveColor(array[i], orange);
        j = i + 1;
        i++;

        var id_j = setTimeout(function drawRed(){
            stage.update();
            // Detiene la animación si se interrumpe el proceso
            if(stop == 1){
                clearTimeout(id_j);
                return 0;
            }

            // Si esto se cumple, significa que el punto que esta en procesamiento ya se ha 
            // comparado con todos los demás
            if(n == j){
                clearTimeout(id_j);
                // Ponemos su estado en "procesado" (green)
                giveColor(array[i - 1], green);
                // Continua con la siguiente "iteracion"
                id_i = setTimeout(drawOrange, 200);
                return;
            }

            // Colorea de (red) uno a uno los puntos que están siendo comparados con el punto en proceso
            giveColor(array[j], red);

            // Dibuja la linea entre el punto en estado de proceso (orange) y con los que se esta comparando
            drawLine(array[i - 1], array[j]);

            // Vuelve a colorear los puntos de blanco
            for(let p = j; p < n; p++){
                (array[p].draw).graphics.beginFill("#fff").drawCircle(array[p].x * 10, array[p].y * 10, 9);
                stage.addChild(array[p].draw);
            }
            
            j++;
            // Avanzamos a la siguiente "iteracion"
            id_j = setTimeout(drawRed, 200);
        }, 200)
    }, 200)
}


// Ordenar el array respecto a x
function sortX(array){
    return array.sort(function(a,b){
        return a.x - b.x;
    })
}

export function DyC(array, n){
    sortX(array);

    divide(array, n);

    drawDivision(dividedArray, array);
    let u = 0;
    setBlock(1);

    let id_m = setTimeout(function callBruteForce(){
        if(u == array3elements.length || stop == 1){
            clearTimeout(id_m);
            answer(array, n);
            setBlock(0);
            return;
        }

        bruteForce(array3elements[u], array3elements[u].length, array);

        for(let i = 0; i < u; i++){
            let colored = array3elements[i];
            for(let point of colored){
                giveColor(point, green);
            }
        }
        u++;
        id_m = setTimeout(callBruteForce, 2300); 
        
    }, 400 * dividedArray.length + 1000);
}

export var dividedArray = [];
export var array3elements = [];

function divide(array, n){
    dividedArray.push(array);
    if(n <= 3){
        array3elements.push(array);
        return;
    }

    let mid = Math.floor(n/2);
    divide(array.slice(0, mid), mid)
    divide(array.slice(mid, n), n - mid);
}

function drawDivision(array){
    let n = 0;
    const m = array.length;

    let id_d = setTimeout(function division(){
        if(n == m || stop == 1){
            clearTimeout(id_d);
            return;
        }

        let p = array[n].length,
            start = array[n][0].x * 10, 
            end = array[n][p - 1].x * 10 - start;

        let ind = drawDiv(start, end);
        stage.removeChildAt(ind);
        n++;
        id_d = setTimeout(division, 400);    
    }, 400);
}

function drawDiv(start, end){
    let div = new createjs.Shape();
    div.graphics.beginFill("rgba(0, 175, 255, 0.30").drawRect(start, 0, end, lienzo.height);
    stage.addChild(div);
    stage.update();
    return stage.getChildIndex(div);
}