var widgetController=0;
var debugMode=0;
function initWidget() 
{
widgetController=new PDWidgetController();
widgetController.init();
}
function NSLog(stringToPrint)
{
if (!debugMode) {
return;
}
}
function evFwd()
{
widgetController.handleForwardedEvent(arguments);
}
