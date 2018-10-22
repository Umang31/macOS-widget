function PDFrontViewController()
{
var keypadViewController;
var historyViewController;
var alertView;
var mainTextField;
var quickLookController;
var answerDiv;
var formulaScrollerController;
var deleteButton, clearButton;
var expandButton, keypadHistoryButton, infoButton;
var numberFormattingPopUpButton, degreesRadiansPopUpButton;
var expandedSize={width:323, height:235}; 
var defaultSize={width:323, height:235}; 
var previousExpandedSize={width:323, height:235}; 
var currentResizeMode=0; 
var initialClick={x:0, y:0};
var initialValues={initialWidth:0, initialHeight:0};
var miniModeHeight=105;
var frontViewState=0; 
var archivedFrontViewState=0, alertViewShouldRestoreMiniMode=0;
var self=this;
this.init=function() {
keypadViewController=new PDKeypadViewController();
keypadViewController.initWithParentView(self);
historyViewController=new PDHistoryViewController();
historyViewController.initWithParentView(self);
mainTextField=new PDTextField();
mainTextField.init();
mainTextField.setDelegate(self);
mainTextField.focus();
setTimeout(mainTextField.focus, 500);
quickLookController=new PDQuickLookController();
quickLookController.init();
alertView=new PDAlertView();
alertView.initWithParentView(self);
answerDiv=document.getElementById('answerDiv');
formulaScrollerController=new PDFormulaScrollerController();
formulaScrollerController.init();
self.loadButtons();
self.attachBottomBarButtonEvents();
expandedSize.width=widgetController.getPreferenceController().getPreferencesExpandedWidth();
expandedSize.height=widgetController.getPreferenceController().getPreferencesExpandedHeight();
self.setFrontViewState(widgetController.getPreferenceController().getPreferencesFrontViewState());
self.setContentViewNeedsDisplay();
document.getElementById('bodyElement').addEventListener("paste", self.pasteHandler);
}
this.resetFront=function() {
answerDiv.innerHTML='0';
answerDiv.style.fontSize='19px';
answerDiv.style.top='35px';
historyViewController.resetHistoryView();
formulaScrollerController.reset();
mainTextField.focus();
}
this.loadButtons=function() {
var tempLabelArray;
deleteButton=new PDButton("", document.getElementById("deleteButton"), self.buttonClicked, "deletebutton_off", "deletebutton_on", "", "");
deleteButton.setTag(100);
deleteButton.setIsImageButton(1);
deleteButton.init();
clearButton=new PDButton("", document.getElementById("clearButton"), self.buttonClicked, "clearbutton_off", "clearbutton_on", "", "");
clearButton.setTag(101);
clearButton.setIsImageButton(1);
clearButton.init();
expandButton=new PDButton("", document.getElementById("expandButton"), self.buttonClicked, "expandbutton_off", "expandbutton_on", "", "");
expandButton.setTag(150);
expandButton.setIsImageButton(1);
expandButton.init();
keypadHistoryButton=new PDButton("", document.getElementById("keypadHistoryButton"), self.buttonClicked, "historybutton_off", "historybutton_on", "", "");
keypadHistoryButton.makeButtonCheckbox(0, "keypadbutton_off", "keypadbutton_on", "", "");
keypadHistoryButton.setTag(151);
keypadHistoryButton.setIsImageButton(1);
keypadHistoryButton.init();
infoButton=new PDButton("", document.getElementById("infoButton"), self.buttonClicked, "infobutton_off", "infobutton_on", "", "");
infoButton.setTag(152);
infoButton.setIsImageButton(1);
infoButton.init();
tempLabelArray=new Array("", "Float", "Scientific", "Engineering", "Percent", "Binary", "Octal", "Hexadecimal");
numberFormattingPopUpButton=new PDPopUpButton(document.getElementById("bottomBarNumberFormattingOptionLabel"), document.getElementById("bottomBarNumberFormattingOption"), self.bottomBarNumberFormattingDidChange, tempLabelArray);
numberFormattingPopUpButton.init();
tempLabelArray=new Array("Degrees", "Radians");
degreesRadiansPopUpButton=new PDPopUpButton(document.getElementById("bottomBarDegreesRadiansOptionLabel"), document.getElementById("bottomBarDegreesRadiansOption"), self.bottomBarDegreesRadiansDidChange, tempLabelArray);
degreesRadiansPopUpButton.init();
if(widgetController.getPreferenceController().getPreferencesIsRetinaDisplay()) { 
document.getElementById('resizeButton').src='images/buttons/resize@2x.png';
}
}
this.attachBottomBarButtonEvents=function() {
document.getElementById('resizeButton').addEventListener("mousedown", self.resizeMouseDown);
}
this.getMainTextField=function() {
return mainTextField;
}
this.buttonClicked=function(buttonTag, clickCount) {
if (buttonTag==100) { 
mainTextField.deleteBackward();
} else if (buttonTag==101) { 
mainTextField.handleCharCode(27);
} else if (buttonTag==150) { 
self.miniModeButtonClicked();
mainTextField.focus();
} else if (buttonTag==151) { 
self.keypadHistoryButtonClicked();
mainTextField.focus();
} else if (buttonTag==152) { 
widgetController.showBack();
}
}
this.setEnabled=function(newEnabledState) { 
if (newEnabledState) {
mainTextField.focus();
}
}
this.focusMainTextField=function() {
mainTextField.focus();
}
this.setFrontViewState=function(newFrontViewState) {
frontViewState=newFrontViewState;
self.refreshBottomBarTopBorderVisibility();
}
this.refreshBottomBarTopBorderVisibility=function() {
if (frontViewState==2 || frontViewState==3 || (frontViewState==1 && expandedSize.height==miniModeHeight)) {
document.getElementById("bottomBarTopBorder").style.display="none";
} else {
document.getElementById("bottomBarTopBorder").style.display="block";
}
}
this.bottomBarDegreesRadiansDidChange=function() {
var newDegreesRadians=degreesRadiansPopUpButton.getValue();
widgetController.getPreferenceController().setPreferencesRadians(newDegreesRadians);
widgetController.handleDegreesRadiansDidChange(); 
mainTextField.focus();
}
this.refreshDegreesRadiansPopUpButton=function()  {
var newDegreesRadians=widgetController.getPreferenceController().getPreferencesRadians();
degreesRadiansPopUpButton.setValue(newDegreesRadians);
}
this.bottomBarNumberFormattingDidChange=function() {
var newNumberFormattingType=numberFormattingPopUpButton.getValue();
widgetController.getPreferenceController().setPreferencesNumberFormattingType(newNumberFormattingType);
widgetController.handleNumberFormattingDidChange();
mainTextField.focus();
}
this.refreshNumberFormattingPopUpButton=function() {
var newNumberFormattingType=widgetController.getPreferenceController().getPreferencesNumberFormattingType();
numberFormattingPopUpButton.setValue(newNumberFormattingType);
}
this.insertStringInTextField=function(stringToInsert, addAnsIfNecessary) { 
if (addAnsIfNecessary==0) {
mainTextField.insertString(stringToInsert);
return;
}
var preventDefault=0;
preventDefault=mainTextField.handleCharCode(stringToInsert.charCodeAt(0));
if (preventDefault!=1) {
mainTextField.insertString(stringToInsert);
}
}	
this.widgetRecieveFocus=function () {
answerDiv.className="";
}
this.widgetFocusGoesAway=function() {
answerDiv.className="answerFontLight";
}
this.handleFormulaDidChange=function() {
answerDiv.style.opacity=0.6;
}
this.handleEquationJustCalculated=function() { 
answerDiv.style.opacity=1.0;
var lastResult=widgetController.getEquationController().getLastResult();
var numberOfEquations=widgetController.getEquationController().getNumberOfEquations();
var equationString=widgetController.getEquationController().getEquationStringForEquationIndex(lastResult.getEquationIndex());
var alertMessage;
if (equationString!=null) { 
formulaScrollerController.addCalculatedString(equationString);
if (numberOfEquations>1 && (numberOfEquations-1)%250 == 0) {
alertMessage="<div class='alertViewTitle'>There are over "+(numberOfEquations-1)+" equations in the session.</div>";
alertMessage+="<div class='alertViewMessage'>A large number of equations may cause PEMDAS to perform slowly.  If this happens, you can clear the session by double clicking the Clear button above, or by using the &quot;Clear Now&quot; button below.</div>";
alertView.setAlertType(1); 
alertView.setMessageHTML(alertMessage);
self.setAlertViewIsVisible(1);
} else { 
widgetController.checkForUpdates();
}
historyViewController.handleEquationJustCalculated(equationString, lastResult);
}
self.refreshResultString();
if (lastResult.getIsErrorMessage()) { 
mainTextField.setTextFieldModifiedFlag(1);
} else {
mainTextField.setTextFieldModifiedFlag(0);
}
}
this.displayUpdateAlert=function(alertViewMessage) {
alertView.setAlertType(0); 
alertView.setMessageHTML(alertViewMessage);
self.setAlertViewIsVisible(1);
}
this.setAlertViewIsVisible=function(newIsVisible) { 
alertView.setIsVisible(newIsVisible);
if (newIsVisible==1) {
if ((frontViewState==1 && expandedSize.height==miniModeHeight) || frontViewState==2 || frontViewState==3) { 
alertViewShouldRestoreMiniMode=1;
archivedFrontViewState=frontViewState;
if (frontViewState==1 && expandedSize.height==miniModeHeight) {
expandedSize.height=defaultSize.height;
} else if (frontViewState==2) {
self.setFrontViewState(0);
} else if (frontViewState==3) {
self.setFrontViewState(1);
}
self.setContentViewNeedsDisplay();
}
} 		
}
this.handleAlertViewHidden=function() {
if (alertViewShouldRestoreMiniMode==1) {
if (archivedFrontViewState==1) {
expandedSize.height=miniModeHeight;
} else if (archivedFrontViewState==2 || archivedFrontViewState==3) {
self.setFrontViewState(archivedFrontViewState);
}
self.setContentViewNeedsDisplay();
}
alertViewShouldRestoreMiniMode=0;
}
this.handleNumberFormattingDidChange=function() {
self.refreshNumberFormattingPopUpButton();
self.refreshResultString();
historyViewController.handleNumberFormattingDidChange();
}
this.refreshResultString=function() {
var lastResult=widgetController.getEquationController().getLastResult();
var variableIDToAssign;
var variableToAssign;
var lastResultNumber=0.0;
var newResultString="";
if (lastResult==-1) { 
newResultString=widgetController.getNumberFormatter().formattedNumberForNumber(0.0);
} else { 
if (lastResult.getIsErrorMessage()) {
answerDiv.style.fontSize='12px';
answerDiv.style.top='40px';
newResultString="Error: "+lastResult.getErrorMessage();
} else { 
answerDiv.style.fontSize='19px';
answerDiv.style.top='35px';
variableIDToAssign=lastResult.getVariableToAssign();
if (variableIDToAssign!=-1) {
variableToAssign=globalVariableArray[variableIDToAssign];
lastResultNumber=variableToAssign.getNumber();
newResultString=widgetController.getNumberFormatter().formattedNumberForNumber(lastResultNumber);
if (variableToAssign.getType()==3) { 
newResultString=globalVariableNamesArray[variableIDToAssign] + " = " + newResultString;
}
}
}
}
answerDiv.innerHTML=newResultString;
}
this.keypadHistoryButtonClicked=function() { 
if (frontViewState==0) { 
self.setFrontViewState(1);
} else if (frontViewState==1) { 
self.setFrontViewState(0);
} else if (frontViewState==2) { 
self.setFrontViewState(0);
} else if (frontViewState==3) { 
self.setFrontViewState(1);
}
self.setContentViewNeedsDisplay();
widgetController.getPreferenceController().setPreferencesFrontViewState(frontViewState);
}
this.miniModeButtonClicked=function() {
if (frontViewState==0) { 
self.setFrontViewState(2);
} else if (frontViewState==1) { 
if (expandedSize.height==miniModeHeight) { 
expandedSize.height=defaultSize.height;
} else {
self.setFrontViewState(3);
}
} else if (frontViewState==2) { 
self.setFrontViewState(0);
} else if (frontViewState==3) { 
self.setFrontViewState(1);
}
self.setContentViewNeedsDisplay();
widgetController.getPreferenceController().setPreferencesFrontViewState(frontViewState);
}
this.setContentViewNeedsDisplay=function() {
if (frontViewState>=1) { 
document.getElementById("keypadViewDiv").style.visibility = 'hidden';
if (frontViewState==2 || frontViewState==3) { 
document.getElementById("historyViewDiv").style.visibility = 'hidden';
} else {
document.getElementById("historyViewDiv").style.visibility = 'visible';
}
if (frontViewState==1) {
keypadHistoryButton.setIsChecked(1);  
} else if (frontViewState==2) {
keypadHistoryButton.setIsChecked(1); 
} else if (frontViewState==3) {
keypadHistoryButton.setIsChecked(0); 
}
document.getElementById("expandButton").style.right="85px";
document.getElementById("keypadHistoryButton").style.right="59px";
document.getElementById("infoButton").style.right="33px";
document.getElementById("resizeButton").style.display="block";
self.refreshWidgetSize();
} else {
document.getElementById("keypadViewDiv").style.visibility = 'visible';
document.getElementById("historyViewDiv").style.visibility = 'hidden';
keypadHistoryButton.setIsChecked(0); 
document.getElementById("expandButton").style.right="73px";
document.getElementById("keypadHistoryButton").style.right="44px";
document.getElementById("infoButton").style.right="15px";
document.getElementById("resizeButton").style.display="none";
self.refreshWidgetSize();
}
}
this.resizeMouseDown=function(event) {
document.addEventListener("mousemove", self.resizeMouseMove, true);
document.addEventListener("mouseup", self.resizeMouseUp, true);
var tempx=parseInt(document.getElementById("resizeButton").style.left);
var tempy=parseInt(document.getElementById("resizeButton").style.top);
var initialWidth=parseInt(document.getElementById("formulaBarContainer").style.width);
var initialHeight=parseInt(document.getElementById("bottomBarContainer").style.top)+39;
initialClick={x:event.x, y:event.y};
initialValues={initialWidth:initialWidth, initialHeight:initialHeight};
alertViewShouldRestoreMiniMode=0; 
event.preventDefault();
}
this.resizeMouseMove=function(event) {
var x = event.x-initialClick.x; 
var y = event.y-initialClick.y;
expandedSize.width=initialValues.initialWidth+x;
if (frontViewState==1) { 
expandedSize.height=initialValues.initialHeight+y;
}
self.refreshWidgetSize();
}
this.resizeMouseUp=function(event) {
document.removeEventListener("mousemove", self.resizeMouseMove, true);
document.removeEventListener("mouseup", self.resizeMouseUp, true); 
self.refreshWidgetSize();
widgetController.getPreferenceController().setPreferencesExpandedWidth(expandedSize.width);
widgetController.getPreferenceController().setPreferencesExpandedHeight(expandedSize.height);
event.preventDefault();
}
this.getFrontViewSize=function() {
if (frontViewState==1) {
return expandedSize;
} else if (frontViewState==2 || frontViewState==3) {
return {width:expandedSize.width, height:miniModeHeight}
}
return defaultSize;
}
this.refreshWidgetSize=function() {
var newWidth, newHeight;
newWidth=defaultSize.width;
newHeight=defaultSize.height;
if (expandedSize.width<=333) {
expandedSize.width=323;
}
if (expandedSize.height<=245) {
if (expandedSize.height<115) {
expandedSize.height=miniModeHeight;
} else {
expandedSize.height=235;
}
}
if (frontViewState==2 || frontViewState==3) {
newWidth=expandedSize.width;
newHeight=miniModeHeight;
} else if (frontViewState==1) {
newWidth=expandedSize.width;
newHeight=expandedSize.height;
}
document.getElementById("formulaBarContainer").style.width=newWidth+"px";
document.getElementById("formulaBarMiddle").style.width=(newWidth-46)+"px";
document.getElementById("bottomBarContainer").style.width = newWidth+"px";
document.getElementById("bottomBarContainer").style.top =(newHeight - 39)+"px";
document.getElementById("bottomBarMiddle").style.width=(newWidth-46)+"px";
document.getElementById("bottomBarTopBorder").style.width=(newWidth-18)+"px";
document.getElementById("mainBodyContainer").style.width = newWidth+"px";
document.getElementById("mainBodyContainer").style.height = (newHeight-105)+"px";
answerDiv.style.width=(newWidth-94)+"px";
mainTextField.setWidth(newWidth-73);
historyViewController.refreshSize(); 
alertView.refreshSize(); 
if (window.widget) {
window.resizeTo(newWidth,newHeight);
}
self.refreshBottomBarTopBorderVisibility();
}
this.handleEnterPressed=function() {
widgetController.calculateEquationString(mainTextField.stringValue());
}
this.handleDoubleClearPressed=function() {
widgetController.resetWidget();
}
this.scrollToPreviousFormlua=function() {
var currentString=mainTextField.stringValue();
var previousString=formulaScrollerController.stringForPreviousIndexFromString(currentString);
if (previousString==null) {
return;
}
mainTextField.replaceStringWithString(previousString);
mainTextField.setTextFieldModifiedFlag(2);
}
this.scrollToNextFormula=function() {
var currentString=mainTextField.stringValue();
var previousString=formulaScrollerController.stringForNextIndexFromString(currentString);
if (previousString==null) {
return;
}
mainTextField.replaceStringWithString(previousString);
mainTextField.setTextFieldModifiedFlag(2);
}
this.handleTextFieldModifiedFlagDidChange=function() {
if (mainTextField.getTextFieldModifiedFlag()==2) {
formulaScrollerController.setJustCalculatedEquation(0);
} else { 
formulaScrollerController.setJustCalculatedEquation(1);
}
}
this.pasteHandler=function(event) {
var clipboardString=event.clipboardData.getData('Text');
var i, stringToAdd="";
var commaLocale=widgetController.getPreferenceController().getPreferencesCommaLocale();
if (commaLocale) {
clipboardString=clipboardString.replace(/\./g,',');
} else {
clipboardString=clipboardString.replace(/,/g,'');
}
for (i=0; i<clipboardString.length; i++) {
if (clipboardString.charCodeAt(i)==10 || clipboardString.charCodeAt(i)==3 || clipboardString.charCodeAt(i)==13) { 
stringToAdd+=" ";
} else {
stringToAdd=stringToAdd+''+clipboardString.charAt(i);
}
}
mainTextField.insertString(stringToAdd);
event.preventDefault();
}
this.formulaTextAreaMouseDidMove=function(event) {
return;
if (!event.shiftKey) {
quickLookController.endQuickLook();
} else { 
quickLookController.handleVariableHighlightMouseMove(event);
}
}
this.formulaTextAreaMouseOut=function() {
quickLookController.endQuickLook();
}
this.activateModalDisplay=function() {
currentResizeMode=1;
previousExpandedSize.width=expandedSize.width;
previousExpandedSize.height=expandedSize.height;
if (expandedSize.width<defaultSize.width) {
expandedSize.width=defaultSize.width;
}
if (expandedSize.height<defaultSize.height) {
expandedSize.height=defaultSize.height;
}
alertView.setIsVisible(1);
}
this.deactivateModalDisplay=function() {
alertView.setIsVisible(0);
currentResizeMode=0;
expandedSize.width=previousExpandedSize.width;
expandedSize.height=previousExpandedSize.height;
}
this.handleForwardedEvent=function(forwardedArguments) {
var shouldInsertEquation;
if (forwardedArguments.length==0) {
return;
}
if (forwardedArguments[1]==0 && forwardedArguments.length>=3) { 
self.addVariableToMainDisplay(forwardedArguments[2]);
} else if (forwardedArguments[1]==1 && forwardedArguments.length>=3) {
shouldInsertEquation=0;
if (forwardedArguments[0].shiftKey) {
shouldInsertEquation=1;
}
self.addEquationToMainDisplay(forwardedArguments[2], shouldInsertEquation);
}
}
this.addVariableToMainDisplay=function(variableID) {
if (variableID==-1 || variableID>=globalVariableNamesArray.length) {
return;
}
self.insertStringInTextField(globalVariableNamesArray[variableID], 0);
}
this.addEquationToMainDisplay=function(equationIdClicked, shouldInsertString) {
var equationString=widgetController.getEquationController().getEquationStringForEquationIndex(equationIdClicked);
var commaLocale=widgetController.getPreferenceController().getPreferencesCommaLocale();
if (commaLocale) {
equationString=equationString.replace(/\./g, ',');
} else {
equationString=equationString.replace(/,/g, '.');
}
if (equationIdClicked!=null) {
if (shouldInsertString) {
mainTextField.insertString(equationString);
} else {
mainTextField.replaceStringWithString(equationString);
}
}
}
}
