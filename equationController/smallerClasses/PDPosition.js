function PDPosition()
{
this.mainIndex=0;
this.currentLocation=0;
this.setCurrentLocation=function(number)
{
this.currentLocation=number;	
}
this.setMainIndex=function(number)
{
this.mainIndex=number;	
}
this.getCurrentLocation=function()
{
return this.currentLocation;	
}
this.getMainIndex=function()
{
return this.mainIndex;	
}
}