const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const ROWS = 20;
const COLUMNS = 20;
let coins = 0;
let currentDirection;
let applePosition = null;
const $body = $('.terrain');
const range = length => Array.from({ length }, (_, i) => i);
const cell = (col, row) => `<div class="cell" x="${col}" y="${row}"></div>`;  // Añadido una clase para el estilo
const gameMap = createVector(ROWS, COLUMNS, 0)
const snake = [
    {x: 0,y: 0},
]
const DIRECTION = {
    LEFT: "ArrowLeft",
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown"
}
const OPPOSITE_DIRECTION = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.UP]: DIRECTION.DOWN,
    [DIRECTION.DOWN]: DIRECTION.UP
};


function createVector(rows, columns, content){
    return range(rows).map(row => {
        return range(columns).map(column => {
            return content;
        }) // Convierte el array de celdas en una cadena
    }) // Convierte el array de filas en una cadena
}
function render(gameMap) {
    return gameMap.map((row, rowIndex) => {
        return `
        <div class="row" row-id="${rowIndex}">
        ${row.map((col, colIndex) => {
            
            return cell(colIndex, rowIndex);
        }).join('')}
        </div>
        `;
    }).join('');
}

function printSnake() {
    const $cells = $$('.cell');
    $cells.forEach($cell => {
        const x = parseInt($cell.getAttribute('x'));
        const y = parseInt($cell.getAttribute('y'));
        snake.forEach(segment => {
            if (x === segment.x && y === segment.y) {
                $cell.classList.add('snake');
                
            }
        });
    });
}
function printRandomApple(rows, cols) {
    let appleX = Math.floor(Math.random() *  rows);
    let appleY = Math.floor(Math.random() *  cols);
    
    $$('.cell').forEach(cell => cell.classList.remove('apple'));

    $$('.row').forEach(row => {
        let y = parseInt(row.getAttribute('row-id'));
        if(y === appleY){
            Array.from(row.children).forEach(cell => {
                const x = parseInt(cell.getAttribute('x'));
                if(x === appleX){
                    if(cell.classList.contains('snake')) printRandomApple
                    console.log(`Manzana dibujada en x:${x} y:${y}`);
                    cell.classList.add('apple');
                    applePosition = {x: x, y: y}; // Guardar la posición de la manzana
                }
            });
        }
    });

    return applePosition; // Retornar la posición al final de la función
}

function moveSnake(applePosition) {
    const head = { ...snake[snake.length - 1]}; // Copia la cabeza actual de la serpiente

    // Actualiza la posición de la cabeza según la dirección actual
    if (currentDirection === DIRECTION.LEFT) {
        head.x--;
    } else if (currentDirection === DIRECTION.RIGHT) {
        head.x++;
    } else if (currentDirection === DIRECTION.UP) {
        head.y--;
    } else if (currentDirection === DIRECTION.DOWN) {
        head.y++;
    }

    // Verifica si la serpiente ha comido la manzana
    const hasEatenApple = (head.x === applePosition.x && head.y === applePosition.y);

    // Añadir la nueva cabeza al array de la serpiente
    snake.push(head);

    // Si la serpiente no ha comido una manzana, se elimina el segmento de la cola
    if (!hasEatenApple) {
        snake.shift(); // Remover el segmento de la cola
    } else {
        coins++;  // Incrementa el puntaje
        applePosition = printRandomApple(ROWS, COLUMNS); // Generar nueva manzana
    }

    // Borrar la clase 'snake' de todas las celdas y luego volver a pintar la serpiente
    $$('.cell').forEach(cell => cell.classList.remove('snake'));
    printSnake();
}


function gameOver() {
    alert("¡Perdiste!");
    coins = 0;
    currentDirection = null;
    snake.length = 1;
    snake[0] = { x: 0, y: 0 };
    setup();  // Volver a generar el mapa y reiniciar la serpiente
}


function collisionsObserver() {
    const head = snake[snake.length - 1]; // Obtén la cabeza de la serpiente

    // Verificar si la cabeza choca con las paredes
    if (head.x < 0 || head.x >= COLUMNS || head.y < 0 || head.y >= ROWS) {
        gameOver();
        return;
    }

    // Verificar si la cabeza choca con cualquier parte del cuerpo
    for (let i = 0; i < snake.length - 1; i++) {
        const segment = snake[i];
        if (segment.x === head.x && segment.y === head.y) {
            gameOver();  // Llama a gameOver si la cabeza choca con cualquier parte del cuerpo
            return;  // Termina la función para detener el movimiento
        }
    }
}


document.addEventListener("keydown", (e) => {
    if (Object.values(DIRECTION).includes(e.key)) {
        if (currentDirection !== OPPOSITE_DIRECTION[e.key]) {
            currentDirection = e.key;
        }
    }
});

function setup() {
    $body.innerHTML = render(gameMap);
    printSnake();
    applePosition = printRandomApple(ROWS, COLUMNS);
}
setup()

function gameLoop(){
    moveSnake(applePosition)
    collisionsObserver()
    $('.coins').innerHTML = `Puntaje: ${coins}`
}
setInterval(()=> gameLoop(), 100)

// Inserta el HTML generado en el DOM