var maxIterations = 8;
var currentIteration = 0;

var pythagorasTree = function(string, subIteration, fromX, fromY, angle) {
	println("pythagorasTree: fromX: " + fromX);
	println("pythagorasTree: fromY: " + fromY);
  // Because processing JS does not seem to like default parameters
  if (!subIteration) {
    currentIteration += 1;
  }
  if (currentIteration > maxIterations) {
    println("Reached max iterations");
    return;
  }
  var currentChar = "";
  var newString = "";
  var newCoords;
  while(string.length > 0) {
    currentChar = string[0];
    switch(currentChar) {
      case "1":
				newCoords = lineAngle(fromX, fromY, angle, 10);
				println("line for 1: " + fromX + ", " + fromY + ", ", "(angle " + angle + ")");
        newString += "11";
        string = string.substring(1);
        break;
      case "0":
				newCoords = lineAngle(fromX, fromY, angle, 10);
				println("line for 0: " + fromX + ", " + fromY + ", ", "(angle " + angle + ")");
        newString += "1[0]0";
        string = string.substring(1);
        break;
      case "[":
        newString += "[";
        string = string.substring(1);
        var results = pythagorasTree(string, true, newCoords.x, newCoords.y, angle - 45);
        string = results.remaining;
        newString += results.transformedText;
        break;
      case "]":
        newString += "]";
        string = string.substring(1);
        // Can't return that object creation in-place, have to assign to variable.
        // Otherwise Processing JS complains about unexpected ";"
        var returnVals = { remaining: string, transformedText: newString };
        return returnVals;
    }
  }
  println(newString);
  return pythagorasTree(newString, false, newCoords.x, newCoords.y, angle);
};

var lineAngle = function(x, y, angle, length) {
	var angleOffset = 90;
	var asRadians = radians(-angle + angleOffset);
	var newX = x + cos(asRadians)*length;
	var newY = y - sin(asRadians)*length;
	println("lineAngle: newX: " + newX);
	println("lineAngle: newY: " + newY);
  line(x, y, newX, newY);
	var newCoords = { x: newX, y: newY };
	println("lineAngle: returning: " + newCoords.x + ", " + newCoords.y);
	return newCoords;
};
/*
axiom:  0
1st recursion:  1[0]0
2nd recursion:  11[1[0]0]1[0]0
3rd recursion:  1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0
*/

size(800, 420);
length = 10;
pythagorasTree("0", false, width / 2, height - length, 0);

/*
var length = 10;
var x1 = width / 2;
var y1 = height;
var x2 = width / 2;
var y2 = height - length;
line(x1, y1, x2, y2);
stroke(19, 48, 237);
lineAngle(x2, y2, 45, length / 2);
lineAngle(x2, y2, -45, length / 2);
*/
