import React, { useRef, useEffect, useState } from 'react';
import "./App.css";

const DECIMAL_MULTIPLIER = 100000;
const WIDTH = 800;
const HEIGHT = 800;
const ballRadius = 6;
const obstacleRadius = 4;
const gravity = pad(0.7);
const horizontalFriction = 0.4;
const verticalFriction = 0.6;


function pad(n) {
  return n * DECIMAL_MULTIPLIER;
}

function unpad(n) {
  return Math.floor(n / DECIMAL_MULTIPLIER);
}

const rows = 16;
const obstacles = [];
for (let row = 2; row < rows; row++) {
  const numObstacles = row + 1;
  const y = 0 + row * 35;
  const spacing = 30;
  for (let col = 0; col < numObstacles; col++) {
    const x = WIDTH / 2 - spacing * (row / 2 - col);
    obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius });
  }
}

const sinksmultiplier = [16, 8, 4, 2, 1, 0.5, 0.25, 0.5, 1, 2, 4, 8, 16];
const sinkColors = [
  '#ff0000', // for multiplier 16 (red)
  '#ff6600', // for multiplier 8 (orange)
  '#ffff00', // for multiplier 4 (yellow)
  '#00ff00', // for multiplier 2 (green)
  '#00ffff', // for multiplier 1 (cyan)
  '#0066ff', // for multiplier 0.5 (blue)
  '#8000ff', // for multiplier 0.25 (purple)
  '#0066ff', // for multiplier 0.5 (blue, repeat for second 0.5)
  '#00ffff', // for multiplier 1 (cyan, repeat for second 1)
  '#00ff00', // for multiplier 2 (green, repeat for second 2)
  '#ffff00', // for multiplier 4 (yellow, repeat for second 4)
  '#ff6600', // for multiplier 8 (orange, repeat for second 8)
  '#ff0000'  // for multiplier 16 (red, repeat for second 16)
];
const sinkWidth = 36;
const NUM_SINKS = 13;
const sinks = [];
for (let i = 0; i < NUM_SINKS; i++) {
  const x = WIDTH / 2 + (i - NUM_SINKS / 2) * (sinkWidth) + obstacleRadius;
  const y = HEIGHT - 240;
  const width = sinkWidth;
  const height = width;
  const multiplier = sinksmultiplier[i];
  const color = sinkColors[i];
  sinks.push({ x, y, width, height, multiplier, color });
}

const Simulation = () => {
  const canvasRef = useRef(null);
 
  const [ballPositions, setBallPositions] = useState({});

class Ball {
    constructor(x, y, radius, color) {
      this.x = x;
      this.start=x;
      this.y = y;
      if(x==pad(400)){
          if(Math.random()>0.5){
              x=(400.12);
          }
          else {
              x=(399.12);
          }
  
      }
      this.radius = radius;
      this.color = color;
      this.vx = 0;
      this.vy = 0;
      this.inSink = false; 
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  
    update() {
      this.vy = this.vy + gravity;
      this.x += this.vx;
      this.y += this.vy;
  
      obstacles.forEach(obstacle => {
        const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
     //   console.log(dist)
        if (dist <= pad(this.radius + obstacle.radius)) {
          const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
          
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          this.vx = (Math.cos(angle) * speed * horizontalFriction);
          this.vy = Math.sin(angle) * speed * verticalFriction;
          const overlap = this.radius + obstacle.radius - unpad(dist);
          this.x += pad(Math.cos(angle) * overlap);
          this.y += pad(Math.sin(angle) * overlap);
        }
      });
  
      if (!this.inSink) {
        for (let i = 0; i < sinks.length; i++) {
          const sink = sinks[i];
          if (
            unpad(this.x) > sink.x - sink.width / 2 &&
            unpad(this.x) < sink.x + sink.width / 2 &&
            unpad(this.y) + this.radius > sink.y - sink.height / 2
          ) {
       //     console.log("Sink collision with multiplier:", sink.multiplier);
            setBallPositions(pre => ({
                ...pre,
                [sink.multiplier]: [...(pre[sink.multiplier] || []), (this.start)]
              }));
            this.multiplier=sink.multiplier; 
            this.color = sink.color; 
            this.inSink = true; 
            break; 
          }
        }
      }
    }
  }
   const [balls, setBalls] = useState([new Ball(pad(WIDTH / 2 + 23), pad(50), ballRadius, 'red')]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawObstacles = () => {
      ctx.fillStyle = 'white';
      obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawSinks = () => {
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      sinks.forEach(sink => {
        ctx.fillStyle = sink.color;
        ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - obstacleRadius * 2, sink.height);

        // Determine text color based on background color brightness
        const textColor = isDarkColor(sink.color) ? 'white' : 'black';
        ctx.fillStyle = textColor;
        ctx.fillText(`x${sink.multiplier}`, sink.x + sink.width / 2 - obstacleRadius, sink.y);
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      drawObstacles();
      drawSinks();
      balls.forEach(ball => {
        ball.draw(ctx);
        ball.update();
      });
    };

    const update = () => {
      draw();
      requestAnimationFrame(update);
    };

    update();
  }, [balls]);

    useEffect(() => {
      const interval = setInterval(() => {
       const randomX = Math.floor(pad((Math.random() * (431 - 370) + 370)));
        const randomY = pad(50);
        const newBall = new Ball(randomX, randomY, ballRadius, 'red');
        setBalls(prevBalls => [...prevBalls, newBall]);
     
    
     
      }, 2000); 

      return () => clearInterval(interval);
    }, []);




  const addBall = () => {
    const newBall = new Ball(pad(375), pad(50), ballRadius, 'red');
    setBalls([...balls, newBall]);
  };

  const isDarkColor = (color) => {
    const hex = color.slice(1); 
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000; 
    return brightness < 128; 
  };

  return (
    <div className='flex'>
      <canvas id="gameCanvas" ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
      <div id="add-ball" onClick={addBall} >
        Add Ball
      </div>
      <p>{JSON.stringify(ballPositions)}</p>
    </div>
  );
};

export default Simulation;
