The famous [EternalBlue](https://en.wikipedia.org/wiki/EternalBlue) and [SambaCry](https://thehackernews.com/2017/05/samba-rce-exploit.html) exploit, exploited smb service which generally runs as root. With just one exploit, an attacker can get remote code execution and Local Privilege Escalation as well.

You should always check if web servers, mail servers, database servers, etc. are running as root.

```
netstat-antup           show all ports running services
```

[MySQL UDF Dynamic Library](https://www.exploit-db.com/exploits/1518/) exploit lets you execute arbitrary commands from the mysql shell if running as root.

```
ps -aux | grep root          show services running as root
```

![](Pasted%20image%2020250701095025.png)
![](Pasted%20image%2020250701095032.png)

Binary exploit not much dangerous then kernel exploit because they only crash services that can automatically restart.

