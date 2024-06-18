import React, { useRef, useEffect, useState } from 'react';
import "./App.css";
import SliderComponent from './SliderComponent';
const CanvasGame = () => {

  const [dangerLevel, setDangerLevel] = useState(1);
  const sliderRef = useRef(null);
  let count = 0;

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
let obstacleColor = {
  16: "#FFD700",  // Gold
  15: "#FFA500",  // Orange
  14: "#FFFF00",  // Yellow
  13: "#ADFF2F",  // GreenYellow
  12: "#7FFF00",  // Chartreuse
  11: "#00FF00",  // Lime
  10: "#40E0D0",  // Turquoise
  9:  "#00CED1",  // DarkTurquoise
  8:  "#1E90FF",  // DodgerBlue
  7:  "#00BFFF",  // DeepSkyBlue
  6:  "#4682B4",  // SteelBlue
  5:  "#0000FF",  // Blue
  4:  "#8A2BE2",  // BlueViolet
  3:  "#4B0082"   // Indigo
}
for (let row = 2; row < rows; row++) {
  const numObstacles = row + 1;
  const y = 0 + row * 35;
  const spacing = 30;
  for (let col = 0; col < numObstacles; col++) {
    const x = WIDTH / 2 - spacing * (row / 2 - col);
    obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius, color:obstacleColor[row+1] });
  }
}

const sinksmultiplier = [16, 8, 4, 2, 1, 0.5, 0.25, 0.5, 1, 2, 4, 8, 16];
const sinkMultipliers = sinksmultiplier.map((sink)=> {
  sink>1 ? sink= sink*dangerLevel : sink=(sink/dangerLevel).toFixed(2) ;
  return sink;
});

const sinkColors = [
  '#ff0000', 
  '#ff6600', 
  '#ffff00', 
  '#00ff00', 
  '#00ffff', 
  '#0066ff', 
  '#8000ff', 
  '#0066ff', 
  '#00ffff', 
  '#00ff00', 
  '#ffff00', 
  '#ff6600', 
  '#ff0000'  
];
const sinkWidth = 36;
const NUM_SINKS = 13;
const sinks = [];
for (let i = 0; i < NUM_SINKS; i++) {
  const x = WIDTH / 2 + (i - NUM_SINKS / 2) * (sinkWidth) + obstacleRadius;
  const y = HEIGHT - 240;
  const width = sinkWidth;
  const height = width;
  const multiplier = sinkMultipliers [i];
  const color = sinkColors[i];
  sinks.push({ x, y, width, height, multiplier, color });
}

class Ball {
  constructor(x, y, radius, color, original , result) {
    this.x = x;
    this.y = y;
    this.original=original;
    this.result = result ; 
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
          console.log("Sink collision with multiplier:", sink.multiplier);
          this.color = sink.color; 
          this.inSink = true; 
          count++;
          console.log(this)
          setballsinsink((pre)=> ([...pre , this]))
          break; 
        }
      }
    }
  }
}


  const [value,setValue]=useState(0);
  const canvasRef = useRef(null);
  const [balls, setBalls] = useState([]);
  const [ballsinsink, setballsinsink]= useState([]);

  const [ballPositions, setBallPositions] = useState({});
  useEffect(() => {
    ballsinsink.forEach(ball => {
      console.log("Ball is in the sink!");
    });

    if (sliderRef.current) {
      sliderRef.current.scrollTop = sliderRef.current.scrollHeight;
    }
  }, [count,ballsinsink]);
  useEffect(() => {


    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawObstacles = () => {
   
    
      obstacles.forEach(obstacle => {
          ctx.fillStyle = obstacle.color;
        
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
    const updateBallsInSink = () => {
      const ballsInSink = balls.filter(ball => ball.inSink);
      setballsinsink(ballsInSink);
    };
    const update = () => {
      draw();
      requestAnimationFrame(update);
    };

    update();
  }, [balls,dangerLevel]);

//    useEffect(() => {
//      const interval = setInterval(() => {
//       const randomX = pad(Math.floor(Math.random() * (425 - 375 + 1)) + 375);
//        const randomY = pad(50);
//        const newBall = new Ball(randomX, randomY, ballRadius, 'red');
//        setBalls(prevBalls => [...prevBalls, newBall]);
      
//        setBallPositions(prevPositions => {
//          const ballId = Object.keys(prevPositions).length + 1;
//          return { ...prevPositions, [ballId]: [randomX, randomY] };
//        });
//      }, 2000); 

//      return () => clearInterval(interval);
//    }, []);




  const isDarkColor = (color) => {
    const hex = color.slice(1); 
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000; 
    return brightness < 128; 
  };
  const addBall = async () => {
    
    const call = async () => {
      try {
        const response = await fetch('/api/betAmount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ betAmount: value, dangerLevel:dangerLevel })
        });
        const data = await response.json();
        console.log('Result:', data);
        console.log('Bet Amount Multiplied:', data);
        const newBall = new Ball(data.Result.cordinate, pad(50), ballRadius, 'red',value | 0,data.betAmount);
        setBalls((prevBalls) => [...prevBalls, newBall]);
      } catch (error) {
        console.log('Error:', error);
      }
    };

   await call();
  };

  const handleChange = (e)=>{
    setValue(e.target.value);
  }

  const handleSliderChange = (newValue) => {
    setDangerLevel(newValue);
    


};



  return (
    <div className='flex'>
        <div className='flexside'>
            <div className='inputPanel'>
                
         <input className='inpAmount' type='number' min={0} onChange={handleChange}></input>
         <SliderComponent dangerLevel={dangerLevel} onSliderChange={handleSliderChange} />
         
         <div id="add-ball" onClick={addBall} >
        Add Ball
      </div>
            </div>
         <div>
              <canvas id="gameCanvas" ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>  
         </div>
      
        </div>
       
      
        <div className="scoreboard" ref={sliderRef}>
         { ballsinsink.length==0 && <h2>Scoreboard</h2>}
        {ballsinsink.map((ball, index) => (
          <div className="score-item" key={index}>
            <div className="score-original">
              {ball.original}
            </div>
            <div className={`score-result ${ball.result > ball.original ? 'green' : ball.result < ball.original ? 'red' : 'blue'}`}>
              {ball.result}
            </div>
          </div>
        ))}
    </div>


    </div>
  );
};

export default CanvasGame;
