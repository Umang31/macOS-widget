function PDNumber()
{
this.number=false;
if (arguments.length) {
this.number=parseFloat(arguments[0]);
if (isNaN(this.number))
this.number=false;
}
this.getNumber=function() {
return this.number;
}
}