
### Detailed User Enumeration
- By using an SMB NULL session to retrieve a complete list of domain user from `DC`.
- Use `LDAP` anonymous bind to query `LDAP` anonymously and pull user list
- Using tool `Kerbrute` to validate user with wordlist from source [statistically-likely-usernames](https://github.com/insidetrust/statistically-likely-usernames), github and [linkedin2username](https://github.com/initstring/linkedin2username) to create list.
- Using the credentials provided by client or get by attacks like `LLMNR/NBT-NS` using responder or password spray using wordlist.


if we have `SMB` NULL session, `LDAP` anonymous bind or set of valid credentials we can enumerate password policy and know the account threshold.

 we must always keep a log of our activities, including, but not limited to
 Account targeted
 - `DC` used in attack
 - `Time` of spray
 - `Date` of spray
 - `Password` attempt

This will help us ensure that we do not duplicate efforts. If an account lockout occurs or our client notices suspicious logon attempts, we can supply them with our notes to crosscheck against their logging systems and ensure nothing `nefarious` was going on in the network.

### SMB NULL Session to PULL User List

If you are on internal machine and do not have credentials so you can try `SMB NULL` or `LDAP Anonymous` bind on `DC`. This will help to get accurate list of users in `AD` and `Pass policy`. if you already have for `DC` and `Window` user so you can query `AD` for this `Info`.  

it's possible to do this using SYSTEM account because it can `impersonate` computer. A `computer object` is treated as domain user account `with some differences, such as authenticating across forest trusts`. if you not have `valid domain`, `SMB NULL session` or `LDAP anonymous` bind not possible so you can create user list using external resources. help to give access in `AD`.

some tools for `SMB NULL session` and `LDAP anonymous` include [enum4linux](https://github.com/portcullislabs/enum4linux), [rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html), and [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec), among others. 

#### Using Enum4Linux
```shell
enum4linux -U 172.16.5.5  | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"

administrator
guest
krbtgt
lab_adm
htb-student
avazquez
pfalcon
fanthony
```

#### Using rpcclient
```shell
malvvare@htb[/htb]$ rpcclient -U "" -N 172.16.5.5

rpcclient $> enumdomusers 
user:[administrator] rid:[0x1f4]
user:[guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
user:[lab_adm] rid:[0x3e9]
user:[htb-student] rid:[0x457]
user:[avazquez] rid:[0x458]
```

we can also use `crackmapexec` with `--user` flag show the `badpwncount` invalid login attempts and so we can remove account from list that close to lockout and show `badpwntime` show date and time last bad pass attempt, also we can see how close is account having `badpwncount` reset. with multiple `DC` value maintained separately. To get accurate total account `bad password` attempts we have query `DC` and use sum of values or query `DC` with `PDC` emulator `FSMO` role.

#### Using CrackmapExec --user flag
```shell
crackmapexec smb 172.16.5.5 --users

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Enumerated domain user(s)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  INLANEFREIGHT.LOCAL\administrator                  badpwdcount: 0 baddpwdtime: 2022-01-10 13:23:09.463228
SMB         172.16.5.5      445    ACADEMY-EA-DC01  INLANEFREIGHT.LOCAL\guest                          badpwdcount: 0 baddpwdtime: 1600-12-31 19:03:58

<SNIP>
```

#### Gathering Users with LDAP Anonymous
if we find `LDAP anonymous` we can enumerate with various tools like  [windapsearch](https://github.com/ropnop/windapsearch) and [ldapsearch](https://linux.die.net/man/1/ldapsearch).
if we choose `ldapsearch` so we need to specify valid `LDAP` filter.

#### Using ldapseach
```shell
dapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "(&(objectclass=user))"  | grep sAMAccountName: | cut -f2 -d" "

guest
ACADEMY-EA-DC01$
ACADEMY-EA-MS01$
ACADEMY-EA-WEB01$
htb-student
avazquez
pfalcon
fanthony
wdillard
lbradford
sgage
asanchez
dbranch

<SNIP>
```



`widapsearch` make it easy for us (although we understand how create own `LDAP` search filter) we can specify `-u` flag and `-U` tell tool to retrieve user.

#### Using windapsearch
```shell
./windapsearch.py --dc-ip 172.16.5.5 -u "" -U

[+] No username provided. Will try anonymous bind.
[+] Using Domain Controller at: 172.16.5.5
[+] Getting defaultNamingContext from Root DSE
[+]	Found: DC=INLANEFREIGHT,DC=LOCAL
[+] Attempting bind
[+]	...success! Binded as: 
[+]	 None

[+] Enumerating all AD users
[+]	Found 2906 users: 

cn: Guest

cn: Htb Student
userPrincipalName: htb-student@inlanefreight.local

cn: Annie Vazquez
userPrincipalName: avazquez@inlanefreight.local

cn: Paul Falcon
userPrincipalName: pfalcon@inlanefreight.local

cn: Fae Anthony
userPrincipalName: fanthony@inlanefreight.local

cn: Walter Dillard
userPrincipalName: wdillard@inlanefreight.local

<SNIP>
```

#### Enumerating Users with Kerbrute
In `Initial Enumeration of Domain` if we have no access to internal network so we can `kerbrute` to enumerate valid `AD` accounts and password spraying.

This tool uses [Kerberos Pre-Authentication](https://ldapwiki.com/wiki/Wiki.jsp?page=Kerberos%20Pre-Authentication) much faster and stealthier for pass spraying. This method not generate Windows event ID [4625: An account failed to log on](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625) or login failure. This tool sent `TGT` request to `DC` with out `pre auth` for username enumeration. if `KDC` respond with error `PRINCIPAL UNKNOWN` so username `invalid`. if `KDC` prompt from `kerberos pre auth` tool will marks as username exists. 
This will not cause logon failure and will not lock out the account.

we can use the [jsmith.txt](https://github.com/insidetrust/statistically-likely-usernames/blob/master/jsmith.txt) and [statistically-likely-usernames](https://github.com/insidetrust/statistically-likely-usernames) wordlist to enumerate valid usernames using `Kerbrute`.
```shell
kerbrute userenum -d inlanefreight.local --dc 172.16.5.5 /opt/jsmith.txt 

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: dev (9cfb81e) - 02/17/22 - Ronnie Flathers @ropnop

2022/02/17 22:16:11 >  Using KDC(s):
2022/02/17 22:16:11 >  	172.16.5.5:88

2022/02/17 22:16:11 >  [+] VALID USERNAME:	 jjones@inlanefreight.local
2022/02/17 22:16:11 >  [+] VALID USERNAME:	 sbrown@inlanefreight.local
2022/02/17 22:16:11 >  [+] VALID USERNAME:	 tjohnson@inlanefreight.local
```

We've checked over 48,000 usernames in just over 12 seconds and discovered 50+ valid ones.

Using `kerbrute` username enumeration will generate  event ID [4768: A Kerberos authentication ticket (TGT) was requested](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4768). and will only be triggered if [Kerberos event logging](https://docs.microsoft.com/en-us/troubleshoot/windows-server/identity/enable-kerberos-event-logging) is enabled via Group Policy. Defenders can add this to their `SIEM` tool but if we get into this it will be an excellent.  we can also use the tool such as [linkedin2username](https://github.com/initstring/linkedin2username) to mash up possible usernames from a company's LinkedIn page.
#### Credentialed Enumeration to Build our User List
```shell
sudo crackmapexec smb 172.16.5.5 -u htb-student -p Academy_student_AD! --users

[sudo] password for htb-student: 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\htb-student:Academy_student_AD! 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Enumerated domain user(s)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  INLANEFREIGHT.LOCAL\administrator                  badpwdcount: 1 baddpwdtime: 2022-02-23 21:43:35.059620

```