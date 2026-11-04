Template engines have become widely popular in modern web development because they allow developers to generate more dynamic content with less code. HTML/CSS kept separate from server side code.
```html
<html>
<head>
<title> {{page_title}} </title>
</head>
<body>
<h1> {{heading}} </h1>
<p> {{content}} </p>
</body>
</html>
```

#### **IMP:**
All SSTi payload and exploit include [velocity](https://gosecure.github.io/template-injection-workshop/#0).

In this template, {{page_title}}, {{heading}}, and {{content}} are placeholders
for dynamic content.On the server side, these placeholders are populated with actual content. 
```python
@app.route('/')
def home():
return render_template('template.html', page_title="Home Page", heading="Welcome to the game", content="This is my home page.")
```
This code fills in the page_title, heading, and content placeholders with the
specified strings.

SSTI occur when user supplied input is not sanitized and directly injected in  template can lead to RCE.
Templates are in many languages.
- Smarty (PHP)
- Blade (PHP, used with Laravel)
- Pug (formerly Jade, JavaScript)
- Liquid (Ruby, used by Shopify)
- Freemarker (Java)
- Twig (PHP, used with Symfony)
- Mustache (cross-platform)
- Jinja2 (Python)
- Mako(Python)

To identify SSTI use a polyglot payload `${{<%[%’ ”}}%\`if vuln exist it may provide an error.
SSTI can occur in two distinct contexts, each requiring its own detection method

**Plain context**
In plain context user input is treated as text not code and reflected back by web Application.
```example
https://vulnerablebank.com/?username=Hello {{name}}
```
It has less risk but can lead to Xss etc. its often confused with CSTI (Client side Template Injection).

**code context**
In code context, the user-supplied input is directly inserted within the code blocks or statements, and the template injection subsequently interprets it and executes it as code. The consequences in this case could be as severe as RCE.
Try the payloads like  `{{7 * 7}}` or `{{48 / 6}}`  if code render so result will be 7 and 8.

some time error showing may be off so we can use other methods such as examining the application’s environment, such as known tech stack, or looking for other signs in the way it processes template syntax, which can differ from one engine to another.We ca try to inject [mathematical operation](https://blackhat.com/docs/us-15/materials/us-15-Kettle-Server-Side-Template-Injection-RCE-For-The-Modern-Web-App-wp.pdf).
![file:///tmp/.OMPJA3/1.png](file:///tmp/.OMPJA3/1.png)

