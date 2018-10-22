var globalVariableArray=new Array();
var globalVariableNamesArray=new Array();
function PDEquationController() {
var self=this;
var equationHasher;
var equationCalculator;
var currentAnswerNumber=1;
var formulaArray;
var functionArray;
var resultsArray;	
var preferencesRadians=1;
var preferencesPercentIsModulus=0;
var preferencesIsCommaLocale=0;
this.init=function() { 
self.setVariable('pi', Math.PI, 1);
self.setVariable('ans', 0, 2);
currentAnswerNumber=1;
equationHasher=new PDEHasher();
equationCalculator=new PDECalculator();
functionArray=new Array("abs", "exp", "sin", "cos", "tan", "sqrt", "sinh", "cosh", "ln", "log", "tanh", "csc", "sec", "cot", "csch", "sech", "coth", "asin", "acos", "atan", "cbrt", "floor", "ceil", "round");
formulaArray=new Array();
resultsArray=new Array();
}
this.clearAll=function() {
globalVariableArray=new Array();
globalVariableNamesArray=new Array();
formulaArray=new Array();
resultsArray=new Array();
self.setVariable('pi', Math.PI, 1);
self.setVariable('ans', 0, 2);
currentAnswerNumber=1;
}
this.addString=function(stringToAdd) {
var hashingResult, calculationResult;
var equationBlocks=new Array();
var equationBlockInfo=new Array(); 
var currentEquationIndex=self.addFormulaToFormulaArray(stringToAdd);		
hashingResult=equationHasher.hashEquation(stringToAdd, equationBlocks, equationBlockInfo);
if (hashingResult.getIsErrorMessage()) { 
hashingResult.setEquationIndex(currentEquationIndex);
resultsArray.push(hashingResult);
return hashingResult;
}
calculationResult=equationCalculator.calculateEquationBlocks(equationBlocks, equationBlockInfo);
if (calculationResult.getIsErrorMessage()) { 
calculationResult.setEquationIndex(currentEquationIndex);
resultsArray.push(calculationResult);
return calculationResult;
}
var variableNameToAssign=hashingResult.getVariableNameToAssign();
var variableIDToAssign;
var resultNumber=calculationResult.getNumber();
calculationResult.setVariableNameToAssign(variableNameToAssign);
if (variableNameToAssign!="") {
variableIDToAssign=self.setVariable(variableNameToAssign, resultNumber, 3);
calculationResult.setVariableToAssign(variableIDToAssign);
} else { 
self.unconflictCurrentAnswerNumber();
variableIDToAssign=self.setVariable('ans'+currentAnswerNumber, resultNumber, 2);
calculationResult.setVariableToAssign(variableIDToAssign);
currentAnswerNumber++;
}
self.setVariable('ans', resultNumber, 2);
calculationResult.setEquationIndex(currentEquationIndex);
resultsArray.push(calculationResult);
return calculationResult;
}
this.getNumberOfEquations=function() {
return formulaArray.length;
}
this.getLastResult=function() { 
var i;
if (resultsArray.length) {
return resultsArray[resultsArray.length-1];
}
return -1;
}
this.getEquationStringForEquationIndex=function(equationIndexToGet) { 
if (isNaN(equationIndexToGet) || equationIndexToGet<0 || equationIndexToGet>=formulaArray.length) {
return null;
}
return formulaArray[equationIndexToGet];
}
this.addFormulaToFormulaArray=function(newFormula) {
var newLength;
if (newFormula!="") {
newLength=formulaArray.push(newFormula);
return newLength-1;
}
return -1;
}
this.setVariable=function(currentVariableName, currentVariableValue, currentVariableType) { 
var currentVariableIndex=self.getVariableIndexForName(currentVariableName);
if (currentVariableIndex==-1) { 
currentVariableIndex=globalVariableArray.length;
globalVariableArray[currentVariableIndex]=new PDVariable();
globalVariableNamesArray[currentVariableIndex]=currentVariableName;
}
globalVariableArray[currentVariableIndex].setNumber(currentVariableValue);
if (currentVariableType>0) { 
globalVariableArray[currentVariableIndex].setType(currentVariableType);
}
return currentVariableIndex;
}
this.getVariableIndexForName=function(variableName) {
var i=globalVariableNamesArray.length-1;
if (variableName=="pi" && globalVariableNamesArray.length>0) {
return 0;
}
if (variableName=="ans" && globalVariableNamesArray.length>1) {
return 1;
}
while (i>1) {
if (globalVariableNamesArray[i]==variableName) {
return i;
}
i--;			
}
return -1;
}
this.isValidVariableName=function(variableName) {
return isValidVariableName(variableName);
}
this.unconflictCurrentAnswerNumber=function() { 
var currentString='ans'+currentAnswerNumber;
var i, iLength=globalVariableNamesArray.length;
for (i=0; i<iLength; i++) {
if (globalVariableNamesArray[i]==currentString) {
currentAnswerNumber++;
currentString='ans'+currentAnswerNumber;
i=-1;
}
}
}
this.functionIndexForString=function(functionString) {
var functionIndex=-1;
var i, functionArrayLength;
if (functionString=="") {
return -1;
}
functionArrayLength=functionArray.length;
for (i=0; i<functionArrayLength; i++) {
if (functionArray[i]==functionString) {
return i;
}
}
return -1;	
}
this.stringForFunctionIndex=function(functionIndex) {
return functionArray[functionIndex];
}
this.setPreferencesRadians=function(newPreferencesRadians) {
preferencesRadians=newPreferencesRadians;
equationCalculator.setPreferencesRadians(newPreferencesRadians);
}
this.getPreferencesRadians=function() {
return preferencesRadians;
}
this.setPreferencesPercentIsModulus=function(newPreferencesPercentIsModulus) {
preferencesPercentIsModulus=newPreferencesPercentIsModulus;
equationHasher.setPreferencesPercentIsModulus(newPreferencesPercentIsModulus);
}
this.getPreferencesPercentIsModulus=function() {
return preferencesPercentIsModulus;
}
this.setCommaLocale=function(newIsCommaLocale) {
if (newIsCommaLocale==preferencesIsCommaLocale) {
return;	
}
preferencesIsCommaLocale=newIsCommaLocale;
equationHasher.setIsCommaLocale(preferencesIsCommaLocale);
}
}
