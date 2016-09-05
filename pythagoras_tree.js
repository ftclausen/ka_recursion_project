var maxIterations = 8;

var lineAngle = function(x, y, angle, length, drawFlag) {
  var asRadians = radians(-angle);
  var newX = x + cos(angle)*length;
  var newY = y - sin(angle)*length;
  if (drawFlag) {
    line(x, y, newX, newY);
  }
  var newCoords = { x: newX, y: newY };
  return newCoords;
};

var pythagorasTree = function(string, currentIteration, subIteration, fromX, fromY, angle, lineLength) {
  var drawFlag = false;
  if (currentIteration > maxIterations) {
    return;
  }
  if (currentIteration === maxIterations) {
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
        var results = pythagorasTree(string, currentIteration, newCoords.x, newCoords.y, angle - 5 , lineLength);
        // We turn left (negative angle) when we return because then we encountered a "]"
        angle -= 22;
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
  return pythagorasTree(newString, currentIteration + 1, width / 3, height, 75, 2.2);
};

/*
axiom:  0
1st recursion:  1[0]0
2nd recursion:  11[1[0]0]1[0]0
3rd recursion:  1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0
*/
stroke(74, 148, 31);
pythagorasTree("0", 0, width / 2, height, 0, 0);
