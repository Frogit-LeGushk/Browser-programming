function generateCanvas(num = 2) { // max 4 , min 2

    new Array(num).fill('').map((_, index) => {
        const offscreenCanvas = document.getElementById(`canvas${index + 1}`).transferControlToOffscreen();
        const worker = new Worker('worker.js');

        const W = [
            {theme: true, number: 7},
            {theme: false, number: 7},
            {theme: false, number: 7},
            {theme: true, number: 7},  
        ]

        offscreenCanvas.height = window.innerHeight/2
        offscreenCanvas.width = window.innerWidth/4
        worker.postMessage({ offscreenCanvas, ...W[index] }, [offscreenCanvas]);
    })

}

window.addEventListener('load', generateCanvas.bind(this, 4))




















