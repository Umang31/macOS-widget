function PDEHasher() {
var self=this;
var equationBlocks; 
var equationBlockInfo; 
var equationIndentTracker; 
var equationIndentLevel; 
var currentIndex=0; 
var currentSubIndex=0;
var equationPosition=0;
var equationLength=0;
var parseNegativeNumber=0;
var isThereAnError=false;
var errorMessage="";
var equationToHash;
var masterEquation;
var hashingResult;
var isCommaLocale=0;
var preferencesPercentIsModulus=0;
this.resetAndSetUpHashingVariables=function() {
equationBlocks[0]=new Array();
equationBlocks[0][0]=new PDBlock();
equationBlockInfo[0]=new PDBlockInfo();
equationIndentTracker=new Array();
equationIndentTracker[0]=new PDPosition();
equationIndentLevel=0;
currentIndex=0;
currentSubIndex=0;
equationPosition=0;
equationLength=0;
parseNegativeNumber=0;
isThereAnError=false;
errorMessage="";
hashingResult=new PDResult();
}
this.lookForGeneralErrors=function()  {
if (equationToHash=="" || equationToHash==undefined) {
self.setErrorMessage("Nothing to calculate.");
return;
}
if (equationToHash.match(RegExp('\\(\\)'))) { 
self.setErrorMessage("Need arguments in parenthesis.");
return;
}
}
this.prepareEquationForHashing=function() {
self.splitUpEquation(equationToHash);
if (isCommaLocale) { 
equationToHash=equationToHash.replace(/,/g, '.');
}
if (!preferencesPercentIsModulus) { 
equationToHash=equationToHash.replace(/%/g, '/(100)');
}
equationLength=equationToHash.length;
}
this.splitUpEquation=function() {
var equalsLocation=equationToHash.indexOf('='), variableNameToAssign="", equationToHashMaster=equationToHash; 
var variableNameStartLocation=0, variableNameEndLocation, i;
var variableNameToAssignLength;
if (equalsLocation!=-1) { 
if (equalsLocation!=equationToHash.lastIndexOf('=')) {
self.setErrorMessage("More than one equals sign.");
return;
}
if (equalsLocation==equationToHash.length-1) {
self.setErrorMessage("Must have something after equals sign.");
return;
}
variableNameToAssign=equationToHash.substr(0, equalsLocation);
variableNameToAssignLength=variableNameToAssign.length;
equationToHash=equationToHash.substr(equalsLocation);
equationLength=equationToHash.length;
equationPosition=0;
i=0;
while (i<variableNameToAssignLength && isWhitespace(variableNameToAssign.charCodeAt(i))) {
i++;
}
variableNameStartLocation=i;
i=variableNameToAssignLength-1;
while (i>-1 && isWhitespace(variableNameToAssign.charCodeAt(i))) {
i--;
}
variableNameEndLocation=i;
if ((variableNameEndLocation-variableNameStartLocation)<0) {
self.setErrorMessage("Must have a variable before equals sign.");
return;
}
if ((variableNameEndLocation-variableNameStartLocation+1)!=variableNameToAssignLength) {
variableNameToAssign=variableNameToAssign.substr(variableNameStartLocation, variableNameEndLocation-variableNameStartLocation+1);
}
if (!self.isValidVariableDefinitionName(variableNameToAssign)) {
self.setErrorMessageForInvalidVariableName(variableNameToAssign);
return;
}
equationToHash=equationToHashMaster.substring(equalsLocation+1);
equationLength=equationToHash.length;
equationPosition=0;
hashingResult.setVariableNameToAssign(variableNameToAssign);
}
}
this.hashEquation=function(newEquationToHash, equationBlockArrayToUse, equationBlockInfoArrayToUse)  {
equationToHash=newEquationToHash;
equationBlocks=equationBlockArrayToUse;
equationBlockInfo=equationBlockInfoArrayToUse;
self.resetAndSetUpHashingVariables();
self.lookForGeneralErrors();
if (isThereAnError) { 
hashingResult.setErrorMessage(errorMessage);
return hashingResult;
}
self.prepareEquationForHashing();
if (isThereAnError) { 
hashingResult.setErrorMessage(errorMessage);
return hashingResult;
}
var keycode;
masterEquation=equationToHash;
for (equationPosition=0; equationPosition<equationLength; equationPosition++) { 
keycode=equationToHash.charCodeAt(equationPosition);
if ((keycode>47 && keycode<58) || keycode==46) { 
self.parseNumber();
} else if (isOperator(keycode)) { 
self.parseOperator();
} else if (isWhitespace(keycode)) {
self.gobbleWhitespace();
} else { 
self.parseFunctionOrVariable();
}
if (isThereAnError) { 
hashingResult.setErrorMessage(errorMessage);
return hashingResult;
}
}
self.verifyBlockIndent();
if (isThereAnError) { 
hashingResult.setErrorMessage(errorMessage);
return hashingResult;
}
return hashingResult;
}
this.logEquationBlocks=function() {
return;
var i, j;
for (i=0; i<equationBlocks.length; i++) {
for (j=0; j<equationBlocks[i].length; j++) {
}
}
for (i=0; i<equationBlockInfo.length; i++) {
}
}
this.gobbleWhitespace=function() {
if (equationPosition<equationLength && isWhitespace(equationToHash.charCodeAt(equationPosition))) { 
while (equationPosition<equationLength && isWhitespace(equationToHash.charCodeAt(equationPosition))) {
equationPosition++;
}
equationPosition--; 
}
}
this.parseOperator=function() {
var keycode=equationToHash.charCodeAt(equationPosition);
var nonLinkableOperatorCount=0;
var nonLinkableOperator='';
while (isOperator(keycode)) { 
if (keycode==42 || keycode==8901 || keycode==47 || keycode==94 || keycode==37) { 
if (!nonLinkableOperatorCount) { 
if (keycode==8901) {
self.addOperatorToStack('*');
} else {
self.addOperatorToStack(equationToHash.charAt(equationPosition));
}
} else {
self.setErrorMessage('Two operators in a row: '+masterEquation.charAt(equationPosition-1)+masterEquation.charAt(equationPosition));
return;
}
nonLinkableOperatorCount++;
} else if (keycode==41) { 
if (isWhitespace(equationToHash.charCodeAt(equationPosition+1))) {
equationPosition++;
self.gobbleWhitespace();
}
if (isDelimiter(equationToHash.charCodeAt(equationPosition+1)) && equationToHash.charCodeAt(equationPosition+1)!=40 && !nonLinkableOperatorCount) {
self.decrementBlockIndent();
} else {
self.setErrorMessage('Error near ' + masterEquation.charAt(equationPosition) + masterEquation.charAt(equationPosition+1));
return;
}
} else if (keycode==40) { 
if (isWhitespace(equationToHash.charCodeAt(equationPosition+1))) {
equationPosition++;
self.gobbleWhitespace();
}
if (isDelimiter(equationToHash.charCodeAt(equationPosition+1)) && equationToHash.charCodeAt(equationPosition+1)!=40 && equationToHash.charCodeAt(equationPosition+1)!=43 && equationToHash.charCodeAt(equationPosition+1)!=45) {
self.setErrorMessage('Error near ' + masterEquation.charAt(equationPosition) + masterEquation.charAt(equationPosition+1));
return;
} else {
self.incrementBlockIndent();
nonLinkableOperatorCount=0;
}
} else if (keycode==43 || keycode==45) { 		
self.parseNegativeSign();
if (self.currentBlockHasOperator()) {
if (parseNegativeNumber)  {
self.setBlockNegative();
} 
} else {
if (parseNegativeNumber) {
self.addOperatorToStack('-');
} else {
self.addOperatorToStack('+');
}
}
parseNegativeNumber=0;
nonLinkableOperatorCount++;
}
equationPosition++;
keycode=equationToHash.charCodeAt(equationPosition);
if (isWhitespace(keycode)) {
self.gobbleWhitespace();
equationPosition++;
keycode=equationToHash.charCodeAt(equationPosition);
}
}
equationPosition--;
if ((equationPosition+1)==equationLength && equationToHash.charCodeAt(equationPosition)!=41) {
self.setErrorMessage(equationToHash.charAt(equationPosition) +' at end of formula.');
return;
}
}
this.parseFunctionOrVariable=function() {
var answerNumber='';
var currentStackIndex;
var currentString, currentVariableIndex;
var functionIndex;
var nextCharCode=0;
currentString=self.getStringUpToOperator();
functionIndex=widgetController.getEquationController().functionIndexForString(currentString);
if (functionIndex!=-1) { 
if (equationToHash.charCodeAt(equationPosition+1)!=40) { 
self.setErrorMessage("Must have a ( after "+ widgetController.getEquationController().stringForFunctionIndex(functionIndex)+ ".");
return;
}				
if (parseNegativeNumber) {
self.setBlockNegative();
parseNegativeNumber=0;
}
self.setBlockFunction(functionIndex);
} else { 
currentVariableIndex=widgetController.getEquationController().getVariableIndexForName(currentString);
if (currentVariableIndex!=-1) { 
self.addVariableToStack(currentVariableIndex);
if ((equationPosition+1)<equationLength) {
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
if (isWhitespace(nextCharCode)) {
equationPosition++;
self.gobbleWhitespace();
if ((equationPosition+1)<equationLength) {
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
}
if (!isDelimiter(nextCharCode) && nextCharCode!=0) {
self.setErrorMessage("Need operator after "+currentString+".");
return;
}
if (nextCharCode==40) { 
self.setErrorMessage("Can't have ( after "+ currentString+ ".");
return;
}					
} else { 
self.setErrorMessage(currentString + " is not a variable.");
return;
}
}
}
this.parseNegativeSign=function() {
var negativeCount=0;
var currentKeycode=equationToHash.charCodeAt(equationPosition);
while (currentKeycode==43 || currentKeycode==45) {
if (currentKeycode==45) {
negativeCount++;
}
equationPosition++;
currentKeycode=equationToHash.charCodeAt(equationPosition);
if (isWhitespace(currentKeycode)) {
self.gobbleWhitespace();
equationPosition++;
currentKeycode=equationToHash.charCodeAt(equationPosition);
}
}
equationPosition--;
if ((negativeCount%2)) { 
parseNegativeNumber=1;
} else {
parseNegativeNumber=0;
}
}
this.parseNumber=function() {
var currentNumber=equationToHash.charAt(equationPosition);
var nextCharCode=equationToHash.charCodeAt(equationPosition+1);
var currentNumberToAdd='';
var decimalCount=0, exponentCount=0;
var masterNumber;
var typeOfNumber=0, masterNumberLength;
if (currentNumber=='0') { 
if (nextCharCode==66 || nextCharCode==98) { 
equationPosition++;
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
currentNumber="";
while (nextCharCode==48 || nextCharCode==49) {
equationPosition++;
currentNumber=currentNumber+''+equationToHash.charAt(equationPosition);
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
if (currentNumber.length==0) {
self.setErrorMessage("Need binary number after 0b.");
return;
}
if (isWhitespace(nextCharCode)) {
equationPosition++;
self.gobbleWhitespace();
if ((equationPosition+1)<equationLength) {
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
}
if (!isDelimiter(nextCharCode)) {
self.setErrorMessage("Need operator after 0b"+currentNumber+".");
return;
}
currentNumber=parseInt(currentNumber,2);
currentNumber=currentNumber.toString();
self.addNumberToStack(currentNumber);
parseNegativeNumber=0;	
return; 
} else if (nextCharCode==79 || nextCharCode==111) {
equationPosition++;
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
currentNumber="";
while (nextCharCode>47 && nextCharCode<56) {
equationPosition++;
currentNumber=currentNumber+''+equationToHash.charAt(equationPosition);
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
if (currentNumber.length==0) {
self.setErrorMessage("Need octal number after 0o.");
return;
}
if (isWhitespace(nextCharCode)) {
equationPosition++;
self.gobbleWhitespace();
if ((equationPosition+1)<equationLength) {
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
}
if (!isDelimiter(nextCharCode)) {
self.setErrorMessage("Need operator after 0o"+currentNumber+".");
return;
}
currentNumber=parseInt(currentNumber,8);
currentNumber=currentNumber.toString();
self.addNumberToStack(currentNumber);
parseNegativeNumber=0;	
return; 
} else if (nextCharCode==88 || nextCharCode==120) {
equationPosition++;
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
currentNumber="";
while ((nextCharCode>47 && nextCharCode<58) || (nextCharCode>64 && nextCharCode<71) || (nextCharCode>96 && nextCharCode<103)) {
equationPosition++;
currentNumber=currentNumber+''+equationToHash.charAt(equationPosition);
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
if (currentNumber.length==0) {
self.setErrorMessage("Need hexadecimal number after 0x.");
return;
}
if (isWhitespace(nextCharCode)) {
equationPosition++;
self.gobbleWhitespace();
if ((equationPosition+1)<equationLength) {
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
}
if (!isDelimiter(nextCharCode)) {
self.setErrorMessage("Need operator after 0x"+currentNumber+".");
return;
}
currentNumber=parseInt(currentNumber,16);
currentNumber=currentNumber.toString();
self.addNumberToStack(currentNumber);
parseNegativeNumber=0;	
return; 
} else if (nextCharCode!=46) {
if (equationPosition==equationLength-1 || isDelimiter(nextCharCode)) {
} else {
self.setErrorMessage("Need a decimal after a leading zero in a number."); 
return;
}
}
}
if (currentNumber=='.') {
decimalCount++;
}
while ((nextCharCode>47 && nextCharCode<58) || nextCharCode==46 || nextCharCode==101 || nextCharCode==69) {
equationPosition++;
currentNumberToAdd=equationToHash.charAt(equationPosition);
if (currentNumberToAdd=='.') {  
decimalCount++;
if (exponentCount) {	
self.setErrorMessage("Exponent must be an integer."); 
return;
}
} else if (currentNumberToAdd=='e' || currentNumberToAdd=='E') { 
exponentCount++;
if (equationToHash.charCodeAt(equationPosition+1)==45 || equationToHash.charCodeAt(equationPosition+1)==43 ) {
equationPosition++;
self.parseNegativeSign();
if (parseNegativeNumber) {
currentNumberToAdd='e-';
} else {
currentNumberToAdd='e';
}
}
if (equationToHash.charCodeAt(equationPosition+1)<48 || equationToHash.charCodeAt(equationPosition+1)>57 || (equationPosition+1)>=equationLength) { 
self.setErrorMessage("Exponent must be an integer.");
return;
}
}
currentNumber=currentNumber+''+currentNumberToAdd;
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
} 
if (decimalCount>1) {
self.setErrorMessage("Too many decimals.");
return;
}
if (exponentCount>1) {
self.setErrorMessage("Too many exponents.");
return;
}
if (isWhitespace(nextCharCode)) {
equationPosition++;
self.gobbleWhitespace();
if ((equationPosition+1)<equationLength) {
nextCharCode=equationToHash.charCodeAt(equationPosition+1);
}
}
if (!isDelimiter(nextCharCode)) {
self.setErrorMessage("Need operator after "+currentNumber+".");
return;
}
if (currentNumber=='.') {
self.setErrorMessage(". is not a number.");
return;
}
self.addNumberToStack(currentNumber);
parseNegativeNumber=0;	
}
this.getStringUpToOperator=function() {
var stringToReturn='';
while (equationPosition<=equationLength) {
if (isDelimiter(equationToHash.charCodeAt(equationPosition))) {
equationPosition--;
return stringToReturn;
}
stringToReturn=stringToReturn+''+equationToHash.charAt(equationPosition);
equationPosition++;
}
self.setErrorMessage("Parsing error. Please report with the equation.");
return;
}
this.getNumberUpToOperator=function() {
var stringToReturn='';
while (equationPosition<equationLength) {
if (isDelimiter(equationToHash.charCodeAt(equationPosition))) {
return stringToReturn;
} else {
stringToReturn=stringToReturn+''+equationToHash.charAt(equationPosition);
}
equationPosition++;
}
return false;
}
this.addNumberToStack=function(numberToAdd) {	
numberToAdd=parseFloat(numberToAdd);
if (numberToAdd==Infinity || numberToAdd==-Infinity) {
self.setErrorMessage("Large value (>10^309) in equation.");
return;
}
(equationBlocks[currentIndex][currentSubIndex]).setNumber(numberToAdd);
self.addBlankBlockToCurrentStack();
}
this.addVariableToStack=function(currentVariableIndex) {
(equationBlocks[currentIndex][currentSubIndex]).setVariableID(currentVariableIndex);
self.addBlankBlockToCurrentStack();
}
this.addBlankBlockToCurrentStack=function() {
currentSubIndex++;
equationIndentTracker[equationIndentLevel].setCurrentLocation(currentSubIndex);
equationBlocks[currentIndex][currentSubIndex]=new PDBlock();
}
this.addOperatorToStack=function(operatorToAdd) {
if (currentSubIndex==0 && (operatorToAdd=='*' || operatorToAdd=='/')) {
if (equationPosition==0) {
self.setErrorMessage("Can't have "+operatorToAdd+" at beginning of equation.");
return;
}
self.setErrorMessage(operatorToAdd+" near (.");
return;
}
(equationBlocks[currentIndex][currentSubIndex]).setOperator(operatorToAdd);
}
this.setBlockNegative=function() {
(equationBlocks[currentIndex][currentSubIndex]).setBlockNegative();
}
this.setBlockFunction=function(functionIndex) {
(equationBlocks[currentIndex][currentSubIndex]).setFunctionID(functionIndex);
}
this.setCurrentBlockPointer=function(number) {
(equationBlocks[currentIndex][currentSubIndex]).setBlockPointer(number);
}
this.currentBlockHasOperator=function() {
return (equationBlocks[currentIndex][currentSubIndex]).getOperator();
}
this.incrementBlockIndent=function() {
self.addBlankBlockToCurrentStack();
currentSubIndex--;
var parentIndexToSet=currentIndex;
var parentSubIndexToSet=currentSubIndex;
var newBlockIndex;
if (equationBlocks[currentIndex][currentSubIndex].getOperator()==false && currentSubIndex!=0 && equationToHash.charAt(equationPosition-1)!='(' ) {
self.setErrorMessage("Error near "+masterEquation.charAt(equationPosition-1)+"(.");
return;
}
equationIndentLevel++;
equationIndentTracker[equationIndentLevel]=new PDPosition();	
newBlockIndex=equationBlocks.length;
equationBlocks[newBlockIndex]=new Array();
equationBlocks[newBlockIndex][0]=new PDBlock();
self.setCurrentBlockPointer(newBlockIndex);
equationIndentTracker[equationIndentLevel].setMainIndex(newBlockIndex);
equationBlockInfo[newBlockIndex]=new PDBlockInfo();
(equationBlockInfo[newBlockIndex]).setParent(parentIndexToSet);
(equationBlockInfo[newBlockIndex]).setParentSubIndex(parentSubIndexToSet);
currentIndex=newBlockIndex;
currentSubIndex=0;
}
this.decrementBlockIndent=function() {
equationIndentLevel--;
if (equationIndentLevel<0) {
self.setErrorMessage("Unbalanced parenthesis.");
return;
}
currentSubIndex=equationIndentTracker[equationIndentLevel].getCurrentLocation();
currentIndex=equationIndentTracker[equationIndentLevel].getMainIndex();
}
this.verifyBlockIndent=function() {
if (equationIndentLevel!==0) {
self.setErrorMessage('Unbalanced parenthesis.');
}
}
this.isValidVariableDefinitionName=function(variableName) {
if (variableName=='pi' || variableName=='ans') { 
return 0;
}
return isValidVariableName(variableName);
}
this.setIsCommaLocale=function(newIsCommaLocale) {
isCommaLocale=newIsCommaLocale;
}
this.setPreferencesPercentIsModulus=function(newPreferencesPercentIsModulus) {
preferencesPercentIsModulus=newPreferencesPercentIsModulus;
}
this.getPreferencesPercentIsModulus=function() {
return preferencesPercentIsModulus;
}
this.setErrorMessage=function(newErrorMessage) {
errorMessage=newErrorMessage;
isThereAnError=true;
}
this.setErrorMessageForInvalidVariableName=function(variableName) {
var i=0, variableLength=variableName.length, currentKeycode=variableName.charCodeAt(0), alphaCount=0;
if (variableLength===0) {
self.setErrorMessage("Need a variable name before the = sign.");
return;
}
if (currentKeycode>47 && currentKeycode<58) {
self.setErrorMessage("'"+variableName+"' must start with a letter.");
return;
}
if (widgetController.getEquationController().functionIndexForString(variableName)!=-1) {
self.setErrorMessage("'"+variableName+"' is already a function.");
return;
}	
if (variableName=='pi' || variableName=='ans' || variableName=='e' || variableName=='E') {
self.setErrorMessage(variableName+" is a locked variable and can't be assigned.");
return;
}
while (i<variableLength) {
currentKeycode=variableName.charCodeAt(i);
if (currentKeycode>47 && currentKeycode<58) { 
} else if ((currentKeycode>64 && currentKeycode<91) || (currentKeycode>96 && currentKeycode<123) || (currentKeycode>191 && currentKeycode<256 && currentKeycode!=215 && currentKeycode!=237) || (currentKeycode>=1024 && currentKeycode<=1153) || (currentKeycode>=1162 && currentKeycode<=1279)) { 
alphaCount++;
} else {
self.setErrorMessage(variableName+' must be alphanumeric.');
return;	
}	
i++;	
}
if (alphaCount==0) {
self.setErrorMessage('Variables cannot be numbers.');
return;
}
self.setErrorMessage("There has been an internal error, please report the equation.");
}
}
function isWhitespace(operator)
{
if (operator==32) { 
return true;
}
return false;
}
function isDelimiter(operator)
{
if (isOperator(operator) || isNaN(operator) || isWhitespace(operator)) {
return true;
}
return false;
}
function isOperator(operator)
{
if (operator==40 || operator==41 || operator==42 || operator==8901 || operator==43 || operator==45 || operator==47 || operator==94 || operator==37)
return true;
return false;
}
function isVariableDelimiter(operator)
{
if (isDelimiter(operator) || operator==61 || operator==44 || operator==46 || operator==37 || operator==32 || operator==8901) 
return true;
return false;
}
function isValidVariableName(variableName)
{
var i=0, variableLength=variableName.length, currentKeycode=variableName.charCodeAt(0), alphaCount=0;
if (variableLength===0) {
return 0;
}
if (currentKeycode>47 && currentKeycode<58) {
return 0;
}
if (widgetController.getEquationController().functionIndexForString(variableName)!=-1) {
return 0;
}	
while (i<variableLength) {
currentKeycode=variableName.charCodeAt(i);
if (currentKeycode>47 && currentKeycode<58) { 
} else if ((currentKeycode>64 && currentKeycode<91) || (currentKeycode>96 && currentKeycode<123) || (currentKeycode>191 && currentKeycode<256 && currentKeycode!=215 && currentKeycode!=237) || (currentKeycode>=1024 && currentKeycode<=1153) || (currentKeycode>=1162 && currentKeycode<=1279)) { 
alphaCount++;
} else {
return 0;	
}	
i++;	
}
if (alphaCount===0) {
return 0;
}
return 1;
}
