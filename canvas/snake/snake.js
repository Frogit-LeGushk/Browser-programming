const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')
// console.log(ctx)


var size  = 30;
var time = 125;

let Top = 'top'
const Right = 'right'
const Bottom = 'bottom'
const Left = 'left'

const objSnake = {
    speed: Right,
    snake: [
        {x: 9 * size, y: 9 * size},
        {x: 8 * size, y: 9 * size},
        {x: 7 * size, y: 9 * size},
        {x: 6 * size, y: 9 * size},
        {x: 5 * size, y: 9 * size},
        {x: 4 * size, y: 9 * size},
        {x: 3 * size, y: 9 * size}, 
        {x: 2 * size, y: 9 * size},
        {x: 1 * size, y: 9 * size} 
    ]
}



function draw() {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'

    condition()

    // console.log(objSnake.snake)
    

    for(let i = 0; i < objSnake.snake.length; i++) {
        ctx.fillRect(objSnake.snake[i].x, objSnake.snake[i].y, size, size)
    }


    const numberRow = canvas.height / 30 ;
    const numberColumn = canvas.width / 30 ;

    for(let i = 0; i < numberRow; i++) {
        ctx.beginPath();
        ctx.lineTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke()
    }

    for(let i = 0; i < numberColumn; i++) {
        ctx.beginPath();
        ctx.lineTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke()
    }
    
}

setInterval(draw, time)





function condition() {

   
    
    if(objSnake.snake[0].y >= canvas.height) {
        objSnake.snake[0].y = 0
    }

    if(objSnake.snake[0].y < 0) {
        objSnake.snake[0].y = Math.floor(canvas.height / 30) * size 
    }


    if(objSnake.snake[0].x < 0) {
        objSnake.snake[0].x = Math.floor(canvas.width / 30 ) * size 
    }
     
    if(objSnake.snake[0].x >= canvas.width) {
        objSnake.snake[0].x = 0
    }

    if(objSnake.speed === Right) {
        const x = objSnake.snake[0].x + size
        const y = objSnake.snake[0].y
        objSnake.snake.unshift({x, y})
        objSnake.snake.pop()
    }

    if(objSnake.speed === Left) {
        const x = objSnake.snake[0].x - size
        const y = objSnake.snake[0].y
        objSnake.snake.unshift({x, y})
        objSnake.snake.pop()
    }

    if(objSnake.speed === Top) {
        const x = objSnake.snake[0].x
        const y = objSnake.snake[0].y - size
        objSnake.snake.unshift({x, y})
        objSnake.snake.pop()
    }

    if(objSnake.speed === Bottom) {
        const x = objSnake.snake[0].x
        const y = objSnake.snake[0].y + size
        objSnake.snake.unshift({x, y})
        objSnake.snake.pop()
    }

    for(let i = 1; i < objSnake.snake.length; i++) {
        if(objSnake.snake[0].x === objSnake.snake[i].x && objSnake.snake[0].y === objSnake.snake[i].y) {
            console.log(objSnake.snake[i], i)

            objSnake.snake = objSnake.snake.slice(0, i)
        }
    }


    
}


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

window.addEventListener('keydown', function(e) {
    console.log(e.code)

    if(e.code === 'ArrowRight') {
        if(objSnake.speed === Top || objSnake.speed === Bottom) {
            objSnake.speed = Right
        }
    }

    if(e.code === 'ArrowDown') {
        if(objSnake.speed === Left || objSnake.speed === Right) {
            objSnake.speed = Bottom
        }
    }

    if(e.code === 'ArrowLeft') {
        if(objSnake.speed === Top || objSnake.speed === Bottom) {
            objSnake.speed = Left
        }
    }

    if(e.code === 'ArrowUp') {
        if(objSnake.speed === Left || objSnake.speed === Right) {
            objSnake.speed = Top
        }
    }
})