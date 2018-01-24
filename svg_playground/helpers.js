/* 
  Helper functions (no methods).
*/

function processKeyPress(e)
/* 
  The parameter e is a key press event object. Asuumes the game object is named "game".
*/
{
  if (game.ended) // Don't process any key presses (and thus move the paddle) if the game has ended.
    return;
    
  if (e.keyCode === constants.leftArrow)
  {        
    e.preventDefault(); // Do not let the default arrow key behavior migrate to the browser itself.                  
    if (!game.paused) // Don't pause a paused game.
      game.pause(); // Pause the non-paused game.
    return; // Only one key can be pressed at a time, so we can exit now.
  } // Left-arrow key pressed.
  
  if ( (e.keyCode === constants.upArrow) || (e.keyCode === constants.downArrow) )
  {        
    e.preventDefault(); // Do not let the default arrow key behavior migrate to the browser itself.  
    
    // OK to move the paddle by a small amount even if the game is in the paused state:
    if (e.keyCode === constants.upArrow)
      game.paddle.keyMove('U');
    else
      game.paddle.keyMove('D');    
        
    if (game.paused)
    {
      game.start();
      return; // No point in checking the next IF statement since we know the game has already started.
    }                 
  } // Up-arrow key or down-arrow key has been pressed.
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
function processMouseClick()
/* 
  Asuumes the game object is named "game".
*/
{
  if (game.ended)
    return; // The game has ended, don't process any paddle clicks.
                  
  game.paused = !game.paused; // Clicking the paddle either starts, pauses or resumes the game (i.e., clicking the paddle toggles the pause state of the game).           
          
  if (game.paused)
  {
    window.removeEventListener('mousemove', game.paddle.mouseMove, false); // The mouse will no longer move the paddle.
    game.pause();
  }
  else      
  {
    window.addEventListener('mousemove', game.paddle.mouseMove, false); // Move the paddle via vertical mouse movements.      
    game.start();
  }      
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function updateClock(time)
/* 
  Assumes the exists of a number of elements.
*/
{
  var pElementOfClock = document.querySelector('div#clock p'); // Grab the sole <p> element contained within this <div> element.
  
  pElementOfClock.textContent = "Seconds Remaining: " + time; 
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function updateLevel(level)
/* 
  Assumes the exists of a number of elements.
*/
{
  var pElementOfLevel = document.querySelector('div#level p'); // Grab the sole <p> element contained within this <div> element.
  
  pElementOfLevel.textContent = "Level: " + level; 
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function updateMessagingBox(message)   
{
  var pElementOfMessagingBox = document.querySelector('div#messagingBox p'); // Grab the sole <p> element contained within this <div> element.
  
  pElementOfMessagingBox.textContent = message;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function updateScoreBox(score)   
{ 
  var pElementOfScoreBox = document.querySelector('div#score p'); // Grab the sole <p> element contained within this <div> element.
  
  pElementOfScoreBox.textContent = "Score: " + score;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function poofer(ball)
/* 
  This function animates the ball's demise. Assumes the ball has been removed from the ball list (array)
  prior to this function being called.
*/
{
  ball.r.baseVal.value -= constants.poofDelta;
  if (ball_r(ball) <= 0)
  {
    clearInterval(ball.poofID); // Stop invoking the poofer(ball) setInterval() function.
    ball.v = ball.v.multi(0); // Physically stop the ball when it's outside the arena.
    return;
  }
  ball.move(); // Continue to move the "hot" ball in the same direction that it had when it struck the goal until if "poofs" away.
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function svgSupported()
/* 
  Assumes this function is called only after the page has fully loaded. Returns true if SVG is supported on 
  the client, false otherwise.
*/
{
  var svgElementList = document.getElementsByTagName('svg'); // Best to only access the SVG element after the page has fully loaded.
  
  return svgElementList[0].namespaceURI === "http://www.w3.org/2000/svg"; // Returns a Boolean value.
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function getRandomInteger(min, max)
/* 
  Inclusively returns a random integer between min and max. Assumes min < max (min and max need not be 
  integers nor positive). 
  
  As an example, if min = -4 and max = 3, then the returned random value is between -4 and 3. Likewise, if 
  min = -4.1 and max = 3.1, then the returned random value is between -5 and 4.
*/
{
  return Math.floor( Math.random()*(max-min+1) ) + min;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function getRandomReal(min, max)
/* 
  Returns a random real number x such that min <= x < max. Assumes min < max (min and max need not be 
  positive). Note that the returned random value can be very close to max but it will never equal max.
*/
{
  return Math.random()*(max-min) + min;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function getRandomColor()
/*
  Returns and RBG color value string, as in "rgb(120, 70, 255)". Stays away from overly dark and light 
  colors. That is, we avoid RGB values below 30 (i.e., too dark) and RGB values above 230 (i.e., too light).
*/
{      
  var randomColor1 = getRandomInteger(30, 230); // Generates a random integer between 30 and 230.
  var randomColor2 = getRandomInteger(30, 230);
  var randomColor3 = getRandomInteger(30, 230);
              
  return "rgb(" + randomColor1 + ", " + randomColor2  + ", " + randomColor3  + ")";
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function getRandomArenaPosition(ballRadius)
/* 
  Returns a random x-coordinate and y-coordinate such that a circle of radius ballRadius would be contained 
  within the "donut" shaped arena. We use polar coordinates since it significantly simplifies the mathematics, that 
  is x = r*cos(theta) and y = r*sin(theta).
*/
{
  var p = new Point(0, 0); // Create a point object of the form p.x and p.y
  var r = constants.arenaRadius; // r is the radius of the arena circle.
  var allowableRandomRadius; // A random radius such that a ball of radius ballRadius would always fit into the arena (regardless of the random value of allowableRandomRadius).
  var randomTheta; // A random value between 0 and 2Pi radians.
  
  allowableRandomRadius = getRandomInteger(constants.postRadius + ballRadius, r - ballRadius); // Returns a random integer between (constants.postRadius + ballRadius) and (r - ballRadius), that is between the walls of the "donut" shaped arena.
  randomTheta = getRandomReal(0, 2*Math.PI); // Get a random angle, in radians, between 0 and 2Pi (i.e., 360 degrees).
  
  p.x = allowableRandomRadius * Math.cos(randomTheta); // An allowable x-coordinate for a circle of radius ballRadius such that said circle will be contained within the "donut" shaped arena.
  p.y = allowableRandomRadius * Math.sin(randomTheta); // An allowable y-coordinate for a circle of radius ballRadius such that said circle will be contained within the "donut" shaped arena.

  return p; // Returns a point object (as in point.x and point.y).
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */   

function getRandomBallRadius()
/* 
  Returns a random ball radius between constants.minRadius and constants.maxRadius.
*/
{
  return getRandomInteger(constants.minRadius, constants.maxRadius);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function getRandomSpeed()
/* 
  Returns a random positive or negative speed between the given range, in pixels per second. 
*/
{
  var speed = getRandomReal(constants.minSpeed, constants.maxSpeed);
  var sign = getRandomReal(0, 1); // Returns a real value x such that 0 <= x < 1
  
  if (sign < 0.5) // Randomly choose the sign of the speed.
    return -speed;
  else    
    return speed;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function radiusToMass(ballRadius)
/* 
  Based on a ball's radius, returns an appropriate value representing the ball's mass.
*/
{
  var A = Math.PI * (ballRadius*ballRadius); // The area of the ball's circle.
  
  return A; // Return a mass value equal to the ball's area. To force all masses to be the same, return 1 instead of A.
}   

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */    

function s2d(s)
/* 
  The function name "s2d" means "speed to displacement". This function returns the required 
  displacement value for an object traveling at "s" pixels per second. This function assumes the following:
  
     * The parameter s is in pixels per second.
     * "constants.gameDelay" is a valid global constant.
     * The SVG viewport is set up such that 1 user unit equals 1 pixel.      
*/    
{     
  return (s / 1000) * constants.gameDelay; // Given "constants.gameDelay", return the object's displacement such that it will travel at s pixels per second across the screen.
}    
                 
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    
function ball_cx(ball)
/* 
  Returns the x-coordinate of the center of the given ball.
*/
{
  return ball.cx.baseVal.value;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function ball_cy(ball)
/* 
  Returns the y-coordinate of the center of the given ball.
*/    
{
  return ball.cy.baseVal.value;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function ball_r(ball)
/* 
  Returns the radius of the given ball.
*/        
{
  return ball.r.baseVal.value;
}
  
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function affirmingMessage(level)
/* 
  "level" is the current game level.
*/        
{ 
  level = ((level-1) % 7) + 1; // Always keep the local copy of "level" between 1 and 7.
      
  switch (level)
  {
    case 1:
      return "Amazing!";
      break;
    case 2:
      return "Nice!";
      break;
    case 3:
      return "Sweet!";
      break;
    case 4:
      return "Oh Ya!";
      break;
    case 5:
      return "Cha-Ching!";
      break;
    case 6:
      return "Wow!";
      break;
    case 7:
      return "Shazam!";
      break;      
    default:
      alert("Error in affirmingMessage(" + level + ")");
  }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function levelTransitionPause(gameObject)
/* 
  Start up a new game (at the new level) after some numbe of milliseconds.
*/
{
  gameObject.balls.place(); // Place the balls in the "donut" shaped arena.     
  gameObject.start(); // Start the game but at the new level.  
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function coordinateTransform(screenPoint, someSvgObject)
/*
  Given a screen point (of type SVGPoint), returns the point relative to the coordinate system associated with someSvgObject. Assumes someSvgObject is some type of SVG object such as a circle object.
*/
{
  var CTM = someSvgObject.getScreenCTM(); // Get the current transformation matrix (CTM) for someSvgObject. The CTM defines the mapping from the user coordinate system into the viewport coordinate system.

  return screenPoint.matrixTransform( CTM.inverse() ); // Return the point in the coordinate system associated with someSvgObject.
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function F12Log(string)
/* 
  In Internet Explorer, hit F12, then click the Console tab to view the output generated by this function.
*/
{
  if (window.console) // Only write stuff to the Console tab window if the F12 Tools package is running.
    console.log(string);
}

