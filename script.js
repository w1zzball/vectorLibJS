const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const mousePositionInfo = document.getElementById('mouse-position-info');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//vector class
class Vector {
    /**
     * 
     * @param {*} x  - x coordinate of the vector
     * @param {*} y  - y coordinate of the vector
     */
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }
    static sumOf(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    static difference(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }
    static dot(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
    static cross(vector1, vector2) {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);  // Return new vector instead of modifying
    }
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);  // Return new vector instead of modifying
    }
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const magnitude = this.magnitude();
        if (magnitude === 0) {
            return new Vector(0, 0);  // Return zero vector if magnitude is zero
        }
        return new Vector(this.x / magnitude, this.y / magnitude);
    }
    dotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    crossProduct(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    angleBetween(vector) {
        const mag1 = this.magnitude();
        const mag2 = vector.magnitude();
        if (mag1 === 0 || mag2 === 0) {
            return 0;  // Return 0 if either vector has zero magnitude
        }
        return Math.acos(this.dotProduct(vector) / (mag1 * mag2));
    }
    /**
     * Draws a line from the given origin to the current vector position.
     *
     * @param {Vector} [origin=new Vector(0, 0)] - The starting point of the line.
     * @param {string} [color='white'] - The color of the line.
     * @param {number} [width=1] - The width of the line.
     * @param {number} [scale=1] - The scale factor for the line.
     */
    draw(origin = new Vector(0, 0), color='white', width=1, scale=1){

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(this.x, this.y);  // Draw directly to mouse coordinates instead of offset
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }
}

const mouseVector = new Vector(0,0);
const center = new Vector(canvas.width/2, canvas.height/2);
let joints = [];  // Array to store joints


canvas.addEventListener('mousemove', (event) => {
    mousePositionInfo.innerHTML = `Mouse Position: (${event.x}, ${event.y})`;
    mouseVector.x = event.x;
    mouseVector.y = event.y;
});


function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0)';//clear canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCircle(mouseVector, 10, 'red');
    mouseVector.draw(center, 'white', 1, 1);
    
    requestAnimationFrame(animate);
}
animate();


function connectVectors(jointA, jointB){
    const vector = jointB.vector.subtract(jointA.vector);
    vector.draw(jointA.vector);
}


window.addEventListener('resize', ()=> {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function drawCircle(vector, radius, color){
    ctx.beginPath();
    ctx.arc(vector.x, vector.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

