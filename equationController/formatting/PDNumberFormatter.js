function PDNumberFormatter () {
var roundingNumber=new Array();
var decimalLocation=-1
var exponentLocation=1;
var negative='';
var displayExponent=0;
var self=this;
var preferencesNumberFormattingType=1; 
var preferencesSignificantFigures=-1;
var preferecesDecimalPlaces=-1;
var preferencesThousandsSeparators=1;
var decimalCharacter='.';
var exponentCharacter='e';
var thousandsSeparatorCharacter=',';	
this.init=function() {
}
this.setPreferencesNumberFormattingType=function(newPreferencesNumberFormattingType) { 
preferencesNumberFormattingType=newPreferencesNumberFormattingType;
}
this.setPreferencesSignificantFiguresAndDecimalPlaces=function(newPreferencesSignificantFigures, newPreferecesDecimalPlaces) { 
preferencesSignificantFigures=newPreferencesSignificantFigures;
preferecesDecimalPlaces=newPreferecesDecimalPlaces;
}
this.setPreferencesThousandsSeparators=function(newPreferencesThousandsSeparators) { 
preferencesThousandsSeparators=newPreferencesThousandsSeparators;
}
this.setDecimalCharacter=function(newDecimalCharacter) {
decimalCharacter=newDecimalCharacter;
}
this.setExponentCharacter=function(newExponentCharacter) {
exponentCharacter=newExponentCharacter;
}
this.setThousandsSeparatorCharacter=function(newThousandsSeparatorCharacter) {
thousandsSeparatorCharacter=newThousandsSeparatorCharacter;
}
this.formattedNumberForNumber=function(numberToFormat) { 
self.reset();
var formattedNumber="";
if (preferencesNumberFormattingType<1 || preferencesNumberFormattingType>7) {
preferencesNumberFormattingType=1; 
}
switch(preferencesNumberFormattingType) {
case 1: 
case 2: 
case 3: 
case 4: 
self.setRoundingNumber(numberToFormat);
if (preferecesDecimalPlaces==-1) {
formattedNumber=self.roundToSignificantFigures(preferencesSignificantFigures);
} else {
formattedNumber=self.roundToDecimal(preferecesDecimalPlaces);
}
if (preferencesNumberFormattingType==4) { 
formattedNumber=self.formatPercentNumber(formattedNumber);
}
break;
case 5: 
formattedNumber=self.formattedBinaryNumberForNumber(numberToFormat);
break;
case 6: 
formattedNumber=self.formattedOctalNumberForNumber(numberToFormat);
break;
case 7: 
formattedNumber=self.formattedHexNumberForNumber(numberToFormat);
break;
}
return formattedNumber;
}
this.getNoiselessNumberForNumber=function(numberToMakeNoiseless) {
self.reset();
var formattedNumberString="";
self.setRoundingNumber(numberToMakeNoiseless);
formattedNumberString=self.parseFloatableStringForMasterNumber();
return parseFloat(formattedNumberString);
}
this.reset=function() {
roundingNumber=new Array();
decimalLocation=-1
exponentLocation=0;
negative='';
displayExponent=0;
}
this.setRoundingNumber = function(numberToSet) { 
var i, iStart=0, numberToSetString=numberToSet.toString();
var iEnd=numberToSetString.length;
var eLocation=numberToSetString.indexOf('e'); 
var encounteredInteger=0;
var originalDecimalLocation;
if (numberToSet<0) { 
iStart=1; 
negative='-';
} else if (numberToSet==0) { 
decimalLocation=1;
exponentLocation=0;
roundingNumber.push(0);
return; 
}
if (eLocation!=-1) { 
exponentLocation=parseInt(numberToSetString.substring(eLocation+1));
iEnd=eLocation; 
}
decimalLocation=numberToSetString.indexOf('.');
if (decimalLocation!=-1) {
originalDecimalLocation=decimalLocation;
decimalLocation-=iStart; 
numberToSetString=numberToSetString.replace('.', '');
iEnd--;
} else {
decimalLocation=iEnd-iStart;
originalDecimalLocation=iEnd;
}
i=iStart;
while(numberToSetString.charAt(i)=='0') { 
if (i>=originalDecimalLocation) { 
exponentLocation--;
} else { 
decimalLocation--;
}
i++;
}
for (i=i; i<iEnd; i++) { 
roundingNumber.push(numberToSetString.charCodeAt(i)-48);
}
this.removeTrailingZeros();
this.eliminateDoublePrecisionNoise();
}
this.eliminateDoublePrecisionNoise=function() {
var digitLimit=6;
var endLimit=7;
var repeatCount=0, i, startCount=1;
var localRoundingNumber=roundingNumber; 
var roundingNumberLength=roundingNumber.length;
var radixLocation=decimalLocation+exponentLocation;
if (radixLocation<0) {
radixLocation=0;
}
for (i=radixLocation; i<roundingNumberLength; i++) {
if (localRoundingNumber[i]==9) {
startCount=i;
repeatCount=0;
while (i<roundingNumberLength && localRoundingNumber[i]==9) {
i++;
repeatCount++;
}
i--; 
if (repeatCount>=digitLimit && (repeatCount+startCount)>=(roundingNumberLength-endLimit)) { 
this.truncateToLength(startCount);
}
} else if (localRoundingNumber[i]==0) { 
startCount=i;
repeatCount=0;
while (i<roundingNumberLength && localRoundingNumber[i]==0) {
i++;
repeatCount++;
}
i--; 
if (repeatCount>=digitLimit && (repeatCount+startCount)>=(roundingNumberLength-endLimit)) { 
this.truncateToLength(startCount);
}
}
}
}
this.roundToDecimal=function(decimalToRoundTo) { 
var localRoundingNumber=roundingNumber; 
var numberLength=localRoundingNumber.length;
var localAnswerFormatting=preferencesNumberFormattingType;
if (localAnswerFormatting==4) {
exponentLocation+=2;
localAnswerFormatting=1;
}
var sciPonent=this.getSciPonent(); 
var digitsToRoundTo=0, engLength, zeroNumber;
displayExponent=1; 
if (localAnswerFormatting==2 || sciPonent>14) { 
digitsToRoundTo=1+decimalToRoundTo;
this.truncateToLength(digitsToRoundTo);
this.addZerosToEnd(digitsToRoundTo-localRoundingNumber.length); 
sciPonent=this.getSciPonent(); 
exponentLocation=sciPonent;
decimalLocation=1;
} else if (localAnswerFormatting==3) { 
engLength=this.getEngLength(sciPonent);
digitsToRoundTo=decimalToRoundTo+engLength;
this.truncateToLength(digitsToRoundTo);
sciPonent=this.getSciPonent(); 
engLength=this.getEngLength(sciPonent);
digitsToRoundTo=decimalToRoundTo+engLength;
this.addZerosToEnd(digitsToRoundTo-localRoundingNumber.length); 
exponentLocation=sciPonent-engLength+1;
decimalLocation=engLength;
} else { 
displayExponent=0; 
decimalLocation+=exponentLocation;
exponentLocation=0;
digitsToRoundTo=sciPonent+1+decimalToRoundTo;
this.truncateToLength(digitsToRoundTo);
sciPonent=this.getSciPonent();
if (sciPonent<0) {
digitsToRoundTo=1+decimalToRoundTo;
} else {
digitsToRoundTo=sciPonent+1+decimalToRoundTo;
}
zeroNumber=this.isZeroNumber();
if (zeroNumber) { 
digitsToRoundTo=1+decimalToRoundTo;
decimalLocation=1;
}
if (decimalLocation<=0) {
this.addZerosToBeginning(0-decimalLocation+1);
decimalLocation=1;
}
this.addZerosToEnd(digitsToRoundTo-roundingNumber.length);
}
if (decimalLocation==0) { 
this.addZerosToBeginning(1);
decimalLocation++;
}
return this.stringForNumber();
}
this.isZeroNumber=function() {
var i;
for (i=0; i<roundingNumber.length; i++) {
if (roundingNumber[i]!=0) {
return 0;
}
}
return 1;
}
this.roundToSignificantFigures = function(digitsToRoundTo) {
var localRoundingNumber=roundingNumber; 
var numberLength=localRoundingNumber.length;
var localAnswerFormatting=preferencesNumberFormattingType;
if (arguments.length==2) {
localAnswerFormatting=arguments[1];
}
var zeroNumber;
if (localAnswerFormatting==4) {
exponentLocation=exponentLocation+2;
localAnswerFormatting=1;
}
var sciPonent=this.getSciPonent(); 
var engLength;
displayExponent=1; 
if (digitsToRoundTo==-1) { 
digitsToRoundTo=15;
if (sciPonent>=-5 && sciPonent<0) {
digitsToRoundTo+=sciPonent;
}
}
this.truncateToLength(digitsToRoundTo);
sciPonent=this.getSciPonent();
if (localAnswerFormatting==2 || (localAnswerFormatting==1 && (sciPonent>14 || sciPonent<-5))) { 
exponentLocation=sciPonent;
decimalLocation=1;
this.removeTrailingZeros();
} else if (localAnswerFormatting==3) { 
engLength=this.getEngLength(sciPonent);
exponentLocation=sciPonent+(1-engLength); 
decimalLocation=engLength;
this.removeTrailingZeros();
this.addZerosToEnd(engLength-localRoundingNumber.length); 
} else { 
displayExponent=0; 
zeroNumber=this.isZeroNumber();
if (zeroNumber) {
exponentLocation=0;
} else if (sciPonent<0) { 
this.addZerosToBeginning(0-sciPonent);
decimalLocation=1;
exponentLocation=0;
} else {
this.addZerosToEnd(sciPonent-localRoundingNumber.length+1); 
decimalLocation=sciPonent+1;
exponentLocation=0;
}
}
return this.stringForNumber();
}
this.printRoundingNumber=function() { 
return;
var i;
for (i=0; i<roundingNumber.length; i++) {
}
}
this.removeTrailingZeros=function() {
var zeroCount=0, i, lengthWanted;
i=roundingNumber.length-1;
while (roundingNumber[i]==0 && i>-1) {
i--;
zeroCount++;
}
if (zeroCount) {
if (zeroCount==roundingNumber.length) { 
zeroCount--;
}
if (zeroCount<1) { 
return;
}
lengthWanted=roundingNumber.length-zeroCount;
roundingNumber.splice(lengthWanted, roundingNumber.length-1);;
}
}
this.truncateToLength=function(lengthWanted) { 
var localRoundingNumber=roundingNumber; 
if (lengthWanted<localRoundingNumber.length && lengthWanted>0) { 
if (localRoundingNumber[lengthWanted]<5) { 
localRoundingNumber.splice(lengthWanted, localRoundingNumber.length-1);
} else { 
this.truncateWithRoundingToLength(lengthWanted); 
}
} else if (lengthWanted<0) { 
roundingNumber=new Array();
this.addZerosToBeginning(1);
exponentLocation=0;
decimalLocation=1;
} else if (lengthWanted==0) {
if (localRoundingNumber[0]>4) {
roundingNumber=new Array();
roundingNumber.unshift(1);
decimalLocation++;
} else { 
roundingNumber=new Array();
this.addZerosToBeginning(1);
exponentLocation=0;
decimalLocation=1;
}
}
}
this.truncateWithRoundingToLength=function(roundingLength) { 
var localRoundingNumber=roundingNumber; 
var i=roundingLength-1;
localRoundingNumber.splice(roundingLength, localRoundingNumber.length-roundingLength); 
while (i>-1 && ++localRoundingNumber[i]==10) {
localRoundingNumber[i]=0;
i--;
}
if (i==-1 && localRoundingNumber[0]==0) { 
localRoundingNumber.unshift(1); 
decimalLocation++; 
localRoundingNumber.pop(); 
}
}
this.addZerosToEnd=function(numberOfZerosToAdd) { 
var i;
for (i=0; i<numberOfZerosToAdd; i++) {
roundingNumber.push(0);
}
}
this.addZerosToBeginning=function(numberOfZerosToAdd) { 
var i;
for (i=0; i<numberOfZerosToAdd; i++) {
roundingNumber.unshift(0);
}		
}
this.getEngLength=function(sciPonent) { 
var engLength=0;
if (sciPonent>-1) {
engLength=sciPonent%3+1;
} else { 
engLength=3-(-1*sciPonent)%3; 
if (engLength==3) 
engLength=0;
engLength++;
}
return engLength;
}
this.getSciPonent=function() { 
return (exponentLocation+decimalLocation-1);
}
this.stringForNumber = function() { 
var localRoundingNumber=roundingNumber; 
var i, numberString="", exponentString="";
var numberHasMoreThanZeros=0;
numberString+=localRoundingNumber[0]; 
if (localRoundingNumber[0]!=0) {
numberHasMoreThanZeros=1;
}
for (i=1; i<localRoundingNumber.length; i++) { 
if (preferencesThousandsSeparators && i<decimalLocation && ((decimalLocation-i)%3)==0) { 
numberString+=thousandsSeparatorCharacter;
}
if (i==decimalLocation) {
numberString+=decimalCharacter;
}
numberString+=localRoundingNumber[i].toString(); 
if (localRoundingNumber[i]!=0) {
numberHasMoreThanZeros=1;
}
}	
if (displayExponent || exponentLocation!=0) {  
numberString=numberString+exponentCharacter+exponentLocation;
}
if (!numberHasMoreThanZeros) { 
return numberString;
}
return (negative + numberString);
}
this.parseFloatableStringForMasterNumber = function() { 
var i, numberString="";
var iLength=roundingNumber.length;
numberString+=roundingNumber[0]; 
if(decimalLocation!=1){
exponentLocation=exponentLocation+decimalLocation-1;
decimalLocation=1;
}
for (i=1; i<iLength; i++) { 
if (i==decimalLocation) {
numberString+='.';
}
numberString+=roundingNumber[i].toString(); 
}	
numberString=negative+numberString+'e'+exponentLocation;
return numberString;
}
this.formattedBinaryNumberForNumber=function(numberToFormat) {
var i, formattedBinaryNumber='', binaryLength, binaryModulus;
var flooredNumber=Math.floor(numberToFormat);
var flooredFlag="";
var negativeFlag="";
if (flooredNumber!=numberToFormat) {
flooredFlag=" (Floored)";
}
var binaryNumber=(Math.abs(flooredNumber)).toString(2);
if (flooredNumber<0) {
negativeFlag="-";
}
binaryNumber=binaryNumber.toString();
binaryLength=binaryNumber.length;
binaryModulus=4-binaryLength%4;
if (binaryModulus!=4) {
for (i=0; i<binaryModulus; i++) {
binaryNumber='0'+binaryNumber;
}
}
binaryLength-=4;
for (i=0; i<binaryLength; i+=4) {
formattedBinaryNumber=formattedBinaryNumber+binaryNumber.substr(i,4) + ' ';
}
formattedBinaryNumber=formattedBinaryNumber+''+binaryNumber.substr(i,4);
if (flooredNumber<0) { 
return "-0b"+formattedBinaryNumber+flooredFlag;
}
return negativeFlag+"0b"+formattedBinaryNumber+flooredFlag;
}
this.formattedOctalNumberForNumber=function(numberToFormat)
{	
var flooredNumber=Math.floor(numberToFormat);
var flooredFlag="";
if (flooredNumber!=numberToFormat) {
flooredFlag=" (Floored)";
}
var octNumber=(flooredNumber).toString(8);
if (flooredNumber<0) { 
return "-0o"+octNumber.substring(1)+flooredFlag;
}
return "0o"+octNumber+flooredFlag;
}
this.formattedHexNumberForNumber=function(numberToFormat)
{	
var flooredNumber=Math.floor(numberToFormat);
var flooredFlag="";
if (flooredNumber!=numberToFormat) {
flooredFlag=" (Floored)";
}
var hexNumber=(flooredNumber).toString(16);
hexNumber=hexNumber.toUpperCase();
if (flooredNumber<0) { 
return "-0x"+hexNumber.substring(1)+flooredFlag;
}
return "0x"+hexNumber+flooredFlag;
}
this.formatPercentNumber=function(percentNumber)
{	
return percentNumber+'%';
}
}
