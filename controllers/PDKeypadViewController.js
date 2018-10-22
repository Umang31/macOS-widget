function PDKeypadViewController()
{
var functionPadButtons=new Array();
var parentView;
var self=this;
this.initWithParentView=function(newParentView) {
parentView=newParentView;
self.attachFunctionPadEvents();
}
this.attachFunctionPadEvents=function() {
var i;
var tempButton;
for (i=1; i<=36; i++) {
tempButton=new PDFunctionPadButton(document.getElementById("padButtonDiv"+i), self.functionPadButtonClicked, i);
tempButton.init();
functionPadButtons[i-1]=tempButton;
}
}
this.functionPadButtonClicked=function(buttonTag) {
var stringToAdd="";
switch(buttonTag) {
case 1:
stringToAdd="^-1";
break;
case 2:
stringToAdd="^2";
break;
case 3:
stringToAdd="sqrt(";
break;
case 4:
stringToAdd="sin(";
break;
case 5:
stringToAdd="cos(";
break;
case 6:
stringToAdd="tan(";
break;
case 7:
stringToAdd="asin(";
break;
case 8:
stringToAdd="acos(";
break;
case 9:
stringToAdd="atan(";
break;
case 10:
stringToAdd="10^(";
break;
case 11:
stringToAdd="log(";
break;
case 12:
stringToAdd="ans";
break;
case 13:
stringToAdd="exp(";
break;
case 14:
stringToAdd="ln(";
break;
case 15:
stringToAdd="%";
break;
case 16:
stringToAdd="7";
break;
case 17:
stringToAdd="8";
break;
case 18:
stringToAdd="9";
break;
case 19:
stringToAdd="4";
break;
case 20:
stringToAdd="5";
break;
case 21:
stringToAdd="6";
break;
case 22:
stringToAdd="1";
break;
case 23:
stringToAdd="2";
break;
case 24:
stringToAdd="3";
break;
case 25:
stringToAdd="0";
break;
case 26:
stringToAdd=".";
break;
case 27:
stringToAdd="pi";
break;
case 28:
stringToAdd="/";
break;
case 29:
stringToAdd="(";
break;
case 30:
stringToAdd=")";
break;
case 31:
stringToAdd="*";
break;
case 32:
stringToAdd="%";
break;
case 33:
stringToAdd="-";
break;
case 34:
stringToAdd="^";
break;
case 35:
stringToAdd="+";
break;
case 36:
stringToAdd="=";
break;
}
if (stringToAdd=="") {
return;
}
if (stringToAdd=="=") {
parentView.handleEnterPressed();
parentView.focusMainTextField();
return;
}
parentView.insertStringInTextField(stringToAdd, 1);
}
}
