# Interactive “Flyglabbet” - Style Simulator
Drawing inspiration from the Flyglabbet section of the Linköping Air Force Museum, this browser?based simulator puts your coordination to the test.
Two movable cursors start at the center of a square playfield.In random intervals, targets appear along each axis—your job is to “lock” a cursor onto its target by holding it there briefly.
# Gameplay Mechanics:
Movement: Calculates velocity proportionally to the mouse’s distance from the center along both the X and Y axes, effectively turning the cursor into a virtual joystick.
Spawning: Targets appear at random grid positions, excluding the center to keep you on your toes.
Collision Timer: Hold the cursor over a target for 0.8?s to score a point and respawn a new target.
Time Pressure: A 30?second countdown pushes you to balance speed and precision.
# Tech Stack & Features:
JavaScript(ES6 +): Game loop with requestAnimationFrame, precise timing, and interval management
HTML5 Canvas & CSS3: Dynamic rendering, responsive design with CSS media queries
# UX Considerations:
Responsive scaling for mobile and desktop
Clear visual feedback on collisions(icon swap, transparency)
Simple “NEW GAME” and “Restart” controls.
# Outcome: 
After the timer hits zero, a printable “receipt” displays your final score.This project demonstrates my ability to design interactive browser experiences,
implement custom game?logic, and ensure responsive behavior across devices. It’s a unique, self?contained demo of real?time user interaction—one I haven’t seen replicated elsewhere.
