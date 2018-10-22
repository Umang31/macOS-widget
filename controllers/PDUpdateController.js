function PDUpdateController() {
var updateXMLHttpRequest;
var lastCheckedTime=0;
var newestRevisionURL="http://www.donkeyengineering.com/pemdaswidget/";
var newestRevisionNumber=1000000;
var newestRevisionReleaseMessage="";
var updateStatus=2; 
var self=this;
this.checkForUpdates=function() {
if (widgetController.getPreferenceController().getPreferencesCheckForUpdates()==0) {
self.setUpdateStatus(3);
widgetController.handleCheckForUpdatesFinished();
return;
}
var currentTime=new Date();
var currentTimeSeconds=currentTime.getTime()/1000;
if ((currentTimeSeconds-lastCheckedTime)>172800) { 
self.setUpdateStatus(2); 
self.startRequest();
lastCheckedTime=currentTimeSeconds;
}
}
this.startRequest=function() {
updateXMLHttpRequest = new XMLHttpRequest();
updateXMLHttpRequest.onreadystatechange = self.handleRequestSteadyStateChange; 
updateXMLHttpRequest.overrideMimeType("text/xml");
updateXMLHttpRequest.open("GET", "http://updates.donkeyengineering.com/pemdaswidget/pemdas300.php?r=310");
updateXMLHttpRequest.send();
}
this.handleRequestSteadyStateChange=function() {
if (updateXMLHttpRequest.readyState == 4) {
if (updateXMLHttpRequest.status == 200) {
self.handleRequestFinished();
} else {
self.setUpdateStatus(2);
widgetController.handleCheckForUpdatesFinished();
}
}	
}
this.handleRequestFinished=function() {	
var responseText=updateXMLHttpRequest.responseText;
var responseTextArray=responseText.split("||");
if (responseTextArray.length<3) { 
self.setUpdateStatus(2); 
widgetController.handleCheckForUpdatesFinished();
return;
}
newestRevisionNumber=responseTextArray[0];
newestRevisionURL=responseTextArray[1];
newestRevisionReleaseMessage=responseTextArray[2];
if (widgetController.getPreferenceController().getWidgetRevisionString()!=newestRevisionNumber) {
self.setUpdateStatus(1);
} else {
self.setUpdateStatus(0);
}
widgetController.handleCheckForUpdatesFinished();
}
this.getNewestRevisionReleaseMessage=function() {
return newestRevisionReleaseMessage;
}
this.getNewestRevisionURL=function() {
return newestRevisionURL;
}
this.getNewestRevisionNumber=function() {
return newestRevisionNumber;
}
this.setUpdateStatus=function(newUpdateStatus) {
if (updateStatus==1) { 
return;
}
updateStatus=newUpdateStatus;
}
this.getUpdateStatus=function() {
return updateStatus;
}
this.resetLastCheckedTime=function() {
lastCheckedTime=0;
}
}
