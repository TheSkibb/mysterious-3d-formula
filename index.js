console.log(game)

game.width = 800
game.height = 800

const ctx = game.getContext("2d")

const FOREGROUND = "green"
const BACKGROUND = "BLACK"

function clear(){
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({x, y}){
    const s = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

function line(p1, p2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p){
    return {
        x: (p.x+1)/2*game.width,
        y: (1-(p.y+1)/2)*game.height,
    }
}

function project({x, y, z}){
    return {
        x: x/z,
        y: y/z,
    }
}


function translate_z({x, y, z}, dz){
    return {
        x: x,
        y: y, 
        z: z+dz,
    }
}

const vs = [
    {x:  0.25, y:  0.25, z:  0.25},
    {x: -0.25, y:  0.25, z:  0.25},
    {x: -0.25, y: -0.25, z:  0.25},
    {x:  0.25, y: -0.25, z:  0.25},

    {x:  0.25, y:  0.25, z: -0.25},
    {x: -0.25, y:  0.25, z: -0.25},
    {x: -0.25, y: -0.25, z: -0.25},
    {x:  0.25, y: -0.25, z: -0.25},
]

function renderVs(){
    for(const v of vs){
            point(
                screen(
                    project(
                    translate_z(
                    rotate_yz(
                    rotate_xy(
                    rotate_xz(v, angleX), 
                    angleY), 
                    angleZ), dz))))
    }
}

const fs = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

function renderFs(){
    for (const f of fs) {
        for (let i = 0; i < f.length; i++) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(
                screen(
                    project(
                    translate_z(
                    rotate_yz(
                    rotate_xy(
                    rotate_xz(a, angleX), 
                    angleY), 
                    angleZ), dz))),
                screen(
                    project(
                    translate_z(
                    rotate_yz(
                    rotate_xy(
                    rotate_xz(b, angleX),
                    angleY), 
                    angleZ), dz))))
        }
    }

}

function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-z*s,
        y,
        z: x*s+z*c,
    };
    return{x, y, z}
}

function rotate_xy({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-y*s,
        y: x*s+y*c,
        z
    };
}

function rotate_yz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x,
        y: y*s+z*c,
        z: y*c-z*s,
    };
}



//variables for animation
const FPS = 60
let dz = 1
let angleX = 0
let angleY = 0
let angleZ = 0
let running = false

//start playing animation
function frame(){
    console.log(angleX)
    if(!running){
        return
    }
    const dt = 1/FPS
    //dz+=1*dt
    angleX = (angleX + Math.PI*dt)%6
    angleY = (angleY + Math.PI*dt)%6
    angleZ = (angleZ + Math.PI*dt)%6
    clear()
    renderFs()

    setTimeout(frame, 1000/FPS)
}
//controls

function startStopButtonPress(){
    if(!running){
        running = true
        setTimeout(frame, 1000/FPS)
    }else{
        running = false
    }   
}

const XINP = document.getElementById("rotateXInp")
XINP.addEventListener("input", function(){
    console.log(XINP.value/100)
    angleX = XINP.value/100

    clear()
    renderFs()
})

const YINP = document.getElementById("rotateYInp")
YINP.addEventListener("input", function(){
    console.log(YINP.value/100)
    angleY = YINP.value/100

    clear()
    renderFs()
})


const ZINP = document.getElementById("rotateZInp")
ZINP.addEventListener("input", function(){
    console.log(ZINP.value/100)
    angleZ = ZINP.value/100

    clear()
    renderFs()
})


clear()
renderFs()
