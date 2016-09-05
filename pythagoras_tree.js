var maxIterations = 3;
var currentIteration = 0;

var pythagorasTree = function(string, subIteration) {
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
  while(string.length > 0) {
    currentChar = string[0];
    switch(currentChar) {
      case "1":
        newString += "11";
        string = string.substring(1);
        break;
      case "0":
        newString += "1[0]0";
        string = string.substring(1);
        break;
      case "[":
        newString += "[";
        string = string.substring(1);
        var results = pythagorasTree(string, true);
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
  return pythagorasTree(newString);
};

void lineAngle(int x, int y, float angle, float length) {
	var angleOffset = 90;
	var asRadians = radians(-angle + angleOffset);
  line(x, y, x+cos(asRadians)*length, y-sin(asRadians)*length);
}
/*
axiom:  0
1st recursion:  1[0]0
2nd recursion:  11[1[0]0]1[0]0
3rd recursion:  1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0
*/

size(640, 480);
// pythagorasTree("0");

var length = 10;
var x1 = width / 2;
var y1 = height;
var x2 = width / 2;
var y2 = height - length;
line(x1, y1, x2, y2);
stroke(19, 48, 237);
lineAngle(x2, y2, 45, length / 2);
lineAngle(x2, y2, -45, length / 2);
