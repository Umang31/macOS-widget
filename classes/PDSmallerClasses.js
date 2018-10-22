function PDRange()
{
this.location=0;
this.length=0;
var self=this;
this.setLocation=function(newLocation) {
self.location=newLocation;
}
this.getLocation=function() {
return self.location;
}
this.setLength=function(newLength) {
self.length=newLength;
}
this.getLength=function() {
return self.length;
}
}
