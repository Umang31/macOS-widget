function PDTextField()
{
var textArea;
var self=this;
var keyDownHandled=0; 
var previousKeyEntered=0; 
var previousKeyTimer=0;
var useMultiplicationDot=0;
var commaLocale=0;
var delegate=0; 
var textFieldModifiedFlag=1; 
var stringSizingDiv;
var lengthToCursorIndex=new Array();
lengthToCursorIndex[0]=0.0;
this.init=function() {
textArea=document.getElementById("formulaTextArea");
stringSizingDiv=document.getElementById("formulaStringSizingDiv");
document.addEventListener("keydown", self.keyDowned, true);
document.addEventListener("keypress", self.keyPressed, true);
textArea.addEventListener("mousedown", self.handleMouseDownEvent, true);
}
this.setCommaLocale=function(newCommaLocale) {
if (newCommaLocale==commaLocale) {
return;
}
commaLocale=newCommaLocale;
if (textArea.value.length) {
if (commaLocale) {
textArea.value=textArea.value.replace(/\./g, ',');
} else {
textArea.value=textArea.value.replace(/,/g, '.');
}
}
}
this.setUseMultiplicationDot=function(newUseMultiplicationDot) {
if (useMultiplicationDot==newUseMultiplicationDot) {
return;
}
useMultiplicationDot=newUseMultiplicationDot;
if (textArea.value.length) {
if (useMultiplicationDot) {
textArea.value=textArea.value.replace(/\*/g, String.fromCharCode(8901)); 
} else {
textArea.value=textArea.value.replace(/\u22C5/g, '*');
}
}
}
this.getUseMultiplicationDot = function() {
return useMultiplicationDot;
}
this.focus=function() {
textArea.focus();
}
this.blur=function() {
textArea.blur();
}
this.insertString=function(stringToInsert) {
var textToChange=textArea.value;
var selectionStart=textArea.selectionStart;
textArea.value=textToChange.substr(0,textArea.selectionStart)+stringToInsert+textToChange.substr(textArea.selectionEnd);
textArea.selectionStart=selectionStart+stringToInsert.length;
textArea.selectionEnd=textArea.selectionStart;
textArea.focus();
self.setTextFieldModifiedFlag(2);
}
self.setTextFieldModifiedFlag=function(newTextFieldModifiedFlag) {
if (textFieldModifiedFlag!=newTextFieldModifiedFlag) { 
textFieldModifiedFlag=newTextFieldModifiedFlag;
if (delegate!=0) { 
delegate.handleTextFieldModifiedFlagDidChange();
}
}
}
this.getTextFieldModifiedFlag=function() {
return textFieldModifiedFlag;
}
this.replaceStringWithString=function(newString) {
textArea.value=newString;
textArea.selectionStart=newString.length;
textArea.selectionEnd=textArea.selectionStart;
textArea.focus();
self.setTextFieldModifiedFlag(2);
}
this.stringValue=function() {
return textArea.value;
}
this.getSelectionLength=function() {
return 0;
}
this.refreshArrayValuesForNewString = function() {
var stringForResizing=textArea.value.replace(/ /g, String.fromCharCode(160));
var i, iLength=textArea.value.length;
var currentChar;
stringSizingDiv.innerHTML='';
for (i=0; i<iLength; i++) {
stringSizingDiv.innerHTML=stringForResizing.substring(0,i+1);
lengthToCursorIndex[i+1]=stringSizingDiv.offsetWidth;
}
}
this.setWidth=function(newWidth) { 
textArea.style.width=newWidth+"px";
return;
var selectionLocation=0; 
var boxOffset=0;
var oldWidth=parseInt(document.getElementById("formulaTextArea").style.width);
var deltaWidth=newWidth-oldWidth;
var mainStringLength=textArea.value.length;
if (deltaWidth==0) { 
return;
}
if (deltaWidth>0 && boxOffset>0 && Math.round(lengthToCursorIndex[mainStringLength]-lengthToCursorIndex[selectionLocation])<newWidth) { 
boxOffset-=deltaWidth; 
if (boxOffset<0) {
boxOffset=0;
}
}
}
this.hideSelectedRange=function() {
}
this.showSelectedRange=function() {
}
this.deleteBackward=function() { 
var textToChange=textArea.value;
var selectionStart=textArea.selectionStart;
if (selectionStart==textArea.selectionEnd) { 
if (selectionStart==0) {
return;
}
textArea.value=textToChange.substr(0,textArea.selectionStart-1)+""+textToChange.substr(textArea.selectionEnd);
textArea.selectionStart=textArea.selectionStart-1;
} else {
textArea.value=textToChange.substr(0,textArea.selectionStart)+""+textToChange.substr(textArea.selectionEnd);
}
textArea.selectionEnd=textArea.selectionStart;
textArea.focus();
self.setTextFieldModifiedFlag(2);
}
this.keyDowned=function(event) {
keyDownHandled=0;
var keyCodeToHandle=0;
if (event.shiftKey) {
switch (event.keyCode) {
case 8: 
keyCodeToHandle=63289;
break;
}
} else {
switch(event.keyCode) {
case 37: case 38: case 39: case 40: case 8: case 46: 
if (textFieldModifiedFlag==0) {
textFieldModifiedFlag=1;
}
break;
}
}
if (keyCodeToHandle!=0) {
self.handleCharCode(keyCodeToHandle);
keyDownHandled=1; 
event.preventDefault();
}
}
this.keyPressed=function(event) {
if (keyDownHandled==1) { 
return;
}
if (event.metaKey) {  
return;
}
if (self.handleCharCode(event.charCode)==1) {
event.preventDefault();
}
}
this.handleCharCode=function(keyPressedCode) {
var stringToAdd="";
var shouldPreventDefault=0;
var addAnswerToEquationIfNecessary=0;
if (keyPressedCode==3 || keyPressedCode==13) {
if (delegate!=0) {
delegate.handleEnterPressed();
}
shouldPreventDefault=1;
} else if (keyPressedCode==63289 || keyPressedCode==27) { 
if (previousKeyEntered==63289 || previousKeyEntered==27) {
if (delegate!=0) {
delegate.handleDoubleClearPressed();
} else { 
self.focus();
}
} else {
self.replaceStringWithString("");
}
shouldPreventDefault=1;
} else { 
switch(keyPressedCode)
{
case 42: 
addAnswerToEquationIfNecessary=1;
if (useMultiplicationDot==1) {
stringToAdd=String.fromCharCode(8901);
}
break;
case 43: case 45: case 47: case 94: case 0: 
addAnswerToEquationIfNecessary=1;
break;
case 44: 
if (commaLocale) {
stringToAdd=','; 
} else { 
stringToAdd='.'; 
}
break;
case 46:
if (commaLocale) {
stringToAdd=','; 
} else { 
stringToAdd='.'; 
}
break;
}
if (textFieldModifiedFlag==0 && addAnswerToEquationIfNecessary==1) {
self.replaceStringWithString("ans");
} else if (textFieldModifiedFlag==0 && keyPressedCode!=32) { 
self.replaceStringWithString("");
}
if (stringToAdd!="") {
self.insertString(stringToAdd);
shouldPreventDefault=1;
}
}
if (keyPressedCode!=3 && keyPressedCode!=13) {
self.setTextFieldModifiedFlag(2);
}
previousKeyEntered=keyPressedCode;
if (previousKeyTimer!=0) {
clearTimeout(previousKeyTimer);
}
previousKeyTimer=setTimeout(self.setPreviousKeyEnteredToZero, 400);
return shouldPreventDefault;
}
this.setPreviousKeyEnteredToZero=function() {
previousKeyEntered=0;
}
this.handleMouseDownEvent=function(event) {
self.setTextFieldModifiedFlag(1);
}
this.setDelegate=function(newDelegate) { 
delegate=newDelegate;
}
this.characterIndexForPointInWindow=function (pointInWindow) {
var boxLeftOrigin=parseInt(window.getComputedStyle(textArea).getPropertyValue("left"));
var boxOffset=0;
var adjustedClickLocationInTextBox=pointInWindow+boxOffset-boxLeftOrigin;
var mainStringLength=textArea.value.length;
if (adjustedClickLocationInTextBox<0.0) { 
return 0;
}
var i;
for (i=mainStringLength-1; i>=0; i--) { 
if (adjustedClickLocationInTextBox>=lengthToCursorIndex[i]) {
return i;
}
}
return 0;
}
this.rangeToSelectFromInitialCharacter=function(initialCharacterIndex) {
var rangeToReturn=new PDRange();
var i, endLocation
var currentCharCode=textArea.value.charCodeAt(initialCharacterIndex);
if (self.textFieldIsVariableDelimiter(currentCharCode)) {
rangeToReturn.location=initialCharacterIndex;
rangeToReturn.length=1;
return rangeToReturn;
}
endLocation=self.nextDelimiterFromInitialLocation(initialCharacterIndex+1)-1;
rangeToReturn.location=self.previousDelimiterFromInitialLocation(initialCharacterIndex-1)+1;
rangeToReturn.length=endLocation-rangeToReturn.location+1;
return rangeToReturn;
}
this.rangeInWindowForSelectedRange=function(selectedRangeToLookAt) {
var rangeToReturn=new PDRange();
var boxLeftOrigin=parseInt(window.getComputedStyle(textArea).getPropertyValue("left"));
var boxOffset=0;
rangeToReturn.location=lengthToCursorIndex[selectedRangeToLookAt.location]-boxOffset+boxLeftOrigin;
rangeToReturn.length=lengthToCursorIndex[selectedRangeToLookAt.location+selectedRangeToLookAt.length]-lengthToCursorIndex[selectedRangeToLookAt.location];
return rangeToReturn;
}
this.nextDelimiterFromInitialLocation=function(initialCharacterIndex) { 
var i, currentCharCode;
var textAreaString=textArea.value;
var mainStringLength=textAreaString.length;
for (i=initialCharacterIndex; i<mainStringLength; i++) {
currentCharCode=textAreaString.charCodeAt(i);
if (self.textFieldIsVariableDelimiter(currentCharCode)) {
return i;
}
}
return mainStringLength;
}
this.previousDelimiterFromInitialLocation=function(initialCharacterIndex) {
var i, currentCharCode;
var textAreaString=textArea.value;
for (i=initialCharacterIndex; i>=0; i--) {
currentCharCode=textAreaString.charCodeAt(i);
if (self.textFieldIsVariableDelimiter(currentCharCode)) {
return i;
}
}
return -1; 
}
this.textFieldIsVariableDelimiter=function(charCodeToCheck) { 
if (charCodeToCheck==42 || charCodeToCheck==43 || charCodeToCheck==45 || charCodeToCheck==47 || charCodeToCheck==94 || charCodeToCheck==37 || charCodeToCheck==8901) {
return 1;
}
if (charCodeToCheck==40 || charCodeToCheck==41 || charCodeToCheck==61 || charCodeToCheck==37 || charCodeToCheck==32 || charCodeToCheck==160) {
return 1;
}
return 0;
}
}
