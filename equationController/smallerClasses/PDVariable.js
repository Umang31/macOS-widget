function PDVariable()
{
var locked=false;
var type=1; 
var number=0;
var isDisplayUpdated=false;
var name="";
this.setName=function(newName) {
name=newName;
}
this.getName=function() {
return name;
}
this.setType=function(newType) {
type=newType;
}
this.getType=function() {
return type;
}
this.setNumber=function(newNumber) {
number=newNumber;
isDisplayUpdated=false;
}
this.getNumber=function() {
return number;
}
this.setIsDisplayUpdated=function(newIsDisplayUpdated) {
isDisplayUpdated=newIsDisplayUpdated;
}
this.getIsDisplayUpdated=function() {
return isDisplayUpdated;
}
}