function PDFormulaScrollerController()
{
var scrollbackArray;
var currentIndex;
var justCalculatedEquation=0;
var self = this;
this.init=function() {
scrollbackArray = new Array();
scrollbackArray[0]="";
currentIndex=0;
}
this.addCalculatedString=function(calculatedString) {
scrollbackArray[scrollbackArray.length-1]=calculatedString;
currentIndex=scrollbackArray.length-1; 
scrollbackArray[scrollbackArray.length]=""; 
}
this.stringForPreviousIndexFromString=function(potentiallyModifiedString) {
if (currentIndex==0) { 
return null;
}
scrollbackArray[currentIndex]=potentiallyModifiedString
currentIndex--;
return scrollbackArray[currentIndex];
}
this.stringForNextIndexFromString=function(potentiallyModifiedString) {
if (currentIndex==(scrollbackArray.length-1)) { 
return null;
}
if (justCalculatedEquation) {
currentIndex=scrollbackArray.length-1; 
} else {
scrollbackArray[currentIndex]=potentiallyModifiedString;
currentIndex++;
}
return scrollbackArray[currentIndex];
}
this.incrementCurrentIndexToLastIndex=function() {
currentIndex=scrollbackArray.length-1;
}
this.setJustCalculatedEquation=function(newJustCalculatedEquation) {
justCalculatedEquation=newJustCalculatedEquation;
}
this.reset=function() {
scrollbackArray = new Array();
scrollbackArray[0]="";
currentIndex=0;
justCalculatedEquation=0;
}
}