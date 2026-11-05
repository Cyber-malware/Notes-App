`Internet Information Services` It’s Microsoft’s web server software (serves web pages, handles ASP/.NET, static files, logs requests, etc.). Modern `IIS` uses long file names (`NTFS` supports long names), but the operating system still sometimes creates and exposes 8.3 short names for backwards compatibility with old programs, protocols, or tools.

`8.3` means at most 8 characters for the filename (the part before the dot) and exactly up to 3 characters for the extension (the part after the dot).

some admins disable the `8.3` generation to reduce the metadata and small class of enumeration attacks. But disabling it can break old applications.

#### Short FIle/Folder Name Enumeration
The enumeration process starts by sending requests with various characters  and server response with `200 ok` if exists. 

```http
http://example.com/~a
http://example.com/~b
http://example.com/~c
```

Continuing this procedure, the short name `secret~1` is eventually discovered when the server returns a `200 OK` status code for the request `http://example.com/~secret`. This can expose sensitive documents. 

Windows truncates and adds a `~n` sequence to avoid collisions:
- Take up to the first 6 characters of the base name, append `~1` (or `~2`, `~3`, …) if needed to make the short name unique.
- The extension is truncated to the first 3 characters.  
- Example: `applicationname.txt` → `applica~1.txt` (illustrative).

`malwareock.txt  `            `malwar~1.txt`
`app.cs.txt `                       `appcs~1.txt`
`Default.aspx `                   `Default~1.asp`            # extension bigger then 3 char
`rocketsf.txt`                        `rocketsf.txt`

![[Screenshot_2025-10-23_00-54-09.png]]
### Remove
```
Disallow characters
Any period character before last one
Any space characters
```

view short names in directory.
```
dir /x
```

## Enumeration

Initial phase involves mapping the target and determine which services are operating on their ports.
```shell-session
nmap -p- -sV -sC --open 10.129.224.91

Starting Nmap 7.92 ( https://nmap.org ) at 2023-03-14 19:44 GMT
Nmap scan report for 10.129.224.91
Host is up (0.011s latency).
Not shown: 65534 filtered tcp ports (no-response)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT   STATE SERVICE VERSION
80/tcp open  http    Microsoft IIS httpd 7.5
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/7.5
|_http-title: Bounty
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
```

#### Tilde Enumeration using IIS Short Name Scanner

Manually sending HTTP requests so so hard so there is a tool called `IIS-ShortName-Scanner` that can automate this task. [IIS-ShortName-Scanner](https://github.com/irsdl/IIS-ShortName-Scanner). Install  Oracle java [How to Install Oracle Java](https://ubuntuhandbook.org/index.php/2022/03/install-jdk-18-ubuntu/).
Here is burp [extension](https://portswigger.net/bappstore/523ae48da61745aaa520ef689e75033b) for IIS .

```shell
java -jar iis_shortname_scanner.jar 0 5 http://10.129.204.231/

Picked up _JAVA_OPTIONS: -Dawt.useSystemAAFontSettings=on -Dswing.aatext=true
Do you want to use proxy [Y=Yes, Anything Else=No]? 
# IIS Short Name (8.3) Scanner version 2023.0 - scan initiated 2023/03/23 15:06:57
Target: http://10.129.204.231/
|_ Result: Vulnerable!
|_ Used HTTP method: OPTIONS
|_ Suffix (magic part): /~1/
|_ Extra information:
  |_ Number of sent requests: 553
  |_ Identified directories: 2
    |_ ASPNET~1
    |_ UPLOAD~1
  |_ Identified files: 3
    |_ CSASPX~1.CS
      |_ Actual extension = .CS
    |_ CSASPX~1.CS??
    |_ TRANSF~1.ASP
```

#### Generate Wordlist

```shell
egrep -r ^transf /usr/share/wordlists/* | sed 's/^[^:]*://' > /tmp/list.txt
```

`egrep` and `sed` to filter and modify the contents of input files, then save the results to a new file.

| **Command Part**    | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `egrep -r ^transf`  | The `egrep` used search for lines containing specific pattern. The `-r`  indicates recursive search through dir. The `^transf` pattern matches any line that starts with `transf`. The output of this command will be lines that begin with `transf` along with their source file names.                                                                                                                                            |
| `\|`                | In this case, the lines starting with `transf` and their file names will be the input for the `sed` command.                                                                                                                                                                                                                                                                                                                        |
| `sed 's/^[^:]*://'` | The `sed` command is used to perform a find-and-replace operation on its input (in this case, the output of `egrep`). The `'s/^[^:]*://'` expression tells `sed` to find any sequence of characters at the beginning of a line (`^`) up to the first colon (`:`), and replace them with nothing (effectively removing the matched text). The result will be the lines starting with `transf` but without the file names and colons. |
| `> /tmp/list.txt`   | The greater-than symbol (`>`) is used to redirect the output of the entire command (i.e., the modified lines) to a new file named `/tmp/list.txt`.                                                                                                                                                                                                                                                                                  |

GoBuster is an open-source directory and file brute-forcing tool written in the Go programming language
```shell
gobuster dir -u http://10.129.204.231/ -w /tmp/list.txt -x .aspx,.asp

===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.204.231/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /tmp/list.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Extensions:              asp,aspx
[+] Timeout:                 10s
===============================================================
2023/03/23 15:14:05 Starting gobuster in directory enumeration mode
===============================================================
/transf**.aspx        (Status: 200) [Size: 941]
```

From the redacted output, you can see that `gobuster` has successfully identified an `.aspx` file as the full filename corresponding to the previously discovered short name `TRANSF~1.ASP`.

### Vulnerabilities
Web applications in a production environment are hosted using Microsoft’s IIS web server software. However, in the development environment, the application can be hosted using either IIS or the ASP.NET development server.

```
Information disclosure
Default page reveal
Potential version vulnerable
Lack of security Headers
Server banner exposed
Trace.AXD Information Leak
Directory Listing
Full path disclosure
ASP.NET debugging enabled
Xss
Short File/folder disclosure
```