function PDWidgetController()
{
var preferenceController;
var equationController;
var numberFormatter;
var updateController;
var widgetBackController;
var widgetFrontController;
var self=this;
this.init=function() {
preferenceController = new PDPreferenceController();
preferenceController.loadPreferences();
equationController = new PDEquationController();
equationController.init();
numberFormatter=new PDNumberFormatter();
numberFormatter.init();
updateController = new PDUpdateController();
widgetBackController=new PDBackViewController();
widgetBackController.init();
widgetFrontController=new PDFrontViewController();
widgetFrontController.init();
self.checkForUpdates(); 
self.handleNumberFormattingDidChange();
self.handleRadixCharacterDidChange();
self.handleDegreesRadiansDidChange();
self.handleMultiplicationSymbolDidChange();
self.handlePercentModulusDidChange();
}
this.getNumberFormatter=function() {
return numberFormatter;
}
this.getPreferenceController=function() {
return preferenceController;
}
this.getEquationController=function() {
return equationController;
}
this.getUpdateController=function() {
return updateController;
}
this.getWidgetFrontController=function() {
return widgetFrontController;
}
this.getWidgetBackController=function() {
return widgetBackController;
}
this.getMainTextField=function() {
return widgetFrontController.getMainTextField();
}
this.showFront=function() {
var newWindowSize;
if (window.widget) {
newWindowSize=widgetFrontController.getFrontViewSize();
window.resizeTo(Math.max(323, newWindowSize.width),Math.max(235, newWindowSize.height)); 
widget.prepareForTransition("ToFront"); 
}
document.getElementById("back").style.display = "none";
document.getElementById("front").style.display = "block";
if (window.widget) {
setTimeout("widget.performTransition()", 0);
window.resizeTo(newWindowSize.width,newWindowSize.height);
}
widgetFrontController.setEnabled(1);
}
this.showBack=function() {
var widgetFrontSize=widgetFrontController.getFrontViewSize();
if (window.widget) {
window.resizeTo(Math.max(323, widgetFrontSize.width),Math.max(235, widgetFrontSize.height));
widget.prepareForTransition("ToBack");
}
document.getElementById("front").style.display = "none";
document.getElementById("back").style.display = "block";
if (window.widget) {
setTimeout("widget.performTransition()", 0);
window.resizeTo(323, 235); 
}
widgetFrontController.setEnabled(0);
}	
this.widgetRecieveFocus=function () {
widgetFrontController.widgetRecieveFocus();
}
this.widgetFocusGoesAway=function() {
widgetFrontController.widgetFocusGoesAway();
}
this.handleFormulaDidChange=function() {
widgetFrontController.handleFormulaDidChange();
}
this.handleDegreesRadiansDidChange=function() {
var newDegreesRadians=preferenceController.getPreferencesRadians();
equationController.setPreferencesRadians(newDegreesRadians);
widgetFrontController.refreshDegreesRadiansPopUpButton();
}
this.handleNumberFormattingDidChange=function() {
numberFormatter.setPreferencesNumberFormattingType(preferenceController.getPreferencesNumberFormattingType());
numberFormatter.setPreferencesSignificantFiguresAndDecimalPlaces(preferenceController.getPreferencesSignificantFigures(), preferenceController.getPreferencesDecimalPlaces());
numberFormatter.setPreferencesThousandsSeparators(preferenceController.getPreferencesThousandsSeparators());
if (preferenceController.getPreferencesCommaLocale()==1) {
numberFormatter.setDecimalCharacter(',');
} else {
numberFormatter.setDecimalCharacter('.');
}
var thousandsSeparatorArray=new Array(","," ", "'");
var thousandsSeparatorID=preferenceController.getPreferencesThousandsSeparatorCharacter();
numberFormatter.setThousandsSeparatorCharacter(thousandsSeparatorArray[thousandsSeparatorID]);
widgetFrontController.handleNumberFormattingDidChange();
widgetBackController.refreshNumberFormattingButtons();
}
this.handleMultiplicationSymbolDidChange=function() {
var newMultiplicationSymbol=widgetController.getPreferenceController().getPreferencesMultiplicationSymbol();
widgetFrontController.getMainTextField().setUseMultiplicationDot(newMultiplicationSymbol);
widgetBackController.refreshMultiplicationSymbolPopUpButton();
}
this.handlePercentModulusDidChange=function() {
var newPercentIsModulus=widgetController.getPreferenceController().getPreferencesPercentIsModulus();
equationController.setPreferencesPercentIsModulus(newPercentIsModulus);
widgetBackController.refreshPercentIsModulusCheckboxButton();
}
this.calculateEquationString=function(equationToCalculateString) {
equationController.addString(equationToCalculateString); 
widgetFrontController.handleEquationJustCalculated();
}
this.handleRadixCharacterDidChange=function() {
var isCommaLocale=preferenceController.getPreferencesCommaLocale();
if (isCommaLocale==1) {
numberFormatter.setDecimalCharacter(',');
document.getElementById('widgetBackThousandsSeparatorCharacterComma').disabled=true;
document.getElementById("padRadixCharacter").innerHTML=",";
} else {
numberFormatter.setDecimalCharacter('.');
document.getElementById('widgetBackThousandsSeparatorCharacterComma').disabled=false;
document.getElementById("padRadixCharacter").innerHTML=".";
}
self.getMainTextField().setCommaLocale(isCommaLocale);
equationController.setCommaLocale(isCommaLocale);
if (isCommaLocale==1) {
preferenceController.switchThousandsSeparatorCharacterIfNecessary();
}
self.handleNumberFormattingDidChange();
widgetBackController.refreshRadixCharacterPopUpButton();
}
this.checkForUpdates=function() { 
updateController.checkForUpdates(); 
}
this.handleCheckForUpdatesFinished=function() { 
var alertViewMessage;
widgetBackController.refreshUpdateStatusMessage();
if (updateController.getUpdateStatus()==1 && updateController.getNewestRevisionNumber()!=preferenceController.getPreferencesSkipUpdateToRevision()) {
alertViewMessage=updateController.getNewestRevisionReleaseMessage();
widgetFrontController.displayUpdateAlert(alertViewMessage);
}
}
this.handleCheckForUpdatesDidChange=function() { 
var newPreferencesCheckForUpdates=preferenceController.getPreferencesCheckForUpdates();
if (newPreferencesCheckForUpdates==1) { 
preferenceController.resetPreferencesSkipUpdateToRevision();
updateController.resetLastCheckedTime(); 
self.checkForUpdates();
}
widgetBackController.refreshCheckForUpdatesCheckboxButton();
}
this.resetWidget=function() {
equationController.clearAll();
widgetFrontController.resetFront();
self.checkForUpdates();
}
this.handleForwardedEvent=function(forwardedArguments) {
widgetFrontController.handleForwardedEvent(forwardedArguments);
}
}
