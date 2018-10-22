function PDBlockInfo()
{
this.parent=false;
this.parentSubIndex=false; 
this.reduced=false;
this.reducedToNumber=false;
this.finished=false; 
this.setParent=function(number) {
this.parent=number;
}
this.setParentSubIndex=function(number) {
this.parentSubIndex=number;
}
this.setReduced=function(booleanValue) {
this.reduced=booleanValue;
}
this.setReducedToNumber=function(booleanValue) {
this.reducedToNumber=booleanValue;
}
this.getParent=function() {
return this.parent;
}
this.getParentSubIndex=function() {
return this.parentSubIndex;
}
this.getReduced=function() {
return this.reduced;
}
this.getReducedToNumber=function() {
return this.reducedToNumber;
}
this.markAsFinished=function() {
this.finished=true;
}
}