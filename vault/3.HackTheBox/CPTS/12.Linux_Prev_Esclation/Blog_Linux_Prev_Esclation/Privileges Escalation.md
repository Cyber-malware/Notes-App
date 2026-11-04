Privileges mean what a user is permitted to do. Common privileges include viewing and editing files or modifying system files. Privilege escalation refers to when user receives privileges they are not to be.

Privilege escalation is exploiting a bug, design flaw, or configuration oversight in an operating system or software application to gain elevated access.

![](Pasted%20image%2020250701091740.png)

Linux is from UNIX so it have same settings.On a UNIX web server, every single file and folder stored on the hard drive has a set of permissions associated with it.

![](Pasted%20image%2020250701091830.png)

what need to perform Privilege Escalation.
- Read/Write any sensitive file
- Persist easily between reboots
- Insert a permanent backdoor

## Techniques
Kernel Exploit 
Services running as root
SUID exploitable
SUDO rights
Cron jobs