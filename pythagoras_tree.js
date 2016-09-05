var maxIterations = 7;
var currentIteration = 0;

var lineAngle = function(x, y, angle, length, drawFlag) {
	var asRadians = radians(-angle + 90);
	var newX = x + cos(asRadians)*length;
	var newY = y - sin(asRadians)*length;
  if (drawFlag) {
    line(x, y, newX, newY);
  }
	var newCoords = { x: newX, y: newY };
	return newCoords;
};

var pythagorasTree = function(string, subIteration, fromX, fromY, angle, lineLength) {
  var drawFlag = false
  // Because processing JS does not seem to like default parameters
  if (!subIteration) {
    currentIteration += 1;
  }
  if (currentIteration > maxIterations) {
    return;
  }
  if (currentIteration == maxIterations) {
    drawFlag = true;
  }
  var currentChar = "";
  var newString = "";
  var newCoords;
  while(string.length > 0) {
    currentChar = string[0];
    switch(currentChar) {
      case "1":
        newCoords = lineAngle(fromX, fromY, angle, lineLength, drawFlag);
        fromX = newCoords.x;
        fromY = newCoords.y;
        newString += "11";
        string = string.substring(1);
        break;
      case "0":
        newCoords = lineAngle(fromX, fromY, angle, lineLength, drawFlag);
        fromX = newCoords.x;
        fromY = newCoords.y;
        newString += "1[0]0";
        string = string.substring(1);
        break;
      case "[":
        newString += "[";
        string = string.substring(1);
        var results = pythagorasTree(string, true, newCoords.x, newCoords.y, angle + 45, lineLength);
        // We turn left (negative angle) when we return because then we encountered a "]"
        angle -= 45;
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
  // println(newString);
  return pythagorasTree(newString, false, width / 2, 420, 0, 4);
};

/*
axiom:  0
1st recursion:  1[0]0
2nd recursion:  11[1[0]0]1[0]0
3rd recursion:  1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0
*/

size(800, 420);
length = 10;
pythagorasTree("0", false, width / 2, 420, 0, 0);

