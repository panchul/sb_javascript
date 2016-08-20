<!--

function HL() { src = event.toElement; if (src.tagName == "A") {src.oldcolor
= src.style.color; src.style.color = "FF0000"; }}
function HB() { src = event.fromElement; if (src.tagName == "A")
{src.style.color = src.oldcolor; }}
function HLB() {if (event.srcElement.tagName=="IMG")
event.srcElement.style.filter = "invert"; }
function HBB() {if (event.srcElement.tagName=="IMG")
event.srcElement.style.filter = ""; }

function PrintLinks() {
document.write('<center>' +
'<table  onMouseOver="HL()"onMouseOut="HB()"><tr><td>' +
'<center><font size="1" face="Arial">' +
'<a HREF="landing_page.html">Base Page</a>' +
' | <a HREF="chapter1/chapter1_landing_page.html">chapter1</a>' +
' | <a HREF="chapter1/chapter1_landing_page.html">chapter1</a>' +
' | <a HREF="chapter1/chapter1_landing_page.html">chapter1</a>' +
' | <a HREF="chapter1/chapter1_landing_page.html">chapter1</a>' +
'</font></center></td></tr></table>' +
'</center>');
}

function PrintLinksChapter() {
document.write('<center>' +
'<table  onMouseOver="HL()"onMouseOut="HB()"><tr><td>' +
'<center><font size="1" face="Arial">' +
'<a HREF="../landing_page.html">Base Page</a>' +
' | <a HREF="../chapter1/chapter1_landing_page.html">chapter1</a>' +
' | <a HREF="../chapter1/chapter1_landing_page.html">chapter1</a>' +
' | <a HREF="../chapter1/chapter1_landing_page.html">chapter1</a>' +
' | <a HREF="../chapter1/chapter1_landing_page.html">chapter1</a>' +
'</font></center></td></tr></table>' +
'</center>');
}

function PrintFooter() {
document.write('<center><hr WIDTH="100%">');
PrintLinks();

document.write('<font SIZE="1" face="Arial">© 1999-2001 Alex Panchul, All Rights Reserved.<br>' +
'<br>Last updated on ' +
document.lastModified +
'</font><br><br></center>');
}

function PrintFooterChapter() {
document.write('<center><hr WIDTH="100%">');
PrintLinksChapter();

document.write('<font SIZE="1" face="Arial">© 1999-2001 Alex Panchul, All Rights Reserved.<br>' +
'<br>Last updated on ' +
document.lastModified +
'</font><br><br></center>');
}

function PrintMTableHeader() {
document.write('<br><br><table BORDER="0" WIDTH="100%" onMouseOver="HL()"onMouseOut="HB()">'+
	'<tr><td valign="top" align="right"><font size="2" face="Arial">');
}

function PrintMTableBetweenColumns() {
document.write('</font></td><td width="30"></td><td width="80%">' +
	'<font size="2" face="Arial">');
}

function PrintMTableFooter() {
document.write('</font></td></tr></table>');
}

function PrintNextPrewHeader() {
document.write('<center><font size="3" face="Arial"><b>');
}


function PrintNextPrewFooter() {
document.write('</b></font></center>');
}

//-->
