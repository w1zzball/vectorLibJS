const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const mousePositionInfo = document.getElementById('mouse-position-info');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//vector class
class Vector {
    constructor(x, y) {
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
}

//joint class
class Joint {
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
// joints.push(new Joint(new Vector(canvas.width / 2, canvas.height / 2)));  // Add initial joint at the center
const startingJoint = new Joint(new Vector(canvas.width / 2, canvas.height / 2));
joints.push(startingJoint);  // Add initial joint at the center
let mouseJoint = new Joint(new Vector(1,1));  // Variable to store the joint that is being dragged#
joints.push(mouseJoint);

canvas.addEventListener('mousemove', (event) => {
    mousePositionInfo.innerHTML = `Mouse Position: (${event.x}, ${event.y})`;
    joints[1].vector.x = event.x;
    joints[1].vector.y = event.y;
});


canvas.addEventListener('click', (event) => {
    let mouseVector = new Vector(event.x, event.y);
    const newJoint = new Joint(mouseVector);  // Create new joint
    joints.push(newJoint);  // Add joint to array
});

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    joints.forEach(joint => {
        joint.draw();
    });
    connectJoints(joints);
    requestAnimationFrame(animate);
}
animate();



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



