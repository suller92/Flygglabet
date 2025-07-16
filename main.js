//Interactive “Flyglabbet” ? Style Simulator
//
// Drawing inspiration from the Flyglabbet section of the Linköping Air Force Museum, this browser?based simulator puts your coordination to the test.
// Two movable cursors start at the center of a square playfield.In random intervals, targets appear along each axis—your job is to “lock” a cursor onto its target by holding it there briefly.
//
// Gameplay Mechanics:
// Movement: Calculates velocity proportionally to the mouse’s distance from the center along both the X and Y axes, effectively turning the cursor into a virtual joystick.
// Spawning: Targets appear at random grid positions, excluding the center to keep you on your toes.
// Collision Timer: Hold the cursor over a target for 0.8?s to score a point and respawn a new target.
// Time Pressure: A 30?second countdown pushes you to balance speed and precision.
//
// Tech Stack & Features:
// JavaScript(ES6 +): Game loop with requestAnimationFrame, precise timing, and interval management
// HTML5 Canvas & CSS3: Dynamic rendering, responsive design with CSS media queries
//
// UX Considerations:
// Responsive scaling for mobile and desktop
// Clear visual feedback on collisions(icon swap, transparency)
// Simple “NEW GAME” and “Restart” controls.
//
// Outcome: After the timer hits zero, a printable “receipt” displays your final score.This project demonstrates my ability to design interactive browser experiences,
// implement custom game?logic, and ensure responsive behavior across devices. It’s a unique, self?contained demo of real?time user interaction—one I haven’t seen replicated elsewhere.

    document.addEventListener('DOMContentLoaded', function () {

        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");
        const gamearea = document.getElementById('game-area');
        const squareX = document.getElementById('squareX');
        const squareY = document.getElementById('squareY');
        const targetX = document.getElementById('targetX');
        const targetY = document.getElementById('targetY');
        const showTimer = document.getElementById('timeCounter');
        const startBtn = document.getElementById('start-btn');
        const restartBtn2 = document.getElementById('restartBtn2');

        // GAME AREA SIZE / POSITIONING
        const gameareaWidth = gamearea.clientWidth; // WIDTH of game area
        const gameareaHeight = gamearea.clientHeight; // HEIGHT of game area
        const centerX = gamearea.clientWidth / 2; // X-AXIS CENTER
        const centerY = gamearea.clientHeight / 2; // Y-AXIS CENTER
        const recInX = gameareaWidth / squareX.offsetWidth; // SQUARES that fit on X-AXIS
        const recInY = gameareaWidth / squareX.offsetWidth; // SQUARES that fit on Y-AXIS

        // POSITION / VELOCITY
        let velocityX = 0;
        let velocityY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;

        // TIME VARIABLES
        let lastTime = performance.now();
        let startTime = 0; // Track when the game starts
        let accumulatedElapsed = 0; // Track paused time
        let defaultGameTime = 30; // Default game time in seconds
        let previousRemainingSeconds = defaultGameTime; // Track last displayed second

        let intervalStartX;
        let intervalStartY;
        // START/STOP
        let gameActive = false;
        let score = 0;

        // TARGETS SETUP
        let spawnedX = false;
        let spawnedY = false;
        let targetXonColision = false;
        let targetYonColision = false;
        let timerXActive = false;
        let timerYActive = false;
        let tidX; // Track interval till scoring point on Y axis
        let tidY; // Track interval till scoring point on X axis

    squareX.style.left = (centerX + "px");
    squareX.style.top = (centerY + "px");
    squareY.style.left = (centerX + "px");
    squareY.style.top = (centerY + "px");

    targetX.style.left = (centerX + "px");
    targetX.style.top = (centerY + "px");
    targetY.style.left = (centerX + "px");
    targetY.style.top = (centerY + "px");

    // GAME ACTIVE - START
    startBtn.addEventListener("click", (e) => {

        gameActive = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        startTime = performance.now(); // RESET TIMER
        accumulatedElapsed = 0;
        score = 0; // RESET SCORE
        startBtn.classList.replace('overflow-visible','d-none');
        startBtn.classList.replace('z-3','z-n1');

        // SPAWN CHECK - START
        intervalStartX = setInterval(checkSpawnedX, 100);
        intervalStartY = setInterval(checkSpawnedY, 100);
    });

        // TIMMING
        function updateTimerDisplay(remainingSeconds) {
        const displayText = remainingSeconds < 10
        ? `00:0${remainingSeconds} | Points: ${score}`
        : `00:${remainingSeconds} | Points: ${score}`;
        showTimer.innerText = displayText;
    };

    // RESTART
    restartBtn.addEventListener('click', () => {
        handleGameOver();
    });
    restartBtn2.addEventListener('click', () => {
        handleGameOver();
    });
        // GAME OVER
    function handleGameOver() {
        clearInterval(intervalStartX);
        clearInterval(intervalStartY);
        gameActive = false;
        spawnedX = false;
        spawnedY = false;
        showTimer.innerText = "00:00 | Points: " + score;
        startBtn.classList.replace('d-none', 'overflow-visible');
        startBtn.classList.replace('z-n1', 'z-3');
        previousRemainingSeconds = 30;

        squareX.style.left = (centerX + "px");
        squareX.style.top = (centerY + "px");
        squareY.style.left = (centerX + "px");
        squareY.style.top = (centerY + "px");

        targetX.style.left = (centerX + "px");
        targetX.style.top = (centerY + "px");
        targetY.style.left = (centerX + "px");
        targetY.style.top = (centerY + "px");
    };

    //// MOUSE
    gamearea.addEventListener('mousemove', (e) => {
        if (!gameActive) return;

        // CALCULATE POSITION
        const rect = gamearea.getBoundingClientRect();
        const gameareaTop = e.clientY - rect.top;
        const gameareaLeft = e.clientX - rect.left;
        let deltaX = gameareaLeft - centerX;
        let deltaY = gameareaTop - centerY;

        // MOVEMENT XY
        velocityX = -deltaX;
        velocityY = -deltaY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
     
    });

    // COLLISION TIMER
         function startCollisionTimerY()
         {
             timerYActive=true;
             tidY = setInterval(function()
             {
                   squareY.classList.remove('fa-solid');
                   squareY.classList.remove('fa-crosshairs');
                   squareY.classList.remove('bg-transparent');
                   targetY.classList.add('d-none');
                   spawnedY = false;
                   timerYActive=false;
                   score++;
                   clearInterval(tidY);
             }, 800);
         };

       function startCollisionTimerX()
       {
            timerXActive=true;
            tidX = setInterval(function()
            {
                  squareX.classList.remove('fa-solid');
                  squareX.classList.remove('fa-crosshairs');
                  squareX.classList.remove('bg-transparent');
                  targetX.classList.add('d-none');
                  spawnedX = false;
                  timerXActive=false;
                  score++;
                  clearInterval(tidX);
            }, 800);
       };

    // SPAWN TARGETS X/Y
        function checkSpawnedX()
            {
              
            if (spawnedX) {return;}
            else {
                  const minCeiled = Math.ceil(1);
                  const maxFloored = Math.floor(recInX);
                  const positionTargetX = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
                  let spawnPointX = positionTargetX * squareX.offsetWidth;

                if (spawnPointX < (centerX + (squareX.offsetWidth / 2)) && spawnPointX > (centerX - (squareX.offsetWidth / 2))) // Prevent middle spawn
                {
                    const res = Math.random() > 0.5 ? squareX.offsetHeight : -squareX.offsetHeight;
                    spawnPointX += res;
                } 

                 targetX.style.left = spawnPointX + 'px';
                 targetX.classList.remove('d-none');
                 spawnedX = true;
                 }
                 return;
        };

          function checkSpawnedY()
          { 
              if (spawnedY) {return;}
              else {
                   const minCeiled = Math.ceil(1);
                   const maxFloored = Math.floor(recInY);
                   const positionTargetY = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
                   let spawnPointY = positionTargetY * squareY.offsetHeight;

                  if (spawnPointY < (centerY + (squareY.offsetHeight / 2)) && spawnPointY > (centerY - (squareY.offsetHeight / 2))) // Prevent middle spawn
                  {
                      const res = Math.random() > 0.5 ? squareY.offsetHeight : -squareY.offsetHeight;
                      spawnPointY += res;
                  } 

                   targetY.style.top = spawnPointY + 'px';
                   targetY.classList.remove('d-none');
                   spawnedY = true;
              }
               return;
         };
        
    // GAME LOOP - POSITION
    function gameLoop(time) {
      if (gameActive) {

         let dt = (time - lastTime) / 50; // delta time sec
         const currentTime = performance.now();
         const elapsed = (currentTime - startTime - accumulatedElapsed) / 1000;
         const remainingSeconds = Math.max(0, Math.floor(defaultGameTime - elapsed));

          if (remainingSeconds !== previousRemainingSeconds) {
             updateTimerDisplay(remainingSeconds);
             previousRemainingSeconds = remainingSeconds;
          }

         // GAME OVER CHECK / CONTINUE GAME LOOP
          if (elapsed >= defaultGameTime) {
              handleGameOver();
          }

          // GET POSITION
          let posX = parseFloat((squareX.style.left) || 0);
          let posY = parseFloat((squareY.style.top) || 0);

          // POSITION BASED ON SPEED
          posX += velocityX * dt;
          posY += velocityY * dt;

          // LIMIT GAME AREA
          posX = Math.max(0, Math.min(gameareaWidth - squareX.offsetWidth, posX));
          posY = Math.max(0, Math.min(gameareaHeight - squareY.offsetHeight, posY));

          // UPDATE POSITION
          squareX.style.left = posX + 'px';
          squareY.style.top = posY + 'px';

                // SIMPLIFIED COLISION CALC X
         let sqXl = squareX.getBoundingClientRect().left;
         let tgtXl = targetX.getBoundingClientRect().left;
         let tgtXw = targetX.offsetWidth;
                // SIMPLIFIED COLISION CALC Y
         let sqYt = squareY.getBoundingClientRect().top;
         let tgtYt = targetY.getBoundingClientRect().top;
         let tgtYh = targetY.offsetHeight;

         // CHECK COLLISION X
          if ((sqXl + tgtXw) > tgtXl && (sqXl - tgtXw) < tgtXl){
                targetXonColision=true;
                squareX.classList.add('fa-solid');
                squareX.classList.add('fa-crosshairs');
                squareX.classList.add('bg-transparent');
                   if(!timerXActive){
                       startCollisionTimerX();
                       timerXActive=true;
                       };      
          }
          else {
                targetXonColision = false;
                if(timerXActive){
                                clearInterval(tidX); 
                                timerXActive = false;
                                squareX.classList.remove('fa-solid');
                                squareX.classList.remove('fa-crosshairs');
                                squareX.classList.remove('bg-transparent');
                                }
          }

         // CHECK COLLISION Y
           if ((sqYt + tgtYh) > tgtYt && (sqYt - tgtYh) < tgtYt){
                 targetYonColision=true;
                 squareY.classList.add('fa-solid');
                 squareY.classList.add('fa-crosshairs');
                 squareY.classList.add('bg-transparent');
                    if(!timerYActive){
                        startCollisionTimerY();
                        timerYActive=true;
                        };
           }
           else {
                 targetYonColision = false;
                 if(timerYActive){
                                 clearInterval(tidY);
                                 timerYActive = false;
                                 squareY.classList.remove('fa-solid');
                                 squareY.classList.remove('fa-crosshairs');
                                 squareY.classList.remove('bg-transparent');
                                 }
              }         
       }
      lastTime = time;
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
});
