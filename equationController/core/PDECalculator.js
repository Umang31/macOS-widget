function PDECalculator() {
var self=this;
var equationBlocks;
var equationBlockInfo;
var calculationResult;
var isThereAnError=false;
var errorMessage="";
var preferencesRadians=1;
this.resetAndSetUpCalculationVariables=function() {
calculationResult=new PDResult();
isThereAnError=false;
errorMessage="";
}
this.calculateEquationBlocks=function(equationBlocksToCalculate, equationBlockInfoToCalculate) {
equationBlocks=equationBlocksToCalculate;
equationBlockInfo=equationBlockInfoToCalculate;
self.resetAndSetUpCalculationVariables();
var i, tempNumericalAnswer;
for (i=equationBlocks.length-1; i>-1; i--) {
self.reduceFunctionsInBlock(i);
self.reduceExponentsInBlock(i);
self.reduceMDASInBlock(i);	
self.replaceBlockInParent(i);
if (isThereAnError) { 
calculationResult.setErrorMessage(errorMessage);
return calculationResult;
}
}
tempNumericalAnswer=equationBlocks[0][0].getNumber();
if (isNaN(tempNumericalAnswer)) {
self.setErrorMessage("NaN (or possibly an imaginary number).");
} else if (tempNumericalAnswer===false) {
self.setErrorMessage("NaN (or possibly very large).");
} else if (tempNumericalAnswer=="Infinity") {
self.setErrorMessage("Answer is greater than ~10^308.");
}	
if (isThereAnError) { 
calculationResult.setErrorMessage(errorMessage);
return calculationResult;
}
calculationResult.setNumber(tempNumericalAnswer);
return calculationResult;
}
this.calculateEquation=function() {
}
this.reduceExponentsInBlock=function(blockNumber) {
var exponentArray=new Array(), j=0, initialExponentIndex, runningTotal;
var negativeArray=new Array();
for (i=0; i<equationBlocks[blockNumber].length; i++) {
while ((equationBlocks[blockNumber][i]).getOperator()=='^') {
if (!j) { 
initialExponentIndex=i-1; 
exponentArray[j]=(equationBlocks[blockNumber][initialExponentIndex]).getNumber();
negativeArray[j]=(equationBlocks[blockNumber][initialExponentIndex]).getBlockNegative();
j++;
}
exponentArray[j]=(equationBlocks[blockNumber][i]).getNumber();
negativeArray[j]=(equationBlocks[blockNumber][i]).getBlockNegative();
j++;
i++;
}
if (j) { 
j=exponentArray.length-1;
runningTotal=exponentArray[j];			
for (j=j-1; j>-1; j--) {
if (negativeArray[j]) {
runningTotal=-1*Math.pow(-1*exponentArray[j], runningTotal);
} else {
runningTotal=Math.pow(exponentArray[j], runningTotal);
}
}
if (!isFinite(runningTotal)) {
self.setErrorMessage("Exponent near "+exponentArray[0]+"^"+exponentArray[1]+" is greater than ~10^308.");
runningTotal=0; 
return;
}
j=exponentArray.length;
(equationBlocks[blockNumber][initialExponentIndex]).resetNumber(runningTotal);
(equationBlocks[blockNumber]).splice(initialExponentIndex+1, j-1);
i=initialExponentIndex;
exponentArray=new Array();
j=0;
}
}
}
this.reduceFunctionsInBlock=function(blockNumber) {
var i, functionNumber, currentNumber, currentMasterNumber, result, currentPointer;
var currentStackIndex, currentNumber;
for (i=0; i<equationBlocks[blockNumber].length; i++) {
functionNumber=(equationBlocks[blockNumber][i]).getFunctionID();
if (functionNumber!=-1) { 
currentPointer=(equationBlocks[blockNumber][i]).getBlockPointer(); 
if ((equationBlockInfo[currentPointer].getReducedToNumber())) { 
currentNumber=(equationBlocks[currentPointer][0]).getNumber();
currentMasterNumber=(equationBlocks[currentPointer][0]).getMasterNumber();
result=self.calculatePDFunction(currentNumber, currentMasterNumber, functionNumber);
(equationBlocks[blockNumber][i]).replaceWithResultOfFunction(result);
} 
}
}
}
this.reduceMDASInBlock=function(blockNumber) {
var currentNumber, nextNumber, currentOperator, nextOperator;
var mDRunningComputation, runningComputation=0, i=0;
for (i=0; i<equationBlocks[blockNumber].length-1; i++) {
currentNumber=(equationBlocks[blockNumber][i]).getNumber();
currentOperator=(equationBlocks[blockNumber][i]).getOperator();
nextNumber=(equationBlocks[blockNumber][i+1]).getNumber();
nextOperator=(equationBlocks[blockNumber][i+1]).getOperator();
if ((nextOperator=='+' || nextOperator=='-' || !nextOperator) && (currentOperator=='+' || currentOperator=='-' || !currentOperator)) {
if (currentOperator=='+' || !currentOperator) { 
runningComputation+=currentNumber; 
} else if (currentOperator=='-') { 
runningComputation-=currentNumber; 
}
} else if (nextOperator=='*' || nextOperator=='/' || nextOperator=='%') { 
mDRunningComputation=currentNumber;
while (nextOperator=='*' || nextOperator=='/' || nextOperator=='%') { 
nextNumber=(equationBlocks[blockNumber][i+1]).getNumber();
nextOperator=(equationBlocks[blockNumber][i+1]).getOperator();
i++;
if (nextOperator=='*') { 
mDRunningComputation*=nextNumber;
} else if (nextOperator=='/') {
mDRunningComputation=mDRunningComputation/nextNumber;
} else if (nextOperator=='%') {
mDRunningComputation=mDRunningComputation%nextNumber;
}
}
i--; 
if (currentOperator=='+' || !currentOperator) {
runningComputation+=mDRunningComputation;
} else if (currentOperator=='-') {
runningComputation-=mDRunningComputation;
}
}
}
i=equationBlocks[blockNumber].length;
(equationBlocks[blockNumber][0]).resetNumber(runningComputation);
(equationBlocks[blockNumber]).splice(1, i-2);
(equationBlockInfo[blockNumber]).setReducedToNumber(true);
}
this.replaceBlockInParent=function(blockNumber) {
var parent=equationBlockInfo[blockNumber].getParent();
var parentSubIndex=equationBlockInfo[blockNumber].getParentSubIndex();
if (parent!==false && (equationBlocks[parent][parentSubIndex]).getFunctionID()==-1) {
equationBlocks[parent][parentSubIndex].replaceWithPDBlockResult(equationBlocks[blockNumber][0].getNumber());		
}
}
this.calculatePDFunction=function(currentNumber, currentMasterNumber, functionNumber) {
var result, tempRoundingNumber;
if (!preferencesRadians) {
if (functionNumber==2 || functionNumber==3 || functionNumber==4 || functionNumber==6 || functionNumber==7 || (functionNumber>=10 && functionNumber<=16)) {
currentNumber=currentNumber*Math.PI/180;
}
}
switch(functionNumber) {
case 0:
result=Math.abs(currentNumber);
break;
case 1:
result=Math.exp(currentNumber);
break;
case 2:
result=self.formatTrigFunction(Math.sin(currentNumber));
break;
case 3:
result=self.formatTrigFunction(Math.cos(currentNumber));
break;
case 4:
result=self.formatTrigFunction(Math.tan(currentNumber));
break;
case 5:
result=Math.sqrt(currentNumber);
break;
case 6: 
result=(Math.exp(currentNumber)-Math.exp(-currentNumber))/2;
break;
case 7: 
result=(Math.exp(currentNumber)+Math.exp(-currentNumber))/2;
break;
case 8: 
if (currentNumber==0) {
self.setErrorMessage("Cannot take ln() of 0.");
} else if (currentNumber<0) {
self.setErrorMessage("Cannot take ln() of a negative number.");
}
result=Math.log(currentNumber);
break;
case 9: 
if (currentNumber==0) {
self.setErrorMessage("Cannot take log() of 0.");
} else if (currentNumber<0) {
self.setErrorMessage("Cannot take log() of a negative number.");
}
result=Math.log(currentNumber)/Math.LN10;
break;
case 10: 
result=(Math.exp(currentNumber)-Math.exp(-currentNumber))/(Math.exp(currentNumber)+Math.exp(-currentNumber));
break;
case 11: 
result=1/self.formatTrigFunction(Math.sin(currentNumber));
break;
case 12: 
result=1/self.formatTrigFunction(Math.cos(currentNumber));
break;
case 13: 
result=1/Math.tan(currentNumber);
break;
case 14: 
result=2/(Math.exp(currentNumber)-Math.exp(-currentNumber));
break;
case 15: 
result=2/(Math.exp(currentNumber)+Math.exp(-currentNumber));
break;
case 16: 
result=(Math.exp(currentNumber)+Math.exp(-currentNumber))/(Math.exp(currentNumber)-Math.exp(-currentNumber));
break;
case 17:
result=Math.asin(currentNumber);
break;
case 18:
result=Math.acos(currentNumber);
break;
case 19:
result=Math.atan(currentNumber);
break;
case 20:
if (currentNumber<0) { 
result=-1*Math.pow(-1*currentNumber, 1/3);
} else {
result=Math.pow(currentNumber, 1/3);
}
break;
case 21:
currentNumber=widgetController.getNumberFormatter().getNoiselessNumberForNumber(currentNumber);
result=Math.floor(currentNumber);
break;	
case 22:
currentNumber=widgetController.getNumberFormatter().getNoiselessNumberForNumber(currentNumber);
result=Math.ceil(currentNumber);
break;	
case 23:
currentNumber=widgetController.getNumberFormatter().getNoiselessNumberForNumber(currentNumber);
result=Math.round(currentNumber);
break;	
}
if (!preferencesRadians) { 
if (functionNumber>=17 && functionNumber<=19) {
result=result*180/Math.PI;
}
}
return result;
}
this.formatTrigFunction=function(trigcalctemp) {
var trigcalcfinal=trigcalctemp;
var zerotolerance=1e-13;
if (trigcalctemp<=zerotolerance && trigcalctemp>=-zerotolerance) { 
trigcalcfinal=0;
} else if (trigcalctemp<=1+zerotolerance && trigcalctemp>=1-zerotolerance) {
trigcalcfinal=1;
}
return trigcalcfinal;
}
this.setErrorMessage=function(newErrorMessage) {
errorMessage=newErrorMessage;
isThereAnError=true;
}
this.setPreferencesRadians=function(newPreferencesRadians) {
preferencesRadians=newPreferencesRadians;
}
this.getPreferencesRadians=function() {
return preferencesRadians;
}
}
