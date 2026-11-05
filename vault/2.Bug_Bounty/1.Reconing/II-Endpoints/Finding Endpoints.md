WebArchive can reveal directories, file structures, and endpoints that have been historically archived and were previously part of the website.
```bash
http://web.archive.org/cdx/search/cdx?url=paypal.com/*&output=text&fl=original&collapse=urlkey
```

**GAU for Endpoint:**
Extracted URLs were filtered to return only subdomains associated with our target domain. However, the raw results without filtering will contain endpoints.
```
echo paypal.com | gau --threads 10 --o gau.txt
```

```bash
cat urls.txt | gau --threads 10 --o gau.txt
```

```Note
if you wish to skip URLs with specific extensions, you can use the “--blacklist” flag followed by extensions you wish to skip. Similarly, to include subdomains during your search, use the “--sub” flag.
```

We will remove duplicate using tools [Uro](https://github.com/s0md3v/uro).
```bash
cat gau.txt | sort -u | uro
```

**Extracting Subdomains and Endpoints from Js files:**

Js files can contain useful info like subdomain, username, pass and API keys etc.so will will Extract subdomains.
```bash
curl -s www.paypalobjects.com/pa/mi/paypal/latmconf.js| grep -Po "((http|https):\/\/)?(([\w.-]*)\.([\w]*)\. ([A-z]))\w+" | sort -u | grep paypal.com
```

Now we will extract endpoints from Js files
```bash
curl -s www.paypalobjects.com/pa/mi/paypal/latmconf.js| grep -oh "\"\/[a-zA-Z0-9_/?=&]*\"" | sed -e 's/^"//' -e 's/"$//' | sort -u
```

Now a days js files are deobfuscate so we will use tools [JSbeautify](https://github.com/beautify-web/js-beautify).
```bash
js-beautify example.js > beautify-example.js
```

