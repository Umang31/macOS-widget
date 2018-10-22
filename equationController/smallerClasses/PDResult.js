function PDResult()
{
var number=0;
var isErrorMessage=false, isAnswerSet=false;
var errorMessage="";
var variableToAssign=-1; 
var variableNameToAssign=""; 
var equationIndex=-1;
this.setNumber=function(newNumber) {
number=newNumber;
}
this.getNumber=function() {
return number;
}
this.setIsAnswerSet=function(newIsAnswerSet) {
isErrorMessage=newIsErrorMessage;
}
this.getIsAnswerSet=function() {
return isAnswerSet;
}
this.setVariableNameToAssign=function(newVariableNameToAssign) {
variableNameToAssign=newVariableNameToAssign;
}
this.getVariableNameToAssign=function() {
return variableNameToAssign;
}
this.setVariableToAssign=function(newVariableToAssign) {
variableToAssign=newVariableToAssign;
}
this.getVariableToAssign=function() {
return variableToAssign;
}
this.setEquationIndex=function(newEquationIndex) {
equationIndex=newEquationIndex;
}
this.getEquationIndex=function() {
return equationIndex;
}
this.setIsErrorMessage=function(newIsErrorMessage) {
isErrorMessage=newIsErrorMessage;
}
this.getIsErrorMessage=function() {
return isErrorMessage;
}
this.setErrorMessage=function(newErrorMessage) {
errorMessage=newErrorMessage;
isErrorMessage=true;
}
this.getErrorMessage=function() {
return errorMessage;
}
}
