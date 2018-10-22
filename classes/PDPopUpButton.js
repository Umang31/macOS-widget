function PDPopUpButton(newOptionLabelElement, newOptionElement, newOnChangeFunction, newLabelValueArray)
{
var optionLabelElement=newOptionLabelElement;
var optionElement=newOptionElement;
var onChangeFunction=newOnChangeFunction;
var labelValueArray=newLabelValueArray;
var value=0;
var tag=0;
var self=this;
this.init=function() {
newOptionElement.addEventListener("change", self.elementOnChange);
self.setNeedsDisplay();
}
this.elementOnChange=function() {
self.setValue(parseInt(optionElement.value));
onChangeFunction(tag);
}
this.setNeedsDisplay=function() {
optionLabelElement.innerHTML=labelValueArray[value];
optionElement.value=value;
}
this.setTag=function(newTag) {
tag=newTag;
}
this.getTag=function() {
return tag;
}
this.setElementImage=function(newImageName) {
var isRetinaDisplay=widgetController.getPreferenceController().getPreferencesIsRetinaDisplay();
if (isImageButton) {
if (isRetinaDisplay) {
documentElement.src="images/buttons/"+newImageName+"@2x.png";
} else {
documentElement.src="images/buttons/"+newImageName+".png";
}
}
}
this.setValue=function(newValue) {
value=newValue;
self.setNeedsDisplay();
}
this.getValue=function() {
return value;
}
}
