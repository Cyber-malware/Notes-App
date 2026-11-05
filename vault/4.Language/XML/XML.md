XML stand for Extensible markup language that is used to carry data. It is similar to HTML but it focus more on what data transfer while HTML focus on how data looks. XML not use predefined tags.

![[Pasted image 20250719033732.png]]
```xml
<?xml version="1.0" encoding="UTF-8**"**?>  
<bookstore>  
  <book category="cooking">  
    <title lang="en">Everyday Italian</title>  
    <author>Giada De Laurentiis</author>  
    <year>2005</year>  
    <price>30.00</price>  
  </book>  
  <book category="children">  
    <title lang="en">Harry Potter</title>  
    <author>J K. Rowling</author>  
    <year>2005</year>  
    <price>29.99</price>  
  </book>  
  <book category="web">  
    <title lang="en">Learning XML</title>  
    <author>Erik T. Ray</author>  
    <year>2003</year>  
    <price>39.95</price>  
  </book>  
</bookstore>
```

An XML tree starts at a **root element** and branches from the root to **child elements**.Children have parent and parent have children while sibling are children on same level like (bro or sis).

**Naming Rules:**
- Element names are case-sensitive
- Element names must start with a letter or underscore
- Element names cannot start with the letters xml (or XML, or Xml, etc)
- Element names can contain letters, digits, hyphens, underscores, and periods
- Element names cannot contain spaces

XML documents can contain international characters, like Norwegian øæå or French êèé.
To avoid errors, you should specify the encoding used, or save your XML files as UTF-8.
UTF-8 is the default character encoding for XML documents.
Character encoding can be studied in our [Character Set Tutorial](https://www.w3schools.com/charsets/default.asp).

XML tags are case senstive.It should be properly Nested.
```xml
<b><i>This text is bold and italic</b></i>
```

Attribule value must be quoted.
```xml
<note date="12/11/2007">  
  <to>Tove</to>  
  <from>Jani</from>  
</note>
```

If you place character inside XML element it generate error. so replace with entity reference.
```xml
<message>salary &lt; 1000</message>
```

|        |     |                |
| ------ | --- | -------------- |
| &lt;   | <   | less than      |
| &gt;   | >   | greater than   |
| &amp;  | &   | ampersand      |
| &apos; | '   | apostrophe     |
| &quot; | "   | quotation mark |
Book store and book are element content while other are text content.
```xml
<bookstore>  
  <book category="children">  
    <title>Harry Potter</title>  
    <author>J K. Rowling</author>  
    <year>2005</year>  
    <price>29.99</price>  
  </book>  
  <book category="web">  
    <title>Learning XML</title>  
    <author>Erik T. Ray</author>  
    <year>2003</year>  
    <price>39.95</price>  
  </book>  
</bookstore>
```

If attribute value contain double quote we can use single quote. You can use character entities
```xml
<gangster name='George "Shotgun" Ziegler'>
<gangster name="George &quot;Shotgun&quot; Ziegler">
```

Some things to consider when using attributes are:
- attributes cannot contain multiple values (elements can)
- attributes cannot contain tree structures (elements can)
- attributes are not easily expandable (for future changes)

```xml
<note day="10" month="01" year="2008"  
to="Tove" from="Jani" heading="Reminder"  
body="Don't forget me this weekend!">  
</note>
```

If these XML fragments were added together, there would be a name conflict. Both contain a table element, but the elements have different content and meaning.
A user or an XML application will not know how to handle these differences

```xml
<table>  
  <tr>  
    <td>Apples</td>  
    <td>Bananas</td>  
  </tr>  
</table>
```

```xml
<table>  
  <name>African Coffee Table</name>  
  <width>80</width>  
  <length>120</length>  
</table>
```

Name issue can easily be solved through prefixes
```xml
<h:table>  
  <h:tr>  
    <h:td>Apples</h:td>  
    <h:td>Bananas</h:td>  
  </h:tr>  
</h:table>  
  
<f:table>  
  <f:name>African Coffee Table</f:name>  
  <f:width>80</f:width>  
  <f:length>120</f:length>  
</f:table
```

When using prefixes in XML, a **namespace** for the prefix must be defined.
The namespace can be defined by an **xmlns** attribute in the start tag of an element.
The namespace declaration has the following syntax. xmlns:_prefix_="_URI_".

```xml
<root>  
  
<h:table xmlns:h="http://www.w3.org/TR/html4/">  
  <h:tr>  
    <h:td>Apples</h:td>  
    <h:td>Bananas</h:td>  
  </h:tr>  
</h:table>  
  
<f:table xmlns:f="https://www.w3schools.com/furniture">  
  <f:name>African Coffee Table</f:name>  
  <f:width>80</f:width>  
  <f:length>120</f:length>  
</f:table>  
  
</root>
```

The namespace URI is not used by the parser to look up information.
The purpose of using an URI is to give the namespace a unique name.
However, companies often use the namespace as a pointer to a web page containing namespace information.

```xml
<?xml version="1.0" encoding="UTF-8**"**?>  
  
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">  
  
<xsl:template match="/">  
<html>  
<body>  
  <h2>My CD Collection</h2>  
  <table border="1">  
    <tr>  
      <th style="text-align:left">Title</th>  
      <th style="text-align:left">Artist</th>  
    </tr>  
    <xsl:for-each select="catalog/cd">  
    <tr>  
      <td><xsl:value-of select="title"/></td>  
      <td><xsl:value-of select="artist"/></td>  
    </tr>  
    </xsl:for-each>  
  </table>  
</body>  
</html>  
</xsl:template>  
  
</xsl:stylesheet>
```

XSLT is a language that can be used to transform XML documents into other formats.
The XML document below, is a document used to transform XML into HTML.
The [name](http://www.w3.org/1999/XSL/Transform) space identifies XSLT elements inside an HTML document: