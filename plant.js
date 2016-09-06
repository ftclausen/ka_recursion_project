/*
 * For this submission I have created my own implementation of the Fractal  * plant shown here:
 *
 * https://en.wikipedia.org/wiki/L-system#Example_7:_Fractal_plant
 *
 * This is an L-system with the following set up
 *
 * variables: X F (these are transformed by the rules)
 * constants: + - [ ] (These are not transformed by the rules but indicate angle and branching)
 * start: X (the first value)
 * rules (how things are transformed): (X → F−[[X]+X]+F[+FX]−X), (F → FF)
 * angle: Adjustable - 20 degrees results in a nice plant but playing with it is quite fun too and can make the plant look suitably windswept.
 *
 * where
 *
 *  F : Draw forward
 *  - : Turn left by an angle
 *  + : Turn right by an angle
 *  X : Does not correspond to any drawing action; it controls how the branches
 *      are made
 *  [ : Recurse and draw items within "[" according to the rules. Create a
 *      branch effectively
 *  ] : Return from recursion thereby restoring previous position and angle
 *
 * I am sure my implementation can be made shorter and more elegant but it
 * seems to work. For example I'm calculating the drawing instructions for
 * each iteration but only actually drawing in the last iteration.
 *
 */

// How many times to we want to iterate and apply the rules.
var maxIterations = 6;
// The base of the "plant" will be - adjust according to where it leans
var startXPosition = width / 1.1;
// The angle at which the main "stem" will lean
var startAngle = 120;
// Turn left by this amount when encountering a "-"
var turnLeftAngle = 20;
// Turn right by this amount when encountering a "+"
var turnRightAngle = 20;
// How long do we make each line segment
var lineLength = 2.5;

/*
 * We'd like to draw a line at an angle relative to the previously drawn
 * line. For this we'll use trigonometric functions which I read up on 
 * from here: https://processing.org/tutorials/trig/
 *
 * Reading that will make the below make more sense
 */
var lineAtAngle = function(x, y, angle, length, drawFlag) {
  /* We can view are new line as follows
   * 1. Our new line is essentially the hypotenuse
   * 2. The x coordinate is solving for the adjacent line length
   * 3. The y coordinate is solving for the opposite line length
   * 4. We add the existing x and y to the resulting values from steps
   *    #1 and #2 to obtain the end point of our new line. Thereby
   *    drawing the hypotenuse.
   */    
  var newX = x + cos(angle) * length;
  var newY = y - sin(angle) * length;
  // We only actually draw during the last iteration
  if (drawFlag) {
    line(x, y, newX, newY);
  }
  // And return our new coordinates that we build on top of
  // This is done as an ad-hoc object for easy de-referencing
  var newCoords = { x: newX, y: newY };
  return newCoords;
};

/*
 * Main function to actually draw the plant and construct the L-system 
 * "production string".
 * We construct the string from 0 to last-1 iterations. Then on the last 
 * iteration we draw the resultant string.
 */
var drawPlant = function(string, currentIteration, fromX, fromY, angle, lineLength) {
  // We only want to draw on the last iteration
  var drawFlag = false; 
  if (currentIteration > maxIterations) {
    return;
  }
  // OK, if we're on the last iteration then let's finally draw this thing
  if (currentIteration === maxIterations) {
    drawFlag = true;
  }

  // I'm pre-declaring some variables we'll be re-using extensively in the   // hopes that makes things run faster. 
  // 
  // The new string being constructed by appling the transformation rules 
  // in the switch statement
  var newString = "";
  // The new endpoint of the current branch after a new line has been 
  // drawn at an angle
  var newCoords;
  // Loop until we've processed all chars in the string
  while(string.length > 0) {
    switch(string[0]) {
      case "X":
        // Apply the "X" transformation by appending the result 
        // to the new string
        newString += "F-[[X]+X]+F[+FX]-X";
        // And remove the processed char from the old string 
        // by slicing everything from char 1 onwards 
        // (thereby excluding char 0)
        string = string.substring(1);
        break;
      case "F":
        // The "F" L-System instruction, in this case, means move forward 
        // and draw a line at the current angle
        newCoords = lineAtAngle(fromX, fromY, angle, lineLength, drawFlag);
        fromX = newCoords.x;
        fromY = newCoords.y;
        // Apply the "F" transformation
        newString += "FF";
        // Again, remove already processed char
        string = string.substring(1);
        break;
      case "+":
        // The "+" L-system instruction is not to draw anything but 
        // rather to turn left at a given angle (in degrees). So we add 
        // that to the angle.
        angle += turnLeftAngle;
        // Add to new string and remove from old as before
        newString += "+";
        string = string.substring(1);
        break;
      case "-":
        // Similarly to the "+" the "-" turns right by a given angle. We 
        // subtract from the current angle to accomplish this.
        angle -= turnRightAngle;
        newString += "-";
        string = string.substring(1);
        break;
      case "[":
        // The "[" instruction is where we recurse down a new "branch" on 
        // the plant.This is like a mini version of the greater L-system 
        // where we apply all the same rules
        //
        // As before add the symbol to the new string being created
        newString += "[";
        // Again, remove processed symbol from old string
        string = string.substring(1);
        // And now recurse from this point using the snapshot of angle and
        // x, y positions as they are now
        var results = drawPlant(string, currentIteration, fromX, fromY, angle, lineLength);
        // When we return from recursing (after having finished a branch 
        // of the tree) we can then update the old string with what's left         // after the branch has been processed.
        string = results.remaining;
        // And also take the transformed branch text from that recursion 
        // and append to new string
        newString += results.transformedText;
        break;
      case "]":
        // This is our cue to return from this branch. So append the "]" 
        // to the new string
        newString += "]";
        // Remove the now processed "]"`
        string = string.substring(1);
        // Finally we recurn what remains of the unprocessed string as 
        // well as what we've actually processed. This will allow 
        // drawPlant() to continue smoothly.
        var returnVals = { remaining: string, transformedText: newString };
        return returnVals;
    }
  }
  // Uncomment to see the L-system alphabetical instructions grow
  // println(newString);
  // And now perform a whole new iteration
  return drawPlant(newString, currentIteration + 1, startXPosition, height, startAngle, lineLength);
};

// Nice blue background with 70% opacity
background(135, 206, 250, 70);
// Green plant
stroke(87, 133, 61);
// Start with the "axiom" or initial value of "X" and apply the 
// transformations recursively from there.
// The startAngle and lineLength don't actually matter here since we only
// draw on the last iteration
drawPlant("X", 0, width / 3, height, startAngle, lineLength);
