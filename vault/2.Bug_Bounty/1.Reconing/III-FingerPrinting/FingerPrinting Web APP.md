Process of fingerprinting web applications involves identifying technologies, WAF and server etc they are using.
Revealing the version of server is not good thing.
```bash
curl -I https://paypal.com
```
![[Screenshot_2025-07-22_04-17-06.png]]

Many tools can do this task without sending large amount of request to server so we can use whatweb for this.WhatWeb has more than 900 built-in plug-ins that can identify CMS (content management system), blogging platforms, JavaScript libraries, and web servers. It can also reveal email addresses, SQL errors, and much more.
```bash
whatweb http://demo-site.com/phpadmin/
```

we can use [wapppalyzer](https://github.com/wappalyzer/wappalyzer) extension or command line tools.  
After getting version of server or anything we can search for available exploits.
```bash
searchsploit phpmyadmin -s 4.8.1 -w
searchsploit --cve 2021-44444
```

-s for safe search and -w for web based reference. For CVE number we can use --cve.

[MITRE’s ]([https://cve.mitre.org/]):
Mitre is the primary database for CVEs, maintained by MITRE. It’s a standard reference for
publicly disclosed cybersecurity vulnerabilities, widely used by various security tools.

[Packetstorm](packetstormsecurity.com):
Packetstorm is known for providing detailed information about exploits, including proof-of-concept (POC) examples.

[SecurityFocus](https://seclists.org/bugtraq): 
Although Bugtraq has been shut down, its archives remain a valuable resource for historical
exploit data along with POC.

