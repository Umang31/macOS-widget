function PDHistoryViewController()
{
var variableCacheDiv = document.getElementById('variableCacheDiv');
var formulaCacheDiv = document.getElementById('formulaCacheDiv');	
var formulaCacheParentDiv = document.getElementById('formulaCacheParentDiv');	
var variableCacheScrollbar;
var variableCacheScrollArea;
var formulaCacheScrollbar;
var formulaCacheScrollArea;
var variableIDLastScrolledToInVariableCache=-1;
var parentView;
var variableCacheWidth=110;
var variableCacheGroupToggleValues=new Array(0, 1, 1, 1);
var initialClickX=0;
var initialVariableCacheWidth=110;
var self=this;
this.initWithParentView=function(newParentView) {
parentView=newParentView;
self.loadScrollbars();
self.refreshVariableCache();
document.getElementById("variableFormulaCacheResizeDiv").addEventListener("mousedown", self.resizeVariableFormulaCacheDividerMouseDown, true);
}
this.resetHistoryView=function() {
formulaCacheDiv.innerHTML='';
document.getElementById("variableCacheConstantsDiv").innerHTML="";
document.getElementById("variableCacheAutoDefinedDiv").innerHTML="";
document.getElementById("variableCacheDefinedDiv").innerHTML="";
self.refreshVariableCache();
variableIDLastScrolledToInVariableCache=-1;
variableCacheScrollArea.refresh();
variableCacheScrollbar.refresh();
formulaCacheScrollArea.refresh();
formulaCacheScrollbar.refresh();
}
this.loadScrollbars=function() {
variableCacheScrollbar = new AppleVerticalScrollbar(document.getElementById("variableCacheScrollBar"));
variableCacheScrollbar.setSize(15);
var retinaExtension="";
if (widgetController.getPreferenceController().getPreferencesIsRetinaDisplay()) {
retinaExtension="@2x";
}
variableCacheScrollbar.setTrackStart(variableCacheScrollbar.trackStartPath, 0);
variableCacheScrollbar.setTrackMiddle("images/scrollbars/scrollbartrack"+retinaExtension+".png");
variableCacheScrollbar.setTrackEnd(variableCacheScrollbar.trackEndPath, 0);
variableCacheScrollbar.setThumbStart("images/scrollbars/scrollbartop"+retinaExtension+".png", 4);
variableCacheScrollbar.setThumbMiddle("images/scrollbars/scrollbarmiddle"+retinaExtension+".png");
variableCacheScrollbar.setThumbEnd("images/scrollbars/scrollbarbottom"+retinaExtension+".png", 4);
variableCacheScrollArea = new AppleScrollArea(document.getElementById("variableCacheParentDiv"), variableCacheScrollbar);
variableCacheScrollArea.scrollsHorizontally = false;
variableCacheScrollArea.singlepressScrollPixels = 25;
formulaCacheScrollbar = new AppleVerticalScrollbar(document.getElementById("formulaCacheScrollBar"));
formulaCacheScrollbar.setSize(15);
formulaCacheScrollbar.setTrackStart(formulaCacheScrollbar.trackStartPath, 0);
formulaCacheScrollbar.setTrackMiddle("images/scrollbars/scrollbartrack"+retinaExtension+".png");
formulaCacheScrollbar.setTrackEnd(formulaCacheScrollbar.trackEndPath, 0);
formulaCacheScrollbar.setThumbStart("images/scrollbars/scrollbartop"+retinaExtension+".png", 4);
formulaCacheScrollbar.setThumbMiddle("images/scrollbars/scrollbarmiddle"+retinaExtension+".png");
formulaCacheScrollbar.setThumbEnd("images/scrollbars/scrollbarbottom"+retinaExtension+".png", 4);
formulaCacheScrollArea = new AppleScrollArea(formulaCacheParentDiv, formulaCacheScrollbar);
formulaCacheScrollArea.scrollsHorizontally = false;
formulaCacheScrollArea.singlepressScrollPixels = 25;
}
this.handleNumberFormattingDidChange=function() {
self.refreshVariableCacheNumberFormatting();
}
this.handleEquationJustCalculated=function(formulaToAdd, formulaResult) {
if (formulaToAdd=="" || formulaResult==-1) { 
return;
}
self.addFormulaToFormulaCache(formulaToAdd, formulaResult);
self.addResultToVariableCache(formulaResult); 
}
this.addResultToVariableCache=function(formulaResult) {
if (formulaResult.getIsErrorMessage()) { 
return;
}
var variableIDToAssign=formulaResult.getVariableToAssign();
var variableType;
var shouldScrollToNewVariable=0;
if (self.isVariableIDLastScrolledToInVariableCacheVisible()) {
shouldScrollToNewVariable=1;
}
self.refreshVariableCache();
if (shouldScrollToNewVariable) {
self.scrollToVariableIDInVariableCache(variableIDToAssign);
}
variableIDLastScrolledToInVariableCache=variableIDToAssign;
}
this.addFormulaToFormulaCache=function(formulaToAdd, formulaResult) { 
var htmlToAddToCache=self.getHTMLStringToAddToFormulaCache(formulaToAdd, formulaResult);
var scrollBarPositionPriorToRefresh=formulaCacheScrollArea.content.scrollHeight-(formulaCacheScrollArea.content.scrollTop+formulaCacheScrollArea.viewHeight);
formulaCacheDiv.innerHTML=formulaCacheDiv.innerHTML+htmlToAddToCache;
self.refreshSize();
if (scrollBarPositionPriorToRefresh<=10) { 
self.scrollToBottomOfFormulaCache();
}
}
this.getHTMLStringToAddToFormulaCache=function(formulaToAdd, formulaResult) {
var variableIDToAssign;
var variableToAssign;
var variableToAssignName="";
var formattedResultString="";
var htmlToAddToCache="";
var formulaID;
formulaID=formulaResult.getEquationIndex();
if (document.getElementById('formulaCacheDiv').innerHTML=="") {
htmlToAddToCache="<div class='fCFormula fCTop' onclick=\"evFwd(event, 1, "+formulaID+");\">" + formulaToAdd + "</div>"; 
} else {
htmlToAddToCache="<div class='fCFormula' onclick=\"evFwd(event, 1, "+formulaID+");\">" + formulaToAdd + "</div>"; 
}
if (formulaResult.getIsErrorMessage()) {
formattedResultString="Error: "+formulaResult.getErrorMessage();
htmlToAddToCache+="<div class='fCError'>"+formattedResultString+"</div>";
} else { 
variableIDToAssign=formulaResult.getVariableToAssign();
if (variableIDToAssign!=-1) { 
variableToAssign=globalVariableArray[variableIDToAssign];
variableToAssignName=globalVariableNamesArray[variableIDToAssign];
formattedResultString=widgetController.getNumberFormatter().formattedNumberForNumber(variableToAssign.getNumber());
if (variableToAssign.getType()==2) { 
htmlToAddToCache+="<div class='fCAnswer' onclick=\"evFwd(event, 0, "+variableIDToAssign+");\"><span class='fCAutoDefinedAnswer'>"+variableToAssignName+"</span>"+formattedResultString+"</div>";
} else { 
formattedResultString=globalVariableNamesArray[variableIDToAssign] + " = " + formattedResultString;
htmlToAddToCache+="<div class='fCAnswer' onclick=\"evFwd(event, 0, "+variableIDToAssign+");\">"+formattedResultString+"</div>";
}
}
}
return htmlToAddToCache;
}
this.scrollToBottomOfFormulaCache=function() {
formulaCacheScrollArea.verticalScrollTo(formulaCacheScrollArea.content.scrollHeight - formulaCacheScrollArea.viewHeight);
}
this.refreshVariableCache=function() {
var i, iLength=globalVariableArray.length;
var typeDivs=new Array();
typeDivs[1]=document.getElementById("variableCacheConstantsDiv");
typeDivs[2]=document.getElementById("variableCacheAutoDefinedDiv");
typeDivs[3]=document.getElementById("variableCacheDefinedDiv");
var currentVariableType=0;
for (i=0; i<iLength; i++) {
if (globalVariableArray[i].getIsDisplayUpdated()==false) {
if (document.getElementById('cache'+i)) {
document.getElementById('cache'+i).innerHTML=globalVariableNamesArray[i]+' = '+widgetController.getNumberFormatter().formattedNumberForNumber(globalVariableArray[i].getNumber());
} else {
currentVariableType=globalVariableArray[i].getType();
typeDivs[currentVariableType].innerHTML+="<div id='cache"+i+"' class='variableCacheVariable' onclick=\"evFwd(event, 0, "+i+");\">"+ globalVariableNamesArray[i] +' = '+widgetController.getNumberFormatter().formattedNumberForNumber(globalVariableArray[i].getNumber())+'</div>';
}
globalVariableArray[i].setIsDisplayUpdated(true);
}
}
self.refreshSize();
}
this.refreshSize=function() {
var widgetSize=parentView.getFrontViewSize();
document.getElementById("historyViewDiv").style.width = (widgetSize.width-18)+"px";
document.getElementById("historyViewDiv").style.height = (widgetSize.height-105)+"px";
self.refreshVariableCacheScrollBar();
self.refreshEquationHistoryScrollBar();
}
this.refreshEquationHistoryScrollBar=function() {
var isFormulaCacheScrollbarHidden=formulaCacheScrollbar.hidden; 
var widgetSize=parentView.getFrontViewSize();
self.updateFormulaCacheWidth(widgetSize.width); 
formulaCacheScrollArea.refresh(); 
if (isFormulaCacheScrollbarHidden!=formulaCacheScrollbar.hidden) { 
self.updateFormulaCacheWidth(widgetSize.width);
formulaCacheScrollArea.refresh();
}
}
this.updateFormulaCacheWidth=function(newWidgetWidth) { 
var newFormulaCacheContainerWidth=newWidgetWidth-18-(variableCacheWidth+1);
document.getElementById("formulaCacheContainerDiv").style.width = newFormulaCacheContainerWidth+"px";
document.getElementById("formulaCacheContainerDiv").style.left = (variableCacheWidth+1)+"px";
if (formulaCacheScrollbar.hidden) {
document.getElementById("formulaCacheParentDiv").style.width = newFormulaCacheContainerWidth+"px";
document.getElementById("formulaCacheDiv").style.width = (newFormulaCacheContainerWidth-10)+"px"; 
} else {
document.getElementById("formulaCacheParentDiv").style.width = (newFormulaCacheContainerWidth-15)+"px";
document.getElementById("formulaCacheDiv").style.width = (newFormulaCacheContainerWidth-10-15)+"px"; 
}
}
this.refreshVariableCacheScrollBar=function() { 
var variableCacheScrollBarHidden=variableCacheScrollbar.hidden;
self.updateVariableCacheWidth();
variableCacheScrollArea.refresh();
if (variableCacheScrollBarHidden!=variableCacheScrollbar.hidden) { 
self.updateVariableCacheWidth();
}
}
this.updateVariableCacheWidth=function() {
var widgetSize=parentView.getFrontViewSize();
var upperBoundSize=widgetSize.width-18-15-40; 
if (variableCacheWidth>=105 && variableCacheWidth<=115) { 
variableCacheWidth=110;
}
if (variableCacheWidth>upperBoundSize) {
variableCacheWidth=upperBoundSize;
}
if (variableCacheWidth<0) {
variableCacheWidth=0;
}
document.getElementById("variableFormulaCacheResizeDiv").style.left=(variableCacheWidth-3)+"px";
document.getElementById("variableCacheContainerDiv").style.width=variableCacheWidth+"px";
if (variableCacheScrollbar.hidden) { 
document.getElementById("variableCacheParentDiv").style.width = variableCacheWidth+"px";
} else {
document.getElementById("variableCacheParentDiv").style.width = (variableCacheWidth-15)+"px";
}
}
this.resizeVariableFormulaCacheDividerMouseDown=function(event) {
document.addEventListener("mousemove", self.resizeVariableFormulaCacheDividerMouseMove, true);
document.addEventListener("mouseup", self.resizeVariableFormulaCacheDividerMouseUp, true);
initialVariableCacheWidth=variableCacheWidth;
initialClickX=event.x;
event.preventDefault();
}
this.resizeVariableFormulaCacheDividerMouseMove=function(event) {
var deltaX=event.x-initialClickX;
variableCacheWidth=initialVariableCacheWidth+deltaX; 
self.refreshSize();
}
this.resizeVariableFormulaCacheDividerMouseUp=function(event) {
var deltaX=event.x-initialClickX;
variableCacheWidth=initialVariableCacheWidth+deltaX;
self.refreshSize();  
document.removeEventListener("mousemove", self.resizeVariableFormulaCacheDividerMouseMove, true);
document.removeEventListener("mouseup", self.resizeVariableFormulaCacheDividerMouseUp, true);
}
this.refreshVariableCacheNumberFormatting=function() {
var i, iLength=globalVariableArray.length;
var typeDivs=new Array();
typeDivs[1]=document.getElementById("variableCacheConstantsDiv");
typeDivs[2]=document.getElementById("variableCacheAutoDefinedDiv");
typeDivs[3]=document.getElementById("variableCacheDefinedDiv");
var currentVariableType=0;
for (i=0; i<iLength; i++) {
if (document.getElementById('cache'+i)) {
document.getElementById('cache'+i).innerHTML=globalVariableNamesArray[i]+' = '+widgetController.getNumberFormatter().formattedNumberForNumber(globalVariableArray[i].getNumber());
} else {
currentVariableType=globalVariableArray[i].getType();
typeDivs[currentVariableType].innerHTML+="<div id='cache"+i+"' class='variableCacheVariable' onclick=\"evFwd(event, 0, "+i+");\">"+ globalVariableNamesArray[i] +' = '+widgetController.getNumberFormatter().formattedNumberForNumber(globalVariableArray[i].getNumber())+'</div>';
}
}
self.refreshSize(); 
}
this.scrollToVariableIDInVariableCache=function(variableIDToScrollTo) {
if (variableIDToScrollTo==-1) {
return;
}
var variableDiv=document.getElementById("cache"+variableIDToScrollTo);
var scrollPosition=2; 
var variableIDDivBoxTop=variableDiv.offsetTop-variableCacheScrollArea.content.scrollTop;
var variableIDDivBoxBottom=variableIDDivBoxTop+14;
var locationToScrollTo=0;
if (variableCacheScrollArea.viewHeight<=14) { 
scrollPosition=1;
} else if (variableIDDivBoxTop>=0 && variableIDDivBoxBottom<=variableCacheScrollArea.viewHeight) { 
scrollPosition=0;
} else if (variableIDDivBoxTop<0) { 
scrollPosition=1;
} else if (variableIDDivBoxBottom>variableCacheScrollArea.viewHeight) { 
scrollPosition=2;
}
if (scrollPosition==1) { 
locationToScrollTo=variableDiv.offsetTop-2;
variableCacheScrollArea.verticalScrollTo(locationToScrollTo);
} else if (scrollPosition==2) { 
locationToScrollTo=variableDiv.offsetTop-variableCacheScrollArea.viewHeight+16;
variableCacheScrollArea.verticalScrollTo(locationToScrollTo);
}
}
this.isVariableIDLastScrolledToInVariableCacheVisible=function() {
if (variableIDLastScrolledToInVariableCache==-1) {
return 1;
}
var variableDiv=document.getElementById("cache"+variableIDLastScrolledToInVariableCache);
var variableIDDivBoxTop=variableDiv.offsetTop-variableCacheScrollArea.content.scrollTop;
var variableIDDivBoxBottom=variableIDDivBoxTop+14;
if (variableIDDivBoxBottom>0 && variableIDDivBoxTop<variableCacheScrollArea.viewHeight) {
return 1;
}
return 0;
}
this.toggleVariableCacheGroup=function(groupNumberToToggle) {
if (groupNumberToToggle<1 || groupNumberToToggle>3) { 
return;
}
var groupArrowNames=new Array("", "variableCacheConstantsArrow", "variableCacheAutoDefinedArrow", "variableCacheDefinedArrow");
var groupDivNames=new Array("", "variableCacheConstantsDiv", "variableCacheAutoDefinedDiv", "variableCacheDefinedDiv");
document.getElementById(groupArrowNames[groupNumberToToggle]).style.opacity=0.8;
if (variableCacheGroupToggleValues[groupNumberToToggle]) { 
document.getElementById(groupDivNames[groupNumberToToggle]).style.display='none';
document.getElementById(groupArrowNames[groupNumberToToggle]).src='images/variableCache/rightArrow.png';
variableCacheGroupToggleValues[groupNumberToToggle]=0;
} else {
document.getElementById(groupDivNames[groupNumberToToggle]).style.display='block';
document.getElementById(groupArrowNames[groupNumberToToggle]).src='images/variableCache/downArrow.png';
variableCacheGroupToggleValues[groupNumberToToggle]=1;
}
self.refreshSize();
}
}
