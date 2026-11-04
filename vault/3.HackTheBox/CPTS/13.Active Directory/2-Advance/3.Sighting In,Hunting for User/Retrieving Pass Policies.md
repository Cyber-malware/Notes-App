
### Enumerating the Password Policy - from Linux - Credentialed
With valid credentials domain policy can be obtained with tool using [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) or `rpcclient`.

```shell
crackmapexec smb 172.16.5.5 -u avazquez -p Password123 --pass-pol

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\avazquez:Password123 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Dumping password info for domain: INLANEFREIGHT
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Minimum password length: 8
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Password history length: 24
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Maximum password age: Not Set
SMB         172.16.5.5      445    ACADEMY-EA-DC01  
```

### Enumerating the Password Policy - from Linux - SMB NULL Sessions

without credentials we may be able to obtain password policy via `SMB NULL` session or `LDAP` anonymous bind. 

`SMB NULL` session allow unauthenticated attacker to retrieve `info` from domain such as complete listing of `Users`, `groups`, `user accounts attribues` and `domain password` policy.

when creating a domain earlier versions of window servers, anonymous access was granted to certain shares. we can use tools such as `enum4linux`, `CrackMapExec`, `rpcclient`, etc.

```shell
rpcclient -U "" -N 172.16.5.5

rpcclient $> querydominfo
Domain:		INLANEFREIGHT
Server:		
Comment:	
Total Users:	3650
Total Groups:	0
Total Aliases:	37
Sequence No:	1
Force Logoff:	-1
Domain Server State:	0x1
Server Role:	ROLE_DOMAIN_PDC
Unknown 3:	0x1
```

we can also obtain the password policy.
#### Obtaining the Password Policy using rpcclient
```shell
rpcclient $> querydominfo

Domain:		INLANEFREIGHT
Server:		
Comment:	
Total Users:	3650
Total Groups:	0
Total Aliases:	37
Sequence No:	1
Force Logoff:	-1
Domain Server State:	0x1
Server Role:	ROLE_DOMAIN_PDC
Unknown 3:	0x1

rpcclient $> getdompwinfo

min_password_length: 8
password_properties: 0x00000001
	DOMAIN_PASSWORD_COMPLEX
```

Let's try this using [enum4linux](https://labs.portcullis.co.uk/tools/enum4linux). `enum4linux` is a tool built around the [Samba suite of tools](https://www.samba.org/samba/docs/current/man-html/samba.7.html) `nmblookup`, `net`, `rpcclient` and `smbclient` to use for enumeration of windows hosts and domains.
Ports used by the tools.

|Tool|Ports|
|---|---|
|nmblookup|137/UDP|
|nbtstat|137/UDP|
|net|139/TCP, 135/TCP, TCP and UDP 135 and 49152-65535|
|rpcclient|135/TCP|
|smbclient|445/TCP|
#### Using enum4linux
```shell
malvvare@htb[/htb]$ enum4linux -P 172.16.5.5

<SNIP>

 ================================================== 
|    Password Policy Information for 172.16.5.5    |
 ================================================== 

[+] Attaching to 172.16.5.5 using a NULL share
[+] Trying protocol 139/SMB...

	[!] Protocol failed: Cannot request session (Called Name:172.16.5.5)

[+] Trying protocol 445/SMB...
[+] Found domain(s):

	[+] INLANEFREIGHT
	[+] Builtin

[+] Password Info for Domain: INLANEFREIGHT

	[+] Minimum password length: 8
	[+] Password history length: 24
	[+] Maximum password age: Not Set
	[+] Password Complexity Flags: 000001

		[+] Domain Refuse Password Change: 0
		[+] Domain Password Store Cleartext: 0
		[+] Domain Password Lockout Admins: 0
		[+] Domain Password No Clear Change: 0
		[+] Domain Password No Anon Change: 0
		[+] Domain Password Complex: 1

	[+] Minimum password age: 1 day 4 minutes 
	[+] Reset Account Lockout Counter: 30 minutes 
	[+] Locked Account Duration: 30 minutes 
	[+] Account Lockout Threshold: 5
	[+] Forced Log off Time: Not Set

[+] Retieved partial password policy with rpcclient:

Password Complexity: Enabled
Minimum Password Length: 8

enum4linux complete on Tue Feb 22 17:39:29 2022
```

