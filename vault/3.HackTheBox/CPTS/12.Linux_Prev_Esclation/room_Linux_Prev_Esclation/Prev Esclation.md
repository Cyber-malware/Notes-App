```bash
hostname       #tell you name of host
uname -a       #additional detail about kernal system
/proc/version  #proc file system provide info about linux flavour & version etc
/etc/issue     #info about OS but can be changed
```

### **Process:**

```bash
ps               #provide info about running processes
```

- PID       process id
- TTY      Terminal type used
- Time     Amount of time process used CPU
- CMD     command or executable running

```bash
ps -A           #view running process
ps axjf         #view process tree
```

![](Pasted%20image%2020250701122658.png)

```bash
ps aux       #aux show process for all users also user launced process etc
env          #show all enviroment variables.
```

![](Pasted%20image%2020250701122823.png)

The PATH variable may have a compiler or a scripting language (e.g. Python) that could be used to run code on the target system or leveraged for privilege escalation.

```bash
sudo -l            #show user that have permission to run cmd with root
id                 # overview of user prev level and group
/etc/passwd        # show user on system
cat /etc/passwd | cut -d ":" -f 1  
```

![](Pasted%20image%2020250701123451.png)
### **Netstat:**

```bash
netstat -a               #show all listning ports and connections
netstat -at  netstat -au #list Tcp or Udp protocols
netstat -l                 #list ports in listining mode
netstat -s     #list newtok usage but can be used with -t or -u to limit output
```

![](Pasted%20image%2020250701123801.png)

```bash
netstat -tp    #connection with service name and pid. -l to list listning ports
```

![](Pasted%20image%2020250701124013.png)

```bash
netstat -i     #show interface eth0 or tan0
```


![](Pasted%20image%2020250701124111.png)

```bash
netstat -ano
```
- `-a`: Display all sockets
- `-n`: Do not resolve names
- `-o`: Display timers

![](Pasted%20image%2020250701124228.png)

### **Find:**

```bash
find . -name flag1.txt #find the file named flag1.txt in the current directory
find /home -name flag1.txt #find the file names flag1.txt in the /home directory
find / -type d -name config #find the directory named config under “/”
find / -type f -perm 0777  #find files with the 777 permissions
find / -perm a=x #find executable files
find /home -user frank #find all files for user “frank” under “/home”
find / -mtime 10    #find files that were modified in the last 10 days
find / -atime 10    #find files that were accessed in the last 10 day
find / -cmin -60    #find files changed within the last hour (60 minutes)
find / -amin -60    #find files accesses within the last hour (60 minutes)
find / -size 50M    #find files with a 50 MB size

```
![](Pasted%20image%2020250701124507.png)

```bash
find / with -type f 2>/dev/null  #redirect errors to “/dev/null” and have a cleaner output (below)
```

![](Pasted%20image%2020250701124535.png)

```bash
find / -writable -type d 2>/dev/null    #Find world-writeable folders
find / -perm -222 -type d 2>/dev/null   #Find world-writeable folders
find / -perm -o w -type d 2>/dev/null   #Find world-writeable folders
```

![](Pasted%20image%2020250701124614.png)

```bash
find / -name perl*
find / -name python*
find / -name gcc*
```

```bash
find / -perm -u=s -type f 2>/dev/null      #search suid bit file
```

