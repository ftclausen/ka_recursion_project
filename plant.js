var maxIterations = 6;
var startAngle = 25;
var turnLeftAngle = 20;
var turnRightAngle = 20;

// Wind blown reeds
// s = 25
// left = 25
// right = 10
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

var drawPlant = function(string, currentIteration, fromX, fromY, angle, lineLength) {
  var drawFlag = false; 
  if (currentIteration > maxIterations) {
    return;
  }
  if (currentIteration == maxIterations) {
    drawFlag = true;
  }
  var currentChar = "";
  var newString = "";
  var newCoords;

  var hardStop = 0;
  while(string.length > 0) {
    currentChar = string[0];
    if (hardStop > 1000) {
      println("Crash!");
      return;
    }
    hardStop += 1;
    switch(currentChar) {
      case "X":
        newString += "F-[[X]+X]+F[+FX]-X";
        string = string.substring(1);
        break;
      case "F":
        newCoords = lineAngle(fromX, fromY, angle, lineLength, drawFlag);
        fromX = newCoords.x;
        fromY = newCoords.y;
        newString += "FF";
        string = string.substring(1);
        break;
      case "+":
        angle += turnRightAngle;
        newString += "+";
        string = string.substring(1);
        break;
      case "-":
        angle -= turnLeftAngle;
        newString += "-";
        string = string.substring(1);
        break;
      case "[":
        newString += "[";
        string = string.substring(1);
        var results = drawPlant(string, currentIteration, fromX, fromY, angle, lineLength);
        // We turn left (negative angle) when we return because then we encountered a "]"
        string = results.remaining;
        newString += results.transformedText;
        break;
      case "]":
        newString += "]";
        string = string.substring(1);
        var returnVals = { remaining: string, transformedText: newString };
        return returnVals;
    }
  }
  // println(newString);
  return drawPlant(newString, currentIteration + 1, width / 2, height, startAngle, 3);
};

size(1024, 700);
length = 10;
drawPlant("X", 0, width / 2, height, startAngle, 10);
