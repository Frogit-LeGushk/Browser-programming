const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d', { alpha: true });

canvas.style.border = '1px solid black'
canvas.height = window.innerHeight
canvas.width = window.innerWidth/2

ctx.lineCap = 'round'

class Ball {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI*2, true);
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.fill("evenodd");
    }
}

class CreaterBalls {
    constructor(theme, number) {
        this.color = theme ? '#000' : '#fff'
        this.number = number
    }

    

    R(min, max, speed = false) {
        const limit = Math.random() * (max - min) + min
        if(Math.abs(limit) <= 1 && speed) {
            if(limit >= 0) {
                return 1
            } else {
                return -1
            }
        }

        return limit
    }

    get createBalls() {
        const {height, width} = canvas
  
        return new Array(this.number)
            .fill('')
            .map(_ => new Ball(
                Math.round(this.R(100, width - 100)), 
                Math.round(this.R(100, height - 100)), 
                Math.round(this.R(-2.5, 2.5, true)), 
                Math.round(this.R(-2.5, 2.5, true)), 
                this.color
            ))  
    }

}

arrayOfBalls = new CreaterBalls(true, 11).createBalls


function draw() {
    window.requestAnimationFrame(draw)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    arrayOfBalls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.draw();
    
        if (ball.y + ball.vy > canvas.height - 13 || ball.y + ball.vy < 13) {
            ball.vy = -ball.vy;
        }
        
        if (ball.x + ball.vx > canvas.width - 13 || ball.x + ball.vx < 13) {
            ball.vx = -ball.vx;
        }

        arrayOfBalls.map(innerBall => {
            if(innerBall !== ball) {

                const dx = Math.sqrt(Math.abs((ball.x)**2 - (innerBall.x)**2))
                const dy = Math.sqrt(Math.abs((ball.y)**2 - (innerBall.y)**2))
                const dl = Math.sqrt(dx**2 + dy**2)

                if(dl <= 400) {
                    ctx.lineCap = 'round'
                    ctx.beginPath()
                    ctx.lineWidth = 1/dl + 0.01*dl
                    ctx.lineTo(ball.x, ball.y)
                    ctx.lineTo(innerBall.x, innerBall.y)
                    ctx.stroke()
                }

                if(dl <= 100) {

                    const tgCurrent = ball.vy/ball.vx
                    const tgInner = innerBall.vy/innerBall.vx
                
                    if((tgCurrent === tgInner) && (ball.vy !== innerBall.vy)) {
                        ball.vy = -ball.vy
                        ball.vx = -ball.vx
                        innerBall.vy = -innerBall.vy
                        innerBall.vx = -innerBall.vx
                    } 

                    if(dx > dy) {
                        innerBall.vx = -innerBall.vx
                        ball.vx = -ball.vx
                    } else {
                        innerBall.vy = -innerBall.vy
                        ball.vy = -ball.vy
                    }
                     
                }

            }            
        })

    })  

}

window.addEventListener('load', draw)




