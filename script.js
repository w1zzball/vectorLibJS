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
    draw(origin, color='white',width=1,scale=1){
        /**  
         * Draw the vector on the canvas
         * @param {Vector} origin - Origin of the vector
         * @param {string} color - Color of the vector
         * @param {number} width - Width of the vector
         * @param {number} scale - Scale of the vector
         */
        ctx.beginPath();
        ctx.moveTo(origin.x,origin.y);
        ctx.lineTo(origin.x+this.x*scale,origin.y+this.y*scale);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }
}
class Joint {
    /**
     * Joint Class
     * @param {*} vector  - Vector object
     * @param {*} radius - Radius of the joint
     */
    constructor(vector, radius=10) {
        this.vector = vector;  // Store the entire vector
        this.radius = radius; 
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2);  
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}


let joints = [];  // Array to store joints
const startingJoint = new Joint(new Vector(canvas.width / 2, canvas.height / 2));
const topJoint = new Joint(new Vector(canvas.width / 2, canvas.height / 2 - 100));  // New joint 100px above
joints.push(startingJoint);  // Add initial joint at the center
joints.push(topJoint);       // Add top joint
const mouseJoint = new Joint(new Vector(1,1));  // Variable to store the joint that is being dragged#
let mouseNormal = new Vector(0, 0);
joints.push(mouseJoint);

calculateNormal = (jointA, jointB) => {
    const normal = jointA.vector.subtract(jointB.vector).normalize();
    return new Vector(normal.y, -normal.x);
}

function calculateCrossVector() {
    // Vector from starting joint to mouse
    const mouseVector = mouseJoint.vector.subtract(startingJoint.vector);
    // Vector from starting joint to top
    const topVector = topJoint.vector.subtract(startingJoint.vector);
    
    // Calculate cross product magnitude (in 2D this is a scalar)
    const crossMagnitude = mouseVector.crossProduct(topVector);
    
    // For visualization, we can return a vector perpendicular to the plane
    return crossMagnitude;
}

canvas.addEventListener('mousemove', (event) => {
    mousePositionInfo.innerHTML = `Mouse Position: (${event.x}, ${event.y})`;
    mouseJoint.vector.x = event.x;
    mouseJoint.vector.y = event.y;
});


canvas.addEventListener('click', (event) => {
    let mouseVector = new Vector(event.x, event.y);
    const newJoint = new Joint(mouseVector);  // Create new joint
    joints.push(newJoint);  // Add joint to array
});

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    joints.forEach(joint => {
        joint.draw();
    });
    let mouseNormal = calculateNormal(startingJoint, mouseJoint);
    connectJoints([topJoint, startingJoint]);  // Modified to include topJoint
    connectJoints([startingJoint, mouseJoint]);  // Modified to include topJoint
    drawPerpendicularLine(startingJoint, mouseJoint);  // Add this line
    
    // Display cross product magnitude
    const crossMagnitude = calculateCrossVector();
    const magnitudeInfo = document.getElementById('magnitude');
    magnitudeInfo.innerHTML = `Cross Product: ${crossMagnitude.toFixed(2)}`;
    
    requestAnimationFrame(animate);
}
animate();

function drawPerpendicularLine(jointA, jointB, length = 100) {
    const normal = calculateNormal(jointA, jointB);
    const midPoint = new Vector(
        (jointA.vector.x + jointB.vector.x) / 2,
        (jointA.vector.y + jointB.vector.y) / 2
    );
    
    const perpEnd = new Vector(
        midPoint.x + normal.x * length,
        midPoint.y + normal.y * length
    );

    ctx.beginPath();
    ctx.moveTo(midPoint.x, midPoint.y);
    ctx.lineTo(perpEnd.x, perpEnd.y);
    ctx.strokeStyle = 'red';  // Different color to distinguish
    ctx.stroke();
}

function connectJoints(joints){
    joints.forEach((jointA, index) => {
        joints[index+1] ? drawLine(jointA, joints[index+1]) : null;
    });

}

function drawLine(jointA, jointB){
    ctx.beginPath();
    ctx.moveTo(jointA.vector.x, jointA.vector.y); 
    ctx.lineTo(jointB.vector.x, jointB.vector.y); 
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

window.addEventListener('resize', ()=> {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});



