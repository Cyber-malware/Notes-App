we can find version information with curl, grep and by looking in source code.

```html
...SNIP...
<link rel='https://api.w.org/' href='http://blog.inlanefreight.com/index.php/wp-json/' />
<link rel="EditURI" type="application/rsd+xml" title="RSD" href="http://blog.inlanefreight.com/xmlrpc.php?rsd" />
<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="http://blog.inlanefreight.com/wp-includes/wlwmanifest.xml" /> 
<meta name="generator" content="WordPress 5.3.3" />
...SNIP...
```

```bash
curl -s -X GET http://blog.inlanefreight.com | grep '<meta name="generator"'
```

Aside from version information, the source code may also contain comments that may be useful. Links to CSS (style sheets) and JS (JavaScript) can also provide hints about the version number.
#### WP Version - CSS

```html
...SNIP... 
<link rel='stylesheet' id='transportex_color-css'  href='http://blog.inlanefreight.com/wp-content/themes/ben_theme/css/colors/default.css?ver=5.3.3' type='text/css' media='all' />
...SNIP...
```
#### WP Version - JS

```html
...SNIP...
<script type='text/javascript' src='http://blog.inlanefreight.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.4.1'></script>
<script type='text/javascript' src='http://blog.inlanefreight.com/wp-content/plugins/mail-masta/lib/subscriber.js?ver=5.3.3'></script>
...SNIP...
```

An other source is `readme.html` file in WordPress's root directory.

# Plugins and Themes Enumeration

Same as we can find theme and plugin versions.
#### Plugins
```bash
curl -s -X GET http://blog.inlanefreight.com | sed 's/href=/\n/g' | sed 's/src=/\n/g' | grep 'wp-content/plugins/*' | cut -d"'" -f2
```
#### Themes
```bash
curl -s -X GET http://blog.inlanefreight.com | sed 's/href=/\n/g' | sed 's/src=/\n/g' | grep 'themes' | cut -d"'" -f2
```

all installed plugins and themes can be discovered passively.we have to send requests to the server actively to enumerate them by sending a GET request that points to a directory or file that may exist on the server. If file does't exist then we may be redirected.

```bash
curl -I -X GET http://blog.inlanefreight.com/wp-content/plugins/mail-masta

HTTP/1.1 301 Moved Permanently
Date: Wed, 13 May 2020 20:08:23 GMT
Server: Apache/2.4.29 (Ubuntu)
Location: http://blog.inlanefreight.com/wp-content/plugins/mail-masta/
Content-Length: 356
Content-Type: text/html; charset=iso-8859-1
```

we received 404 not found error 

```bash
 curl -I -X GET http://blog.inlanefreight.com/wp-content/plugins/someplugin

HTTP/1.1 404 Not Found
Date: Wed, 13 May 2020 20:08:18 GMT
Server: Apache/2.4.29 (Ubuntu)
Expires: Wed, 11 Jan 1984 05:00:00 GMT
Cache-Control: no-cache, must-revalidate, max-age=0
Link: <http://blog.inlanefreight.com/index.php/wp-json/>; rel="https://api.w.org/"
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8
```

write or use tools like wpscan/wfuzz tools to speed up process.

# Directory Indexing

We should also look for deactivate plugins because they are very useful and deactivate them is not good process.

![[Pasted image 20250714090730.png]]

we can see that we still have access to the `Mail Masta` plugin.

![[Pasted image 20250714090748.png]]

using cURL and convert the HTML output to a nice readable format using `html2text`

```bash
 curl -s -X GET http://blog.inlanefreight.com/wp-content/plugins/mail-masta/ | html2text

****** Index of /wp-content/plugins/mail-masta ******
[[ICO]]       Name                 Last_modified    Size Description
===========================================================================
[[PARENTDIR]] Parent_Directory                         -  
[[DIR]]       amazon_api/          2020-05-13 18:01    -  
[[DIR]]       inc/                 2020-05-13 18:01    -  
[[DIR]]       lib/                 2020-05-13 18:01    -  
[[   ]]       plugin-interface.php 2020-05-13 18:01  88K  
[[TXT]]       readme.txt           2020-05-13 18:01 2.2K  
===========================================================================
     Apache/2.4.29 (Ubuntu) Server at blog.inlanefreight.com Port 80
```

Directory listing should be disabled.