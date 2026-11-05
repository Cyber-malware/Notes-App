
The XMLHttpRequest object is **a developers dream**, because you can:

- Update a web page without reloading the page
- Request data from a server - after the page has loaded
- Receive data from a server  - after the page has loaded
- Send data to a server - in the background

sending data
```xml
var xhttp = new XMLHttpRequest();  
xhttp.onreadystatechange = function() { 
    if (this.readyState == 4 && this.status == 200) {  
       // Typical action to be performed when the document is ready:  
       document.getElementById("demo").innerHTML = xhttp.responseText;  
    }  
};  
xhttp.open("GET", "_filename_", true);  
xhttp.send();
```

The **onreadystatechange** property specifies a function to be executed every time the status of the XMLHttpRequest object changes.
When **readyState** property is 4 and the **status** property is 200, the response is ready.
The **responseText** property returns the server response as a text string.
## XML Parser

The [XML DOM (Document Object Model)](https://www.w3schools.com/xml/dom_intro.asp) defines the properties and methods for accessing and editing XML.
However, before an XML document can be accessed, it must be loaded into an XML DOM object.
All modern browsers have a built-in XML parser that can convert text into an XML DOM object.
```
<html>  
<body>  
  
<p id="demo"></p>  
  
<script>  
var text, parser, xmlDoc;  
  
text = "<bookstore><book>" +  
"<title>Everyday Italian</title>" +  
"<author>Giada De Laurentiis</author>" +  
"<year>2005</year>" +  
"</book></bookstore>";  
  
parser = new DOMParser();  
xmlDoc = parser.parseFromString(text,"text/xml");  
  
document.getElementById("demo").innerHTML =  
xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;  
</script>  
  
</body>  
</html>
```
An XML DOM parser is created.
The parser creates a new XML DOM object using the text string.

## XMLHttpRequest

The [XMLHttpRequest Object](https://www.w3schools.com/xml/xml_http.asp) has a built in XML Parser.
The **responseText** property returns the response as a string.
The **responseXML** property returns the response as an XML DOM object.
If you want to use the response as an XML DOM object, you can use the responseXML property.
```
xmlDoc = xmlhttp.responseXML;  
txt = "";  
x = xmlDoc.getElementsByTagName("ARTIST");  
for (i = 0; i < x.length; i++) {  
    txt += x[i].childNodes[0].nodeValue + "<br>";  
}  
document.getElementById("demo").innerHTML = txt;
```

