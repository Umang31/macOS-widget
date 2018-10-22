function PDAlertView()
{
var alertType=0; 
var parentView=0;
var isVisible=0;
var rightButton;
var middleButton;
var leftButton;
var self=this;
this.initWithParentView=function(newParentView) {
parentView=newParentView;
self.loadButtons();
}
this.loadButtons=function() {
rightButton=new PDButton("Download", document.getElementById("alertButtonRight"), self.buttonClicked, "", "", "alertButtonBlue", "alertButtonBlueDown");
rightButton.setTag(0);
rightButton.init();
middleButton=new PDButton("Remind Me Later", document.getElementById("alertButtonMiddle"), self.buttonClicked, "", "", "alertButtonGray", "alertButtonGrayDown");
middleButton.setTag(1);
middleButton.init();
leftButton=new PDButton("Skip Update", document.getElementById("alertButtonLeft"), self.buttonClicked, "", "", "alertButtonGray", "alertButtonGrayDown");
leftButton.setTag(2);
leftButton.init();
}
this.refreshButtons=function() {
if (alertType==0) {
rightButton.setText("Download");
rightButton.setClassNames("alertButtonBlue", "alertButtonBlueDown");
rightButton.setIsVisible(1);
document.getElementById("alertButtonRight").style.right="6px";
document.getElementById("alertButtonRight").style.width="84px";
middleButton.setText("Remind Me Later");
middleButton.setClassNames("alertButtonGray", "alertButtonGrayDown");
middleButton.setIsVisible(1);
document.getElementById("alertButtonMiddle").style.right="105px";
document.getElementById("alertButtonMiddle").style.width="109px";
leftButton.setText("Skip Update");
leftButton.setClassNames("alertButtonGray", "alertButtonGrayDown");
leftButton.setIsVisible(1);
document.getElementById("alertButtonLeft").style.right="220px";
document.getElementById("alertButtonLeft").style.width="79px";
} else if (alertType==1) {
rightButton.setText("Later");
rightButton.setClassNames("alertButtonLightGray", "alertButtonLightGrayDown");
rightButton.setIsVisible(1);
document.getElementById("alertButtonRight").style.right="6px";
document.getElementById("alertButtonRight").style.width="84px";
middleButton.setText("Clear Now");
middleButton.setClassNames("alertButtonRed", "alertButtonRedDown");
middleButton.setIsVisible(1);
document.getElementById("alertButtonMiddle").style.right="105px";
document.getElementById("alertButtonMiddle").style.width="95px";
leftButton.setIsVisible(0);
}
}
this.setIsVisible=function(newIsVisible) {
isVisible=newIsVisible;
if (newIsVisible==1) {
document.getElementById('alertViewContainer').style.display='block';
} else {
document.getElementById('alertViewContainer').style.display='none';
parentView.handleAlertViewHidden();
}
}
this.getIsVisible=function() {
return isVisible;
}
this.buttonClicked=function(buttonTag, clickCount) {
if (alertType==0) {
self.handleButtonClickedForUpdateView(buttonTag, clickCount);
} else if (alertType==1) {
self.handleButtonclickedForEquationCountAlert(buttonTag, clickCount);
}
parentView.focusMainTextField();
}
this.handleButtonClickedForUpdateView=function(buttonTag, clickCount) {
var updateURL;
if (buttonTag==0) { 
updateURL=widgetController.getUpdateController().getNewestRevisionURL();
if (window.widget) {
if (updateURL!="") {
widget.openURL(updateURL);
} else {
widget.openURL("http://www.donkeyengineering.com/pemdaswidget");
}
}
self.setIsVisible(0);
} else if (buttonTag==1) { 
self.setIsVisible(0);
} else if (buttonTag==2) { 
var revisionToSkip=widgetController.getUpdateController().getNewestRevisionNumber();
widgetController.getPreferenceController().setPreferencesSkipUpdateToRevision(revisionToSkip);
self.setIsVisible(0);
}
}
this.handleButtonclickedForEquationCountAlert=function(buttonTag, clickCount) {
if (buttonTag==0) { 
self.setIsVisible(0);
} else if (buttonTag==1) { 
widgetController.resetWidget();
self.setIsVisible(0);
}
}
this.setAlertType=function(newAlertType) {
alertType=newAlertType;
self.refreshButtons();
if (alertType==0) { 
} else if (alertType==1) { 
}
}
this.getAlertType=function() {
return alertType;
}
this.refreshSize=function() {
var parentViewSize=parentView.getFrontViewSize();
document.getElementById('alertViewContainer').style.width=(parentViewSize.width-18)+"px";
}
this.setMessageHTML=function(newMessageHTML) {
document.getElementById("alertViewMessageBody").innerHTML=newMessageHTML;
}
}
