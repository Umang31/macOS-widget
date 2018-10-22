function PDFunctionPadButton(newDocumentElement, newOnClickFunction, newTag)
{
var documentElement=newDocumentElement;
var onClickFunction=newOnClickFunction;
var clickShouldFireOnMouseUp=0;
var currentHighlightState=0; 
var tag=newTag;
var defaultClassName="";
var self=this;
this.init=function() {
documentElement.addEventListener("mousedown", self.elementMouseDown);
documentElement.addEventListener("mouseover", self.elementMouseOver);
documentElement.addEventListener("mouseout", self.elementMouseOut);
defaultClassName=documentElement.className;
}
this.elementMouseDown=function() {
window.addEventListener("mouseup", self.elementMouseUp);
clickShouldFireOnMouseUp=1;
currentHighlightState=2;
self.setNeedsDisplay();
}
this.elementMouseOut=function() {
clickShouldFireOnMouseUp=0;
currentHighlightState=0;
self.setNeedsDisplay();
}
this.elementMouseOver=function() {
clickShouldFireOnMouseUp=1;
currentHighlightState=1;
self.setNeedsDisplay();
}
this.elementMouseUp=function() {
window.removeEventListener("mouseup", self.elementMouseUp);
currentHighlightState=1;
self.setNeedsDisplay();
if (clickShouldFireOnMouseUp) {
onClickFunction(tag); 
}
}
this.setNeedsDisplay=function() {
var newClassName=defaultClassName;
if (currentHighlightState==1 || currentHighlightState==2) { 
if (tag<=3) { 
newClassName+=" fPRow1Hover";
} else if (tag<=9) {
newClassName+=" fPRow2Hover";
} else if (tag<=15) {
newClassName+=" fPRow4Hover";
} else if (tag<=27) {
newClassName+=" nPHover";
} else if (tag<=36) {
newClassName+=" oPHover";
}
}
if (currentHighlightState==2) { 
if (tag<=15) {
newClassName+=" fPDown";
} else if (tag<=27) {
newClassName+=" nPDown";
} else if (tag<=36) {
newClassName+=" oPDown";
}
}
documentElement.className=newClassName;
}
this.setTag=function(newTag) {
tag=newTag;
}
this.getTag=function() {
return tag;
}
}
