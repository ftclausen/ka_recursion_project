var axiom = "X";
var coloured = true;
var maxIterations = 6;
var startAngle = 25;
var turnLeftAngle = 15; 
var turnRightAngle = 15;

// Wind blown reeds
// start = 25
// left = 25
// right = 10
// "Regular" reed
// start = 25
// left = 20
// right = 20
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

var drawPlant = function(string, currentIteration, fromX, fromY, angle, lineLength, forwardCount) {
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

  while(string.length > 0) {
    currentChar = string[0];
    switch(currentChar) {
      case "X":
        newString += "F-[[X]+X]+F[+FX]-X";
        string = string.substring(1);
        break;
      case "F":
        forwardCount += 0.9;
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
        if (coloured) {
          stroke(165, 42 + forwardCount, 42);
        }
        var results = drawPlant(string, currentIteration, fromX, fromY, angle, lineLength, forwardCount);
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
  return drawPlant(newString, currentIteration + 1, width / 2, height, startAngle, 3, 0);
};

size(1024, 700);
length = 10;
background(135, 206, 250, 70);
stroke(87, 133, 61);
strokeWeight(1.6);
drawPlant(axiom, 0, width / 2, height, startAngle, 10, 0);
