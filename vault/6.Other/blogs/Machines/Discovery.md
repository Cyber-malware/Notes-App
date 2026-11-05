Company provide us only single Ip with mutiple Vhosts.

| Ip            | Vhost<br>                      |
| ------------- | ------------------------------ |
|               | drupal-dev.inlanefreight.local |
|               | drupal-qa.inlanefreight.local  |
|               | drupal-acc.inlanefreight.local |
| 10.129.42.195 | drupal.inlanefreight.local     |
|               | blog.inlanefreight.local       |
|               | dev.inlanefreight.local        |
|               | app.inlanefreight.local        |
So we add ip and vhosts in `/etc/hosts` file.
```bash
echo "10.129.42.195 app.inlanefreight.local dev.inlanefreight.local drupal-dev.inlanefreight.local drupal-qa.inlanefreight.local drupal-acc.inlanefreight.local drupal.inlanefreight.local blog.inlanefreight.local" | sudo tee -a /etc/hosts
```

Then we start out Enumeration process and scan all hosts with nmap.
```bash
┌──(kali㉿kali)-[~/Desktop/HTB]
└─$ sudo nmap -p 80,443,8000,8080,8180,8888,10000 --open -oA nmap_inlanefreight -iL hosts

Starting Nmap 7.95 ( https://nmap.org ) at 2025-08-31 09:25 EDT
Nmap scan report for app.inlanefreight.local (10.129.42.195)
Host is up (0.83s latency).
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for dev.inlanefreight.local (10.129.42.195)
Host is up (0.16s latency).
rDNS record for 10.129.42.195: app.inlanefreight.local
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for drupal-dev.inlanefreight.local (10.129.42.195)
Host is up (0.17s latency).
rDNS record for 10.129.42.195: app.inlanefreight.local
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for drupal-qa.inlanefreight.local (10.129.42.195)
Host is up (0.16s latency).
rDNS record for 10.129.42.195: app.inlanefreight.local
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for drupal-acc.inlanefreight.local (10.129.42.195)
Host is up (0.16s latency).
rDNS record for 10.129.42.195: app.inlanefreight.local
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for drupal.inlanefreight.local (10.129.42.195)
Host is up (0.16s latency).
rDNS record for 10.129.42.195: app.inlanefreight.local
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for blog.inlanefreight.local (10.129.42.195)
Host is up (0.16s latency).
rDNS record for 10.129.42.195: app.inlanefreight.local
Not shown: 6 closed tcp ports (reset)
PORT   STATE SERVICE
80/tcp open  http

Nmap done: 7 IP addresses (7 hosts up) scanned in 5.03 seconds
                                   

```

As we can see the hosts are up and next we will take screenshot of targets using Eyewitness.
```bash
eyewitness --web -x nmap_scans.xml -d inlanefreight_eyewitness 
```

