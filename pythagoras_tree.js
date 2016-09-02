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

/*
axiom:  0
1st recursion:  1[0]0
2nd recursion:  11[1[0]0]1[0]0
3rd recursion:  1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0
*/

pythagorasTree("0");