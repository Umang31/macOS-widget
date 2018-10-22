function PDButton(newText, newDocumentElement, newOnClickFunction, newImageName, newImageNameDown, newClassRegular, newClassDown)
{
var text=newText;
var documentElement=newDocumentElement;
var onClickFunction=newOnClickFunction;
var imageName=newImageName;
var imageNameDown=newImageNameDown;
var classRegular=newClassRegular;
var classDown=newClassDown;
var labelElement=0;
var activeElement=0; 
var mouseIsOver=0;
var isCheckbox=0;
var isChecked=0;
var imageNameChecked="";
var imageNameDownChecked="";
var classChecked="";
var classCheckedDown="";
var isImageButton=0; 
var tag=0;
var isVisible=1;
var self=this;
this.init=function() {
documentElement.addEventListener("mousedown", self.elementMouseDown);
if (text!="") {
documentElement.innerHTML=text;
}
self.cacheImages();
self.setNeedsDisplay(0);
}
this.makeButtonCheckbox=function(newIsChecked, newImageNameChecked, newImageNameDownChecked, newClassChecked, newClassCheckedDown) {
isCheckbox=1;
isChecked=newIsChecked;
imageNameChecked=newImageNameChecked;
imageNameDownChecked=newImageNameDownChecked;
classChecked=newClassChecked;
classCheckedDown=newClassCheckedDown;
}
this.registerForMultipleClicks=function() {
documentElement.addEventListener("dblclick", self.elementDoubleClick);
}
this.setLabelElement=function(newLabelElement) {
labelElement=newLabelElement;
labelElement.addEventListener("mousedown", self.labelElementMouseDown);
}
this.labelElementMouseDown=function() {
window.addEventListener("mouseup", self.elementMouseUp);
labelElement.addEventListener("mouseout", self.elementMouseOut);
labelElement.addEventListener("mouseover", self.elementMouseOver);
self.setNeedsDisplay(1);
mouseIsOver=1;
activeElement=1;
}
this.elementMouseDown=function() {
window.addEventListener("mouseup", self.elementMouseUp);
documentElement.addEventListener("mouseout", self.elementMouseOut);
documentElement.addEventListener("mouseover", self.elementMouseOver);
self.setNeedsDisplay(1);
mouseIsOver=1;
activeElement=0;
}
this.elementMouseOut=function() {
self.setNeedsDisplay(0);
mouseIsOver=0;
}
this.elementMouseOver=function() {
self.setNeedsDisplay(1);
mouseIsOver=1;
}
this.elementMouseUp=function() {
window.removeEventListener("mouseup", self.elementMouseUp);
if (activeElement==0) {
documentElement.removeEventListener("mouseout", self.elementMouseOut);
documentElement.removeEventListener("mouseover", self.elementMouseOver);
} else {
labelElement.removeEventListener("mouseout", self.elementMouseOut);
labelElement.removeEventListener("mouseover", self.elementMouseOver);
}
if (mouseIsOver) {
if (isCheckbox) { 
if (isChecked==0) {
isChecked=1;
} else {
isChecked=0;
}
}
}
self.setNeedsDisplay(0);
if (mouseIsOver) {
onClickFunction(tag, 1); 
}
}
this.elementDoubleClick=function () {
onClickFunction(tag, 2);
}
this.setNeedsDisplay=function(isMouseDown) {
if (isCheckbox && isChecked) {
if (isMouseDown) {
documentElement.className=classCheckedDown;
self.setElementImage(imageNameDownChecked);
} else {
documentElement.className=classChecked;
self.setElementImage(imageNameChecked);
}	
return;
} 
if (isMouseDown) {
documentElement.className=classDown;
self.setElementImage(imageNameDown);
} else {
documentElement.className=classRegular;
self.setElementImage(imageName);
}
}
this.setIsChecked=function(newIsChecked) {
isChecked=newIsChecked;
self.setNeedsDisplay();
}
this.getIsChecked=function() {
return isChecked;
}
this.setTag=function(newTag) {
tag=newTag;
}
this.getTag=function() {
return tag;
}
this.getIsImageButton=function() {
return isImageButton;
}
this.setIsImageButton=function(newIsImageButton) {
isImageButton=newIsImageButton;
}
this.setElementImage=function(newImageName) {
var isRetinaDisplay=widgetController.getPreferenceController().getPreferencesIsRetinaDisplay();
if (isImageButton) {
if (newImageName=="") {
documentElement.style.opacity=0.0;
} else {
if (isRetinaDisplay) {
documentElement.src="images/buttons/"+newImageName+"@2x.png";
} else {
documentElement.src="images/buttons/"+newImageName+".png";
}
}
} else {
if (newImageName=="") {
documentElement.style.backgroundImage="";
} else {
if (isRetinaDisplay) {
documentElement.style.backgroundImage="url('images/buttons/"+newImageName+"@2x.png')";
documentElement.style.backgroundSize="100% auto";
} else {
documentElement.style.backgroundImage="url('images/buttons/"+newImageName+".png')";
}
}
}
}
this.cacheImages=function() {
var isRetinaDisplay=widgetController.getPreferenceController().getPreferencesIsRetinaDisplay();
var retinaExtension="";
var imageURL="";
var imageNameArray=new Array(imageName, imageNameDown, imageNameChecked, imageNameDownChecked);
var i;
if (isRetinaDisplay) {
retinaExtension="@2x";
}
var imageCacher=new Image();
for (i=0; i<=3; i++) {
if (imageNameArray[i]!="") {
imageURL="images/buttons/"+imageNameArray[i]+retinaExtension+".png";
imageCacher.src=imageURL; 
}
}
}
this.setText=function(newText) {
text=newText;
if (text!="") {
documentElement.innerHTML=text;
}
}
this.getText=function() {
return text;
}
this.setClassNames=function(newClassRegular, newClassDown) {
classRegular=newClassRegular;
classDown=newClassDown;
self.setNeedsDisplay();
}
this.setIsVisible=function(newIsVisible) {
isVisible=newIsVisible;
if (isVisible==1) {
documentElement.style.display='block';
} else {
documentElement.style.display='none';
}
}
this.getIsVisible=function() {
return isVisible;
}
}