The tool [enum4linux-ng](https://github.com/cddmp/enum4linux-ng) is rewrite of `enum4linux` in python and has ability to export data in `YAML` or `jSON`.

#### Using enum4linux-ng
```shell
 enum4linux-ng -P 172.16.5.5 -oA ilfreight

ENUM4LINUX - next generation

<SNIP>

 =======================================
|    RPC Session Check on 172.16.5.5    |
 =======================================
[*] Check for null session
[+] Server allows session using username '', password ''
[*] Check for random user session
[-] Could not establish random user session: STATUS_LOGON_FAILURE

<SNIP>

 =======================================
|    Policies via RPC for 172.16.5.5    |
 =======================================
[*] Trying port 445/tcp
[+] Found policy:
domain_password_information:
  pw_history_length: 24
  min_pw_length: 8
  min_pw_age: 1 day 4 minutes
  max_pw_age: not set
  pw_properties:
  - DOMAIN_PASSWORD_COMPLEX: true
  - DOMAIN_PASSWORD_NO_ANON_CHANGE: false
  - DOMAIN_PASSWORD_NO_CLEAR_CHANGE: false
  - DOMAIN_PASSWORD_LOCKOUT_ADMINS: false
  - DOMAIN_PASSWORD_PASSWORD_STORE_CLEARTEXT: false
  - DOMAIN_PASSWORD_REFUSE_PASSWORD_CHANGE: false
domain_lockout_information:
  lockout_observation_window: 30 minutes
  lockout_duration: 30 minutes
  lockout_threshold: 5
domain_logoff_information:
  force_logoff_time: not set

Completed after 5.41 seconds
```

`Json` format data.
```shell
cat ilfreight.json 

{
    "target": {
        "host": "172.16.5.5",
        "workgroup": ""
    },
    "credentials": {
        "user": "",
        "password": "",
}
```

### Enumerating Null Session - from Windows

Its less common to this type of `null session` attacks from windows but we can use this command `net use \\host\ipc$ "" /u:""` to establish null session from window.

#### Establish a null session from windows
```cmd
C:\htb> net use \\DC01\ipc$ "" /u:""

The command completed successfully.
```

We can also use a username/password combination to attempt to connect. Let's see some common errors when trying to authenticate:
#### Error: Account is Disabled
```cmd
C:\htb> net use \\DC01\ipc$ "" /u:guest

System error 1331 has occurred.
This user can't sign in because this account is currently disabled.
```
#### Error: Password is Incorrect
```cmd
C:\htb> net use \\DC01\ipc$ "password" /u:guest
System error 1326 has occurred.

The user name or password is incorrect.
```
#### Error: Account is locked out (Password Policy)
```cmd
C:\htb> net use \\DC01\ipc$ "password" /u:guest
System error 1909 has occurred.

The referenced account is currently locked out and may not be logged on to.
```

### Enumerating the Password Policy - from Linux - LDAP Anonymous Bind

[LDAP anonymous binds](https://docs.microsoft.com/en-us/troubleshoot/windows-server/identity/anonymous-ldap-operations-active-directory-disabled) allow unauthenticated attackers to retrieve information from the domain but as of `Window server 2003` only authenticated user can permitted to initiate `LDAP` request. But some time admin have to setup particular application allow anonymous bind and provide access object in `AD`.

With an `LDAP` anonymous bind we can use `LDAP` specific enumeration tools such as `windaspsearch.py`, `ldapsearch`, `ad-ldapdomaindump.py` etc to pull password policy. 

With [ldapsearch](https://linux.die.net/man/1/ldapsearch), it can be a bit cumbersome but doable. command to get password policy.
New version of `ldapsearch` -h parameter depricated with -H
#### Using ldapsearch
```shell
ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength

forceLogoff: -9223372036854775808
lockoutDuration: -18000000000
lockOutObservationWindow: -18000000000
lockoutThreshold: 5
maxPwdAge: -9223372036854775808
minPwdAge: -864000000000
minPwdLength: 8
modifiedCountAtLastProm: 0
nextRid: 1002
pwdProperties: 1
pwdHistoryLength: 24
```


### Enumerating the Password Policy - from Windows

if we authenticate to domain from window host we can use built in windows binaries such as `net.exe` to retrieve the password policy or other tools like  `PowerView`, `CrackMapExec` ported to Windows, `SharpMapExec`, `SharpView`, etc.

`Built in` commands can be very helpful when we have no way to transfer the tools in window.
#### Using net.exe
```cmd
C:\htb> net accounts

Force user logoff how long after time expires?:       Never
Minimum password age (days):                          1
Maximum password age (days):                          Unlimited
Minimum password length:                              8
Length of password history maintained:                24
Lockout threshold:                                    5
Lockout duration (minutes):                           30
Lockout observation window (minutes):                 30
Computer role:                                        SERVER
The command completed successfully.
```

#### Scenario defined 
This password policy is excellent for password spraying. The eight-character minimum means that we can try common weak passwords such as `Welcome1`. The lockout threshold of 5 means that we can attempt 2-3 (to be safe) sprays every 31 minutes without the risk of locking out any accounts. If an account has been locked out, it will automatically unlock (without manual intervention from an admin) after 30 minutes, but we should avoid locking out `ANY` accounts at all costs.

#### Using PowerView Tool

```powershell
PS C:\htb> import-module .\PowerView.ps1
PS C:\htb> Get-DomainPolicy

Unicode        : @{Unicode=yes}
SystemAccess   : @{MinimumPasswordAge=1; MaximumPasswordAge=-1; MinimumPasswordLength=8; PasswordComplexity=1;
                 PasswordHistorySize=24; LockoutBadCount=5; ResetLockoutCount=30; LockoutDuration=30;
                 RequireLogonToChangePassword=0; ForceLogoffWhenHourExpire=0; ClearTextPassword=0;
                 LSAAnonymousNameLookup=0}
KerberosPolicy : @{MaxTicketAge=10; MaxRenewAge=7; MaxServiceAge=600; MaxClockSkew=5; TicketValidateClient=1}
Version        : @{signature="$CHICAGO$"; Revision=1}
RegistryValues : @{MACHINE\System\CurrentControlSet\Control\Lsa\NoLMHash=System.Object[]}
Path           : \\INLANEFREIGHT.LOCAL\sysvol\INLANEFREIGHT.LOCAL\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHI
                 NE\Microsoft\Windows NT\SecEdit\GptTmpl.inf
GPOName        : {31B2F340-016D-11D2-945F-00C04FB984F9}
GPODisplayName : Default Domain Policy
```

`Powerview` or `sharpview` are always good as `crackmapexec`, `sharpmapexec` or others.

### Analyzing the Password Policy

We've now pulled the password policy in numerous ways. Let's go through the policy for the I`NLANEFREIGHT.LOCAL` domain piece by piece.

- Minimum length of password is `8` (very common but `org` now using `10-14` char pass which can remove some pass options but not mitigate the pass spraying vector completely.)
- Account lockout threshold is 5 (not uncommon to see threshold like `3` or event not set at all)
- Lockout duration is `30 min` (depend on `org`) 
- Accounts unlock automatically (in some organizations, an admin must manually unlock the account) but try to avoid from this.
- Password complexity is enabled, meaning  user must choose a password with `3/4 `of the following: an uppercase letter, lowercase letter, number, special character.

The default password policy when a new domain is created and some `org` not changed it.

|Policy|Default Value|
|---|---|
|Enforce password history|24 days|
|Maximum password age|42 days|
|Minimum password age|1 day|
|Minimum password length|7|
|Password must meet complexity requirements|Enabled|
|Store passwords using reversible encryption|Disabled|
|Account lockout duration|Not set|
|Account lockout threshold|0|
|Reset account lockout counter after|Not set|
Now that we have the password policy in hand, we need to create a target user list to perform our password spraying attack. Some time we will not able to get password policy so we have to be very careful we can ask to client about the password policy.

