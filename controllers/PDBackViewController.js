function PDBackViewController()
{
var generalButton;
var formattingButton;
var supportButton;
var doneButton;
var modulusCheckBoxButton;
var updatesCheckBoxButton;
var sigfigDecimalComboPopUpButton;
var thousandsSeparatorsCheckBoxButton;
var thousandsSeparatorCharacterPopUpButton;
var multiplicationSymbolPopUpButton;
var radixCharacterPopUpButton;
var self=this;
this.init=function() {
self.loadButtons();
self.refreshAllButtons();
}
this.loadButtons=function() {
var tempLabelArray;
generalButton=new PDButton("General", document.getElementById("backGeneralButton"), self.backButtonClicked, "", "", "tabButton", "tabButtonDown");
generalButton.makeButtonCheckbox(1, "", "", "tabButtonSelected", "tabButtonSelected");
generalButton.setTag(2);
generalButton.init();
formattingButton=new PDButton("Formatting", document.getElementById("backFormattingButton"), self.backButtonClicked, "", "", "tabButton", "tabButtonDown");
formattingButton.makeButtonCheckbox(0, "", "", "tabButtonSelected", "tabButtonSelected");
formattingButton.setTag(3);
formattingButton.init();
supportButton=new PDButton("Support", document.getElementById("supportButton"), self.backButtonClicked, "", "", "supportButton", "supportButtonDown");
supportButton.setTag(0);
supportButton.init();
doneButton=new PDButton("Done", document.getElementById("doneButton"), self.backButtonClicked, "", "", "doneButton", "doneButtonDown");
doneButton.setTag(1);
doneButton.init();
modulusCheckBoxButton=new PDButton("", document.getElementById("modulusCheckBoxButton"), self.percentIsModulusButtonDidChange, "checkbox", "checkboxdown", "checkBoxButton", "checkBoxButton");
modulusCheckBoxButton.makeButtonCheckbox(0, "checkboxchecked", "checkboxcheckeddown", "checkBoxButton", "checkBoxButton");
modulusCheckBoxButton.setIsImageButton(1);
modulusCheckBoxButton.setTag(10);
modulusCheckBoxButton.setLabelElement(document.getElementById('modulusCheckBoxButtonLabel'));
modulusCheckBoxButton.init();
updatesCheckBoxButton=new PDButton("", document.getElementById("updatesCheckBoxButton"), self.widgetBackCheckForUpdatesDidChange, "checkbox", "checkboxdown", "checkBoxButton", "checkBoxButton");
updatesCheckBoxButton.makeButtonCheckbox(0, "checkboxchecked", "checkboxcheckeddown", "checkBoxButton", "checkBoxButton");
updatesCheckBoxButton.setIsImageButton(1);
updatesCheckBoxButton.setTag(11);
updatesCheckBoxButton.setLabelElement(document.getElementById('updatesCheckBoxButtonLabel'));
updatesCheckBoxButton.init();
tempLabelArray=new Array("Auto", "1 Sig. Figure", "2 Sig. Figures", "3 Sig. Figures", "4 Sig. Figures", "5 Sig. Figures", "6 Sig. Figures", "7 Sig. Figures", "8 Sig. Figures", "9 Sig. Figures", "10 Sig. Figures", "0 Decimal Places", "1 Decimal Place", "2 Decimal Places", "3 Decimal Places", "4 Decimal Places", "5 Decimal Places", "6 Decimal Places", "7 Decimal Places", "8 Decimal Places", "9 Decimal Places", "10 Decimal Places");
sigfigDecimalComboPopUpButton=new PDPopUpButton(document.getElementById("widgetBackSigfigDecimalComboOptionLabel"), document.getElementById("widgetBackSigfigDecimalComboOption"), self.widgetBackSigfigDecimalComboDidChange, tempLabelArray);
sigfigDecimalComboPopUpButton.init();
tempLabelArray=new Array(",", "\" \"", "'");
thousandsSeparatorCharacterPopUpButton=new PDPopUpButton(document.getElementById("widgetBackThousandsSeparatorCharacterOptionLabel"), document.getElementById("widgetBackThousandsSeparatorCharacterOption"), self.widgetBackThousandsSeparatorCharacterDidChange, tempLabelArray);
thousandsSeparatorCharacterPopUpButton.init();
thousandsSeparatorsCheckBoxButton=new PDButton("", document.getElementById("thousandsSeparatorsCheckBoxButton"), self.widgetBackThousandsSeparatorsDidChange, "checkbox", "checkboxdown", "checkBoxButton", "checkBoxButton");
thousandsSeparatorsCheckBoxButton.makeButtonCheckbox(0, "checkboxchecked", "checkboxcheckeddown", "checkBoxButton", "checkBoxButton");
thousandsSeparatorsCheckBoxButton.setIsImageButton(1);
thousandsSeparatorsCheckBoxButton.setTag(12);
thousandsSeparatorsCheckBoxButton.setLabelElement(document.getElementById('thousandsSeparatorsCheckBoxButtonLabel'));
thousandsSeparatorsCheckBoxButton.init();
tempLabelArray=new Array("*", String.fromCharCode(8901));
multiplicationSymbolPopUpButton=new PDPopUpButton(document.getElementById("widgetBackMultiplicationSymbolOptionLabel"), document.getElementById("widgetBackMultiplicationSymbolOption"), self.widgetBackMultiplicationSymbolDidChange, tempLabelArray);
multiplicationSymbolPopUpButton.init();
tempLabelArray=new Array("Auto", ".", ",");
radixCharacterPopUpButton=new PDPopUpButton(document.getElementById("widgetBackDecimalSeparatorOptionLabel"), document.getElementById("widgetBackDecimalSeparatorOption"), self.widgetBackRadixCharacterDidChange, tempLabelArray);
radixCharacterPopUpButton.init();
document.getElementById("backPEMDASLogo").addEventListener("click", self.pemdasLogoClicked);
document.getElementById("updateAvailabilityLabel").addEventListener("click", self.updateAvailabilityLabelClicked);
}
this.backButtonClicked=function(buttonTag, clickCount) {
if (buttonTag==0) { 
if(window.widget) {
widget.openURL('http://www.donkeyengineering.com/pemdaswidget/index.php?v=310&r=2');
}
} else if (buttonTag==1) { 
widgetController.showFront();
} else if (buttonTag>=2 && buttonTag<=4) { 
self.makeTabWithTagActive(buttonTag);
}
}
this.pemdasLogoClicked=function() {
if (window.widget) {
widget.openURL('http://www.donkeyengineering.com/pemdaswidget/index.php?v=310&r=3');
}
}
this.updateAvailabilityLabelClicked=function() {
var updateStatus=widgetController.getUpdateController().getUpdateStatus();
if (updateStatus!=0 && window.widget) {
widget.openURL('http://www.donkeyengineering.com/pemdaswidget/index.php?v=310&r=1');
}
}
this.makeTabWithTagActive=function(newButtonTag) {
if (newButtonTag==2) {
document.getElementById("backGeneralContainer").style.display="block";
document.getElementById("backFormattingContainer").style.display="none";
generalButton.setIsChecked(1);
formattingButton.setIsChecked(0);
} else if (newButtonTag==3) {
document.getElementById("backGeneralContainer").style.display="none";
document.getElementById("backFormattingContainer").style.display="block";
generalButton.setIsChecked(0);
formattingButton.setIsChecked(1);
} else if (newButtonTag==4) {
document.getElementById("backGeneralContainer").style.display="none";
document.getElementById("backFormattingContainer").style.display="none";
generalButton.setIsChecked(0);
formattingButton.setIsChecked(0);
}
}
this.refreshAllButtons=function() {
self.refreshPercentIsModulusCheckboxButton(); 
self.refreshCheckForUpdatesCheckboxButton(); 
self.refreshUpdateStatusMessage();
self.refreshNumberFormattingButtons(); 
self.refreshMultiplicationSymbolPopUpButton(); 
self.refreshRadixCharacterPopUpButton(); 
}
this.percentIsModulusButtonDidChange=function() {
var newPreferencesPercentIsModulus=modulusCheckBoxButton.getIsChecked();
widgetController.getPreferenceController().setPreferencesPercentIsModulus(newPreferencesPercentIsModulus);
widgetController.handlePercentModulusDidChange(); 
}
this.refreshPercentIsModulusCheckboxButton=function () {
var newPreferencesPercentIsModulus=widgetController.getPreferenceController().getPreferencesPercentIsModulus();
modulusCheckBoxButton.setIsChecked(newPreferencesPercentIsModulus);
}
this.widgetBackCheckForUpdatesDidChange=function() {
var newPreferencesCheckForUpdates=updatesCheckBoxButton.getIsChecked();
widgetController.getPreferenceController().setPreferencesCheckForUpdates(newPreferencesCheckForUpdates);
widgetController.handleCheckForUpdatesDidChange();
}
this.refreshCheckForUpdatesCheckboxButton=function() {
var newPreferencesCheckForUpdates=widgetController.getPreferenceController().getPreferencesCheckForUpdates();
updatesCheckBoxButton.setIsChecked(newPreferencesCheckForUpdates);
}
this.refreshUpdateStatusMessage=function() {
var updateStatusMessage="An error has occurred.  Please click here to check for updates manually."; 
var className="backOptionLabelSmall handCursor";
var updateStatus=widgetController.getUpdateController().getUpdateStatus();
if (updateStatus==0) {
updateStatusMessage="You're up-to-date!  You are using the latest version available.";
className="backOptionLabelSmall";
} else if (updateStatus==1) {
updateStatusMessage="An update is available! Click here to download it now.";
} else if (updateStatus==3) {
updateStatusMessage="Click here to check for updates manually, or use the checkbox above to enable update checking.";
}
document.getElementById("updateAvailabilityLabel").innerHTML=updateStatusMessage;
document.getElementById("updateAvailabilityLabel").className=className;
}
this.widgetBackSigfigDecimalComboDidChange=function() {
var newPreferencesSigfigDecimalCombo=sigfigDecimalComboPopUpButton.getValue();
widgetController.getPreferenceController().setPreferencesSigfigDecimalComboIndex(newPreferencesSigfigDecimalCombo);
widgetController.handleNumberFormattingDidChange();
}
this.refreshSigfigDecimalComboPopUpButton=function() {
var newPreferencesSigfigDecimalComboID=widgetController.getPreferenceController().getPreferencesSigfigDecimalComboIndex();
sigfigDecimalComboPopUpButton.setValue(newPreferencesSigfigDecimalComboID);
if (newPreferencesSigfigDecimalComboID==21) { 
document.getElementById("widgetBackSigfigDecimalComboOptionLabel").className="popUpButtonLarge backOptionLabel backOptionLabelSmallestText";
} else if (newPreferencesSigfigDecimalComboID>=11) { 
document.getElementById("widgetBackSigfigDecimalComboOptionLabel").className="popUpButtonLarge backOptionLabel backOptionLabelSmallText";
} else {
document.getElementById("widgetBackSigfigDecimalComboOptionLabel").className="popUpButtonLarge backOptionLabel";
}
}
this.widgetBackThousandsSeparatorsDidChange=function() {
var newPreferencesThousandsSeperators=thousandsSeparatorsCheckBoxButton.getIsChecked();
widgetController.getPreferenceController().setPreferencesThousandsSeparators(newPreferencesThousandsSeperators);
widgetController.handleNumberFormattingDidChange();
}
this.refreshThousandsSeparatorCheckboxButton=function() {
var newPreferencesThousandsSeperators=widgetController.getPreferenceController().getPreferencesThousandsSeparators();
thousandsSeparatorsCheckBoxButton.setIsChecked(newPreferencesThousandsSeperators);
}
this.widgetBackThousandsSeparatorCharacterDidChange=function() {
var newThousandsSeparatorCharacterID=thousandsSeparatorCharacterPopUpButton.getValue(); 
widgetController.getPreferenceController().setPreferencesThousandsSeparatorCharacter(newThousandsSeparatorCharacterID);
widgetController.handleNumberFormattingDidChange();
}
this.refreshThousandsSeparatorCharacterPopUpButton=function() {
var thousandsSeparatorCharacter=widgetController.getPreferenceController().getPreferencesThousandsSeparatorCharacter();
thousandsSeparatorCharacterPopUpButton.setValue(thousandsSeparatorCharacter);
}
this.refreshNumberFormattingButtons=function() {
self.refreshSigfigDecimalComboPopUpButton();
self.refreshThousandsSeparatorCheckboxButton();
self.refreshThousandsSeparatorCharacterPopUpButton();
}
this.widgetBackMultiplicationSymbolDidChange=function() {
var newMultiplicationSymbol=multiplicationSymbolPopUpButton.getValue();
widgetController.getPreferenceController().setPreferencesMultiplicationSymbol(newMultiplicationSymbol);
widgetController.handleMultiplicationSymbolDidChange();
}
this.refreshMultiplicationSymbolPopUpButton=function() {
var newMultiplicationSymbolID=widgetController.getPreferenceController().getPreferencesMultiplicationSymbol();
multiplicationSymbolPopUpButton.setValue(newMultiplicationSymbolID);
}
this.widgetBackRadixCharacterDidChange=function() {
var newRadixCharacter=radixCharacterPopUpButton.getValue();
widgetController.getPreferenceController().setPreferencesRadixCharacter(newRadixCharacter);
widgetController.handleRadixCharacterDidChange();
}
this.refreshRadixCharacterPopUpButton=function() {
var newRadixCharacterID=widgetController.getPreferenceController().getPreferencesRadixCharacter();
radixCharacterPopUpButton.setValue(newRadixCharacterID);
}
}
