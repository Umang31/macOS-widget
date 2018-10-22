function PDQuickLookController()
{
var formulaIsTheSameSinceLastCall=0; 
var self=this;
var hasMainField=1; 
var mainString="";
var rangeInWindow=new PDRange();
var quickLookTextForDisplay="";
var isCurrentlyActive=0;
var currentClickLocationInWindow;
var canvas;
var quickLookTextDiv;
this.init=function() {
canvas=document.getElementById("quickLookCanvas");
quickLookTextDiv=document.getElementById("quickLookTextDiv");
}
this.windowDidChangeSize=function() { 
}
this.handleVariableHighlightMouseMove=function(event) { 
currentClickLocationInWindow=event.pageX;
if (isCurrentlyActive && formulaIsTheSameSinceLastCall && clickLocationInWindow>=rangeInWindow.location && clickLocationInWindow<=(rangeInWindow.location+rangeInWindow.length)) { 
return;
}
self.handleVariableHighlightMouseMoveForNewFormula(currentClickLocationInWindow);
}
this.handleVariableHighlightMouseMoveForNewFormula=function(clickLocationInWindow) { 
if (!formulaIsTheSameSinceLastCall) {
mainString=widgetController.getMainTextField().stringValue();
}
var mouseOverCharacterIndex=widgetController.getMainTextField().characterIndexForPointInWindow(clickLocationInWindow);
var selectedRange=widgetController.getMainTextField().rangeToSelectFromInitialCharacter(mouseOverCharacterIndex);
var currentQuickLookText=mainString.substr(selectedRange.location, selectedRange.length);
var newIsCurrentlyActive=1; 
if (currentQuickLookText.length==1 && widgetController.getMainTextField().textFieldIsVariableDelimiter(currentQuickLookText)) { 
newIsCurrentlyActive=0;
}
if (!widgetController.getEquationController().isValidVariableName(currentQuickLookText)) {
newIsCurrentlyActive=0;
}
if (!newIsCurrentlyActive) { 
self.hideQuickLook(); 
return;
}
var currentVariableIndex=widgetController.getEquationController().getVariableIndexForName(currentQuickLookText);
var currentVariable;
var quickLookDisplayText="";
var formattedNumber;
if (currentVariableIndex==-1) {
quickLookTextForDisplay=currentQuickLookText+" = undefined";
} else {
currentVariable=globalVariableArray[currentVariableIndex];
formattedNumber=widgetController.getNumberFormatter().formattedNumberForNumber(currentVariable.getNumber());
quickLookTextForDisplay=currentQuickLookText+" = "+formattedNumber;
}
rangeInWindow=widgetController.getMainTextField().rangeInWindowForSelectedRange(selectedRange);
isCurrentlyActive=1;
self.displayQuickLook();
}
this.displayQuickLook=function() {
var frontViewSize=widgetController.getWidgetFrontController().getFrontViewSize();
var currentWidth=frontViewSize.width-73;
canvas.width=currentWidth;
quickLookTextDiv.style.width=currentWidth+"px";
var context=canvas.getContext("2d");
var canvasOffsetInWindow=26;
context.clearRect(0, 0, currentWidth, 60);
var startLocation=Math.round(rangeInWindow.location)-canvasOffsetInWindow;
var endLocation=Math.round(rangeInWindow.location+rangeInWindow.length)-canvasOffsetInWindow;
context.fillStyle = "rgba(42, 42, 42, 0.90)"; 
var drawingRadius=3.0;
var boxYOrigin=0.0;
var boxHeight=19.0;
var bottomRadius=5.0;
var bottomBoxXOrigin=0.0;
var bottomBoxYOrigin=boxYOrigin+boxHeight;
var bottomBoxHeight=30.0;
var bottomBoxWidth=currentWidth;
var drawBottomLeftToTopLeftRadii=true;
var drawTopRightToBottomRightRadii=true;
if (startLocation<0) { 
startLocation=0;
}
if (endLocation>currentWidth) { 
endLocation=currentWidth;
}
if (startLocation<=drawingRadius*2) {
bottomBoxXOrigin=startLocation;
bottomBoxWidth-=startLocation;
drawBottomLeftToTopLeftRadii=false;
}
if (endLocation>=(currentWidth-drawingRadius*2)) {
bottomBoxWidth=endLocation-bottomBoxXOrigin;
drawTopRightToBottomRightRadii=false;
}
context.beginPath();  
context.moveTo(startLocation+drawingRadius,boxYOrigin);  
context.arc(endLocation-drawingRadius, boxYOrigin+drawingRadius, drawingRadius, 3*Math.PI/2, 0, false); 
if (drawTopRightToBottomRightRadii) {
context.arc(endLocation+drawingRadius, boxYOrigin+boxHeight-drawingRadius, drawingRadius, Math.PI, Math.PI/2, true); 
context.arc(bottomBoxXOrigin+bottomBoxWidth-bottomRadius, bottomBoxYOrigin+bottomRadius, bottomRadius, 3*Math.PI/2, 0, false); 
}
context.arc(bottomBoxXOrigin+bottomBoxWidth-bottomRadius, bottomBoxYOrigin+bottomBoxHeight-bottomRadius, bottomRadius, 0, Math.PI/2, false); 
context.arc(bottomBoxXOrigin+bottomRadius, bottomBoxYOrigin+bottomBoxHeight-bottomRadius, bottomRadius, Math.PI/2, Math.PI, false); 
if (drawBottomLeftToTopLeftRadii) {
context.arc(bottomBoxXOrigin+bottomRadius, bottomBoxYOrigin+bottomRadius, bottomRadius, Math.PI, 3*Math.PI/2, false); 
context.arc(startLocation-drawingRadius, boxYOrigin+boxHeight-drawingRadius, drawingRadius, Math.PI/2, 0, true); 
}
context.arc(startLocation+drawingRadius, boxYOrigin+drawingRadius, drawingRadius, Math.PI, 3*Math.PI/2, false); 
context.closePath();
context.fill();  
quickLookTextDiv.innerHTML=quickLookTextForDisplay;
canvas.style.visibility="visible";
quickLookTextDiv.style.visibility="visible";
widgetController.getMainTextField().hideSelectedRange();
}
this.hideQuickLook=function() { 
isCurrentlyActive=0;
canvas.style.visibility="hidden";
quickLookTextDiv.style.visibility="hidden";
}
this.endQuickLook=function() { 
if (isCurrentlyActive==0) { 
return;
}
self.hideQuickLook();
widgetController.getMainTextField().showSelectedRange();
formulaIsTheSameSinceLastCall=0;
}
this.handleFormulaDidChange=function() { 
formulaIsTheSameSinceLastCall=0;
if (isCurrentlyActive) { 
self.handleVariableHighlightMouseMoveForNewFormula(currentClickLocationInWindow);
}
}
this.setIsCurrentlyActive=function(newIsCurrentlyActive) {
isCurrentlyActive=newIsCurrentlyActive;
}
this.getIsCurrentlyActive=function() {
return isCurrentlyActive;
}
}
