function PDBlock()
{
var functionID=-1;
var operator=false;
var negative=0;
var number=false;
var masterNumber=false;
var variableID=false;
var justANumber=true; 
var isInitialized=false;	
var blockPointer=false; 
this.setOperator=function(newOperator)  {
if (operator) { 
errorMessage='Error.';
} else {
operator=newOperator;
justANumber=false; 
isInitialized=true;	
}
}
this.getOperator=function()  {
return operator;
}
this.setNumber=function(newNumber)  {
masterNumber=newNumber;
number=newNumber;
isInitialized=true;	
}
this.resetNumber=function(newNumber) { 
masterNumber=newNumber;
number=newNumber;
negative=0;
isInitialized=true;
variableID=false;
}
this.replaceWithPDBlockResult=function(newNumber) { 
masterNumber=newNumber;
number=newNumber;
isInitialized=true;
variableID=false;
}
this.getNumber=function() {
if (variableID!==false) { 
if (negative) {
return (-1*(globalVariableArray[variableID]).getNumber());
}
return (globalVariableArray[variableID]).getNumber();
}
if (negative) {
return (-1*number);
}
return number;
}
this.setBlockNegative=function() {
negative=1;
isInitialized=true;	
}
this.getBlockNegative=function() {
return negative;
}
this.setBlockPointer=function(newBlockPointer) {
blockPointer=newBlockPointer;
isInitialized=true;	
}
this.getBlockPointer=function() {
return blockPointer;
}
this.getMasterNumber=function() {
if (negative) {
return '-'+ masterNumber;
} 
return masterNumber;
}
this.isInitialized=function() {
return isInitialized;
}	
this.isNumberOnly=function() {
if (justANumber && number!==false)
return true;
return false;
}	
this.setFunctionID=function(newFunctionID) {
functionID=newFunctionID;
justANumber=false; 
isInitialized=true;	
}
this.getFunctionID=function() {
return functionID;
}
this.replaceWithResultOfFunction=function(result) {
blockPointer=false;
functionID=-1;
variableID=false;
number=result;
masterNumber=result.toString();
}
this.setVariableID=function(newVariableID) {
variableID=newVariableID;
isInitialized=true;	
}
this.getVariableID=function() {
return variableID;
}
}