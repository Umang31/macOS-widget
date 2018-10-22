function PDPreferenceController() {
var widgetVersionNumber=3.1; 
var widgetRevisionNumber=310; 
var widgetRevisionString="310";
var defaultPreferencesRadians=1;
var defaultPreferencesPercentIsModulus=0;
var defaultPreferencesMultiplicationSymbol=0;
var defaultPreferencesNumberFormattingType=1;
var defaultPreferencesSigfigDecimalComboIndex=0;
var defaultPreferencesThousandsSeparators=1;
var defaultPreferencesThousandsSeparatorCharacter=0;
var defaultPreferencesRadixCharacter=0;
var defaultRuntimePreferenceCommaLocale=0;
var defaultPreferencesCheckForUpdates=1;
var defaultPreferencesSkipUpdateToRevision="-1";
var defaultPreferencesExpandedWidth=323;
var defaultPreferencesExpandedHeight=235;
var defaultPreferencesFrontViewState=0;
var defaultPreferencesIsRetinaDisplay=0;
var preferencesRadians=defaultPreferencesRadians; 
var preferencesPercentIsModulus=defaultPreferencesPercentIsModulus;
var preferencesMultiplicationSymbol=defaultPreferencesMultiplicationSymbol; 
var preferencesNumberFormattingType=defaultPreferencesNumberFormattingType; 
var preferencesSigfigDecimalComboIndex=defaultPreferencesSigfigDecimalComboIndex; 
var preferencesThousandsSeparators=defaultPreferencesThousandsSeparators; 
var preferencesThousandsSeparatorCharacter=defaultPreferencesThousandsSeparatorCharacter; 
var preferencesRadixCharacter=defaultPreferencesRadixCharacter; 
var runtimePreferenceCommaLocale=defaultRuntimePreferenceCommaLocale; 
var preferencesCheckForUpdates=defaultPreferencesCheckForUpdates;
var preferencesSkipUpdateToRevision=defaultPreferencesSkipUpdateToRevision; 
var preferencesExpandedWidth=defaultPreferencesExpandedWidth;
var preferencesExpandedHeight=defaultPreferencesExpandedHeight;
var preferencesFrontViewState=defaultPreferencesFrontViewState; 
var preferencesIsRetinaDisplay=defaultPreferencesIsRetinaDisplay; 
var self=this;
this.loadPreferences=function() {
var tempPreference=-1;
var upgradingFromVersion1=0;
self.refreshPreferencesRetinaDisplay();
if (!window.widget) { 
return;
}
tempPreference=parseInt(widget.preferenceForKey("thisVersionNumber"));
if (!isNaN(tempPreference) && tempPreference!=-1 && tempPreference!=0) {
upgradingFromVersion1=1;
widget.setPreferenceForKey(-1,"thisVersionNumber");
}
widget.setPreferenceForKey(widgetVersionNumber,"versionNumber");
widget.setPreferenceForKey(widgetRevisionNumber,"revisionNumber");
if (upgradingFromVersion1) {
self.setPreferencesNumberFormattingType(parseInt(widget.preferenceForKey("preferencesAnswerFormatting")));
widget.setPreferenceForKey(-1,"preferencesAnswerFormatting"); 
self.setPreferencesPercentIsModulus(parseInt(widget.preferenceForKey("preferencesProgrammerMode")));
widget.setPreferenceForKey(-1,"preferencesProgrammerMode"); 
self.setPreferencesSigfigDecimalComboIndex(parseInt(widget.preferenceForKey("preferencesPrecision")));
widget.setPreferenceForKey(-1,"preferencesPrecision"); 
} else {
self.setPreferencesNumberFormattingType(parseInt(widget.preferenceForKey("preferencesNumberFormattingType")));
self.setPreferencesPercentIsModulus(parseInt(widget.preferenceForKey("preferencesPercentIsModulus")));
self.setPreferencesSigfigDecimalComboIndex(parseInt(widget.preferenceForKey("preferencesSigfigDecimalComboIndex")));
}
self.setPreferencesRadians(parseInt(widget.preferenceForKey("preferencesRadians")));
self.setPreferencesMultiplicationSymbol(parseInt(widget.preferenceForKey("preferencesMultiplicationSymbol")));
self.setPreferencesThousandsSeparators(parseInt(widget.preferenceForKey("preferencesThousandsSeperators")));
self.setPreferencesThousandsSeparatorCharacter(parseInt(widget.preferenceForKey("preferencesThousandsSeperatorCharacter"))); 
self.refreshPreferencesCommaLocale();
self.setPreferencesRadixCharacter(parseInt(widget.preferenceForKey("preferencesRadixCharacter")));
self.setPreferencesCheckForUpdates(parseInt(widget.preferenceForKey("preferencesCheckForUpdates")));
self.setPreferencesSkipUpdateToRevision(widget.preferenceForKey("preferencesSkipUpdateToRevision"));
self.setPreferencesFrontViewState(parseInt(widget.preferenceForKey("preferencesKeypadIsHidden")));
self.setPreferencesExpandedWidth(parseInt(widget.preferenceForKey("preferencesExpandedWidth")));
if (preferencesExpandedWidth>=(window.screen.width-100)) {
self.setPreferencesExpandedWidth(window.screen.width-100);
} else if (preferencesExpandedWidth<297) {
self.setPreferencesExpandedWidth(297);
}
self.setPreferencesExpandedHeight(parseInt(widget.preferenceForKey("preferencesExpandedHeight")));
if (preferencesExpandedHeight>=(window.screen.height-100)) {
self.setPreferencesExpandedHeight(window.screen.height-100);
} else if (preferencesExpandedHeight<106) {
self.setPreferencesExpandedHeight(106);
}
}
this.setPreferencesRadians=function(newPreferencesRadians) {
if (!isNaN(newPreferencesRadians) && (newPreferencesRadians==0 || newPreferencesRadians==1)) {
preferencesRadians=newPreferencesRadians;
} else {
preferencesRadians=defaultPreferencesRadians;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesRadians,"preferencesRadians");
}
}
this.getPreferencesRadians=function() {
return preferencesRadians;
}
this.setPreferencesNumberFormattingType=function(newNumberFormattingType) { 
if (!isNaN(newNumberFormattingType) && newNumberFormattingType>=1 && newNumberFormattingType<=7) { 
preferencesNumberFormattingType=newNumberFormattingType;
} else {
preferencesNumberFormattingType=defaultPreferencesNumberFormattingType;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesNumberFormattingType,"preferencesNumberFormattingType");
}
}
this.getPreferencesNumberFormattingType=function() {
return preferencesNumberFormattingType;
}
this.incrementPreferencesNumberFormattingType=function() {
var newPreferencesNumberFormattingType=preferencesNumberFormattingType+1;
if (newPreferencesNumberFormattingType>7) {
newPreferencesNumberFormattingType=1;
}
self.setPreferencesNumberFormattingType(newPreferencesNumberFormattingType)
}
this.decrementPreferencesNumberFormattingType=function() {
var newPreferencesNumberFormattingType=preferencesNumberFormattingType-1;
if (newPreferencesNumberFormattingType<1) {
newPreferencesNumberFormattingType=7;
}
self.setPreferencesNumberFormattingType(newPreferencesNumberFormattingType)
}
this.setPreferencesPercentIsModulus=function(newPreferencesPercentIsModulus) {
if (!isNaN(newPreferencesPercentIsModulus) && (newPreferencesPercentIsModulus==0 || newPreferencesPercentIsModulus==1)) {
preferencesPercentIsModulus=newPreferencesPercentIsModulus;
} else {
preferencesPercentIsModulus=defaultPreferencesPercentIsModulus;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesPercentIsModulus,"preferencesPercentIsModulus");
}
}
this.getPreferencesPercentIsModulus=function() {
return preferencesPercentIsModulus;
}
this.setPreferencesMultiplicationSymbol=function(newPreferencesMultiplicationSymbol) {
if (!isNaN(newPreferencesMultiplicationSymbol) && (newPreferencesMultiplicationSymbol==0 || newPreferencesMultiplicationSymbol==1)) { 
preferencesMultiplicationSymbol=newPreferencesMultiplicationSymbol;
} else {
preferencesMultiplicationSymbol=defaultPreferencesMultiplicationSymbol;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesMultiplicationSymbol,"preferencesMultiplicationSymbol");
}
}
this.getPreferencesMultiplicationSymbol=function() {
return preferencesMultiplicationSymbol;
}
this.setPreferencesCheckForUpdates=function(newPreferencesCheckForUpdates) {
if (!isNaN(newPreferencesCheckForUpdates) && (newPreferencesCheckForUpdates==0 || newPreferencesCheckForUpdates==1)) { 
preferencesCheckForUpdates=newPreferencesCheckForUpdates;
} else {
preferencesCheckForUpdates=defaultPreferencesCheckForUpdates;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesCheckForUpdates,"preferencesCheckForUpdates");
}
}
this.getPreferencesCheckForUpdates=function() {
return preferencesCheckForUpdates;
}
this.setPreferencesSkipUpdateToRevision=function(newPreferencesSkipUpdateToRevision) {
preferencesSkipUpdateToRevision=newPreferencesSkipUpdateToRevision;  
if (window.widget) {
widget.setPreferenceForKey(preferencesSkipUpdateToRevision,"preferencesSkipUpdateToRevision");
}
}
this.getPreferencesSkipUpdateToRevision=function() {
return preferencesSkipUpdateToRevision;
}
this.resetPreferencesSkipUpdateToRevision=function() {
self.setPreferencesSkipUpdateToRevision(defaultPreferencesSkipUpdateToRevision);
}
this.setPreferencesSigfigDecimalComboIndex=function(newPreferencesSigfigDecimalComboIndex) {
if (!isNaN(newPreferencesSigfigDecimalComboIndex) && (newPreferencesSigfigDecimalComboIndex>=0 && newPreferencesSigfigDecimalComboIndex<=21)) {
preferencesSigfigDecimalComboIndex=newPreferencesSigfigDecimalComboIndex;
} else {
preferencesSigfigDecimalComboIndex=defaultPreferencesSigfigDecimalComboIndex;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesSigfigDecimalComboIndex,"preferencesSigfigDecimalComboIndex");
}
}
this.getPreferencesSigfigDecimalComboIndex=function() {
return preferencesSigfigDecimalComboIndex;
}
this.getPreferencesSignificantFigures=function() { 
var preferencesSignificantFiguresReference=-1;
if (preferencesSigfigDecimalComboIndex>0 && preferencesSigfigDecimalComboIndex<11) { 
preferencesSignificantFiguresReference=preferencesSigfigDecimalComboIndex;
}
return preferencesSignificantFiguresReference;
}
this.getPreferencesDecimalPlaces=function() { 
var preferencesDecimalPlacesReference=-1;
if (preferencesSigfigDecimalComboIndex>10 && preferencesSigfigDecimalComboIndex<22) {
preferencesDecimalPlacesReference=preferencesSigfigDecimalComboIndex-11;
}
return preferencesDecimalPlacesReference;
}
this.setPreferencesThousandsSeparators=function(newPreferencesThousandsSeparators) {
if (!isNaN(newPreferencesThousandsSeparators) && (newPreferencesThousandsSeparators==0 || newPreferencesThousandsSeparators==1)) { 
preferencesThousandsSeparators=newPreferencesThousandsSeparators;
} else {
preferencesThousandsSeparators=defaultPreferencesThousandsSeparators;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesThousandsSeparators,"preferencesThousandsSeperators");
}
}
this.getPreferencesThousandsSeparators=function() {
return preferencesThousandsSeparators;
}
this.setPreferencesThousandsSeparatorCharacter=function(newPreferencesThousandsSeparatorCharacter) {
if (!isNaN(newPreferencesThousandsSeparatorCharacter) && (newPreferencesThousandsSeparatorCharacter>=0 && newPreferencesThousandsSeparatorCharacter<=2)) { 
preferencesThousandsSeparatorCharacter=newPreferencesThousandsSeparatorCharacter;
} else {
preferencesThousandsSeparatorCharacter=defaultPreferencesThousandsSeparatorCharacter;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesThousandsSeparatorCharacter,"preferencesThousandsSeperatorCharacter");
}
}
this.getPreferencesThousandsSeparatorCharacter=function() {
return preferencesThousandsSeparatorCharacter;
}
this.setPreferencesExpandedWidth=function(newPreferencesExpandedWidth) {
if (!isNaN(newPreferencesExpandedWidth)) { 
preferencesExpandedWidth=newPreferencesExpandedWidth;
} else {
preferencesExpandedWidth=defaultPreferencesExpandedWidth;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesExpandedWidth,"preferencesExpandedWidth");
}
}
this.getPreferencesExpandedWidth=function() {
return preferencesExpandedWidth;
}
this.setPreferencesExpandedHeight=function(newPreferencesExpandedHeight) {
if (!isNaN(newPreferencesExpandedHeight)) { 
preferencesExpandedHeight=newPreferencesExpandedHeight;
} else {
preferencesExpandedHeight=defaultPreferencesExpandedHeight;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesExpandedHeight,"preferencesExpandedHeight");
}
}
this.getPreferencesExpandedHeight=function() {
return preferencesExpandedHeight;
}
this.setPreferencesFrontViewState=function(newPreferencesFrontViewState) {
if (!isNaN(newPreferencesFrontViewState) && (newPreferencesFrontViewState>=0 && newPreferencesFrontViewState<=3)) {
preferencesFrontViewState=newPreferencesFrontViewState;
} else {
preferencesFrontViewState=defaultPreferencesFrontViewState;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesFrontViewState,"preferencesKeypadIsHidden");
}
}
this.getPreferencesFrontViewState=function() {
return preferencesFrontViewState;
}
this.setPreferencesRadixCharacter=function(newPreferencesRadixCharacter) {
if (!isNaN(newPreferencesRadixCharacter) && (newPreferencesRadixCharacter>=0 && newPreferencesRadixCharacter<=2)) {
preferencesRadixCharacter=newPreferencesRadixCharacter;
} else {
preferencesRadixCharacter=defaultPreferencesRadixCharacter;
}
if (window.widget) {
widget.setPreferenceForKey(preferencesRadixCharacter,"preferencesRadixCharacter");
}
if (preferencesRadixCharacter==0) { 
self.refreshPreferencesCommaLocale();
}
}
this.getPreferencesRadixCharacter=function() { 
return preferencesRadixCharacter;
}
this.refreshPreferencesCommaLocale=function() { 
var gDecimalSeparator;
if (window.widget) {
try {
var calc=widget.calculator;
gDecimalSeparator = calc.evaluateExpression("decimal_string", 16);
if (gDecimalSeparator==',') {
runtimePreferenceCommaLocale=1;
}
} catch (ex) {
}
}
}
this.switchThousandsSeparatorCharacterIfNecessary=function() {
var gThousandsSeparator;
if (self.getPreferencesCommaLocale()==1 && preferencesThousandsSeparatorCharacter==0) {
if (window.widget) {
try {
var calc=widget.calculator;
gThousandsSeparator = calc.evaluateExpression("thousands_separator", 16);
if (gThousandsSeparator==" ") {
self.setPreferencesThousandsSeparatorCharacter(1);
} else if (gThousandsSeparator=="'") {
self.setPreferencesThousandsSeparatorCharacter(2);
} else {
self.setPreferencesThousandsSeparatorCharacter(1); 
}
} catch (ex) {
}
}
}
}
this.getPreferencesCommaLocale=function() { 
if (preferencesRadixCharacter==1) {
return 0;
} 
if (preferencesRadixCharacter==2) {
return 1;
}
return runtimePreferenceCommaLocale;
}
this.refreshPreferencesRetinaDisplay=function() {
preferencesIsRetinaDisplay=0;
if (window.devicePixelRatio === undefined) { 
} else {
if (window.devicePixelRatio>=2) { 
preferencesIsRetinaDisplay=1;
}
}
}
this.getPreferencesIsRetinaDisplay=function() {
return preferencesIsRetinaDisplay;
}
this.getWidgetRevisionNumber=function() {
return widgetRevisionNumber;
}
this.getWidgetRevisionString=function() {
return widgetRevisionString;
}
}
