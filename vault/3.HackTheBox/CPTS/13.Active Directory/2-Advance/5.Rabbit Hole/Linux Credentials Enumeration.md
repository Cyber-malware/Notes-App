Now we have to dig deeper using our low privileged domain user credentials. We must have a `cleartext` password, `NTLM` hash or `system` access on domain joined host. Most of these tools will work only if we have least permission level user.

[CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) (`CME`, now `NetExec`) power full tool set to help with assessing `AD`. It utilizes packages from `Impacket` and `POwerSploit` tool kits. For more detail on modules see the [wiki](https://www.netexec.wiki/) for more.

```shell
crackmapexec -h

<SNIP>
```

we can see more help using the protocol. 
```shell
crackmapexec smb -h

positional arguments:
  target                the target IP(s), range(s), CIDR(s), hostname(s), FQDN(s), file(s) containing a list of targets, NMap XML or
                        .Nessus file(s)
<SNIP>
```

```
- -u        provide low prev username
- -p        provide low prev password
- Target(IP or FQDN)      Target host to enumerate like DC
- --users         enumerate Domain Users
- --groups        enumerate domain groups
- --loggedon-users           enumerate what users are logged on to a target, if any

```

#### CME - Domain User Enumeration
Notice when it provides us the user information, it includes data points such as the [badPwdCount](https://docs.microsoft.com/en-us/windows/win32/adschema/a-badpwdcount) attribute. `badPwdCount` = number of recent failed password attempts for that user. if reset to `0` after successful login. 

```shell
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --users

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\forend:Klmcargo2 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Enumerated domain user(s)
```

#### CME - Domain Group Enumeration
we can also list the groups and it also shows built-in groups on `DC`. Keep eye on groups that have special permissions like `Administrator`, `Domain`, `Admins` and `executive` etc

```shell
 sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --groups
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\forend:Klmcargo2 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Enumerated domain group(s)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Administrators                           membercount: 3
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Users                                    membercount: 4
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Guests                                   membercount: 2
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Print Operators              
```

#### CME - Logged On Users
we can use `CME` to target other hosts and check the currently login users.

```shell
sudo crackmapexec smb 172.16.5.130 -u forend -p Klmcargo2 --loggedon-users

SMB         172.16.5.130    445    ACADEMY-EA-FILE  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-FILE) (domain:INLANEFREIGHT.LOCAL) (signing:False) (SMBv1:False)
SMB         172.16.5.130    445    ACADEMY-EA-FILE  [+] INLANEFREIGHT.LOCAL\forend:Klmcargo2 (Pwn3d!)
SMB         172.16.5.130    445    ACADEMY-EA-FILE  [+] Enumerated loggedon users
SMB         172.16.5.130    445    ACADEMY-EA-FILE  INLANEFREIGHT\clusteragent              logon_server: ACADEMY-EA-DC01
SMB         172.16.5.130    445    ACADEMY-EA-FILE  INLANEFREIGHT\lab_adm         
```
#### CME Share Searching
we can use `--share` flag to enumerate available shares on remote host and level of access our user account hash to each share (read and write access).  

```shell
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --shares

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\forend:Klmcargo2 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Enumerated shares
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Share           Permissions     Remark
SMB         172.16.5.5      445    ACADEMY-EA-DC01  -----           -----------     ------
SMB         172.16.5.5      445    ACADEMY-EA-DC01  ADMIN$                          Remote Admin
SMB         172.16.5.5      445    ACADEMY-EA-DC01  C$                              Default share
SMB         172.16.5.5      445    ACADEMY-EA-DC01  Department Shares READ            
SMB         172.16.5.5      445    ACADEMY-EA-DC01  IPC$            READ            Remote IPC
SMB         172.16.5.5      445    ACADEMY-EA-DC01  NETLOGON        READ            Logon server share 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  SYSVOL          READ            Logon server share 
SMB         172.16.5.5      445    ACADEMY-EA-DC01  User Shares     READ            
SMB         172.16.5.5      445    ACADEMY-EA-DC01  ZZZ_archive     READ 
```

we have `READ` access to available shares like `Department shares`, `User shares` and `ZZZ_archive` that may contain sensitive data. we can use `spider_plus` help to dig into readable shares.
#### Spider_plus
```shell
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 -M spider_plus --share 'Department Shares'

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\forend:Klmcargo2 
SPIDER_P... 172.16.5.5      445    ACADEMY-EA-DC01  [*] Started spidering plus with option:
SPIDER_P... 172.16.5.5      445    ACADEMY-EA-DC01  [*]        DIR: ['print$']
SPIDER_P... 172.16.5.5      445    ACADEMY-EA-DC01  [*]        EXT: ['ico', 'lnk']
SPIDER_P... 172.16.5.5      445    ACADEMY-EA-DC01  [*]       SIZE: 51200
SPIDER_P... 172.16.5.5      445    ACADEMY-EA-DC01  [*]     OUTPUT: /tmp/cme_spider_plus
```

CME writes the results to a `JSON` file located at `/tmp/cme_spider_plus/<ip of host>` and we can also we its other features that help us in this process.

### SMBMap
`SMBMap` is great for enumerating `SMB` shares from `Linux` attack help to gather listing of shares, permissions and share content if accessible. After access we can use to download and upload or execute the commands.
`SMBMap` help to recursively list directories, content and search for files. 

```shell
smbmap -u forend -p Klmcargo2 -d INLANEFREIGHT.LOCAL -H 172.16.5.5

[+] IP: 172.16.5.5:445	Name: inlanefreight.local                               
        Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	ADMIN$                                            	NO ACCESS	Remote Admin
	C$                                                	NO ACCESS	Default share
	Department Shares                                 	READ ONLY	
	IPC$                                              	READ ONLY	Remote IPC
	NETLOGON                                          	READ ONLY	Logon server share 
	SYSVOL                                            	READ ONLY	Logon server share 
	User Shares                                       	READ ONLY	
	ZZZ_archive                                       	READ ONLY
```

we can see the user `forend` has no access to the DC via the `ADMIN$` or `C$` shares and common for standard user but `IPC$`, `NETLOGON`, and `SYSVOL` have read access which is default in any domain.  But we have non-standard shares `Department Shares` and the `user` and `archive` shares which is interesting. 

```shell
smbmap -u forend -p Klmcargo2 -d INLANEFREIGHT.LOCAL -H 172.16.5.5 -R 'Department Shares' --dir-only

[+] IP: 172.16.5.5:445	Name: inlanefreight.local                               
        Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	Department Shares                                 	READ ONLY	
	.\Department Shares\*
	dr--r--r--                0 Thu Mar 31 15:34:29 2022	.
	dr--r--r--                0 Thu Mar 31 15:34:29 2022	..
	dr--r--r--                0 Thu Mar 31 15:14:48 2022	Accounting
	dr--r--r--                0 Thu Mar 31 15:14:39 2022	Executives
	dr--r--r--                0 Thu Mar 31 15:14:57 2022	Finance
	dr--r--r--                0 Thu Mar 31 15:15:04 2022	HR
	dr--r--r--                0 Thu Mar 31 15:15:21 2022	IT
	dr--r--r--                0 Thu Mar 31 15:15:29 2022	Legal
	dr--r--r--                0 Thu Mar 31 15:15:37 2022	Marketing
	dr--r--r--                0 Thu Mar 31 15:15:47 2022	Operations
	dr--r--r--                0 Thu Mar 31 15:15:58 2022	R&D
	dr--r--r--                0 Thu Mar 31 15:16:10 2022	Temp
	dr--r--r--                0 Thu Mar 31 15:16:18 2022	Warehouse

    <SNIP>
```

### rpcclient
[rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html) is a handy tool created for use with the Samba protocol and to provide extra functionality via MS-RPC. It can enumerate, add, change and remove the objects from `AD`.

WE can perform authenticated or unauthenticated enumeration on some of our hosts.

```
rpcclient -U '' -N 172.16.5.5
```

#### RPCClient User Enumeration By RID
`RID = Relative Identifier` A [Relative Identifier (RID)](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) is a number Windows uses to identify an object (user, group, computer). It’s unique only inside a domain. It’s stored in hexadecimal (like `0x457`) A RID by itself is not enough, it only makes sense when combined with a `SID`. 
`SID = Security Identifier` a domain's serial number. 

```
Full SID = Domain SID + RID
```

There are accounts that will have same `RID` like `Built-in Administrator` account always have `RID[administrator] rid:[0x1f4`, convert to decimal value equals to `500`

```shell
rpcclient $> queryuser 0x457

        User Name   :   htb-student
        Full Name   :   Htb Student
        Home Drive  :
        Dir Drive   :
        Profile Path:
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      Wed, 02 Mar 2022 15:34:32 EST
        Logoff Time              :      Wed, 31 Dec 1969 19:00:00 EST
        Kickoff Time             :      Wed, 13 Sep 30828 22:48:05 EDT
        Password last set Time   :      Wed, 27 Oct 2021 12:26:52 EDT
        Password can change Time :      Thu, 28 Oct 2021 12:26:52 EDT
        Password must change Time:      Wed, 13 Sep 30828 22:48:05 EDT
        unknown_2[0..31]...
        user_rid :      0x457
        group_rid:      0x201
        acb_info :      0x00000010
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x0000001d
        padding1[0..7]...
        logon_hrs[0..21]...
```

But we already know the `RID` of user but we can also enumerate all users to see their `RID`.

```shell
rpcclient $> enumdomusers

user:[administrator] rid:[0x1f4]
user:[guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
```

We could even start performing actions such as editing users and groups or adding our own into the domain, you can perform this by own. 


### Impacket Toolkit
`Impacket` is a versatile toolkit that provides us with many different ways to enumerate, interact, and exploit Windows protocols and find the `info` using `Python` but in this section we will use only few from `impacket` [wmiexec.py](https://github.com/SecureAuthCorp/impacket/blob/master/examples/wmiexec.py) and [psexec.py](https://github.com/SecureAuthCorp/impacket/blob/master/examples/psexec.py).

#### Using psexec.py
`psexec.py` from impacket suite is clone of `sysinternals psexec executable` but work bit different. it create remote services by uploading randomly name executable to `ADMIN$` share and then register the service via `RPC` and `window service control manager`. Communication start over named pipe providing an interactive remote shell once established.

```bash
psexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.125  
```

Once `execute` it Drop us in `system32` on host and we can check we landed as `SYSTEM`.  

#### wmiexec.py
`Wmiexec.py` utilizes a semi-interactive shell where commands are executed through [Windows Management Instrumentation](https://docs.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page). It does't drop any file on target host and after connecting run as local admin and more stealthy then execution on hosts then other tools but still caught by modern anti viruses.  

```bash
wmiexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.5  
```

Each command issued will execute a new `cmd.exe` from `WMI` and execute your commands. But if vigilant defender checks event logs and looks at event ID [4688: A new process has been created](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688) and see process id created to run `cmd.exe` but it will not always malicious activity because some `org` use `WMI` to administrator computer. 

#### Windapsearch
[Windapsearch](https://github.com/ropnop/windapsearch) is another handy Python script we can use to enumerate users, groups, and computers from a Windows domain by utilizing LDAP queries.

```shell
windapsearch.py -h

usage: windapsearch.py [-h] [-d DOMAIN] [--dc-ip DC_IP] [-u USER]
                       [-p PASSWORD] [--functionality] [-G] [-U] [-C]
                       [-m GROUP_NAME] [--da] [--admin-objects] [--user-spns]
                       [--unconstrained-users] [--unconstrained-computers]
                       [--gpos] [-s SEARCH_TERM] [-l DN]
                       [--custom CUSTOM_FILTER] [-r] [--attrs ATTRS] [--full]
                       [-o output_dir]
                    
<SNIP>
```

We have many options to perform standard enumeration like `--da` enumerate domain admins group members and `-PU` option perform recursive search for users.

```shell
 python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 --da

[+] Using Domain Controller at: 172.16.5.5
[+] Getting defaultNamingContext from Root DSE
[+]	Found: DC=INLANEFREIGHT,DC=LOCAL

cn: Administrator
userPrincipalName: administrator@inlanefreight.local

cn: lab_adm

cn: Matthew Morgan
userPrincipalName: mmorgan@inlanefreight.local

<SNIP>
```

With the `-PU` flag and check for users with elevated privileges that may have gone unnoticed.

```shell
python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 -PU

[+] Using Domain Controller at: 172.16.5.5
[+] Getting defaultNamingContext from Root DSE
[+]     Found: DC=INLANEFREIGHT,DC=LOCAL
[+] Attempting bind
[+]     ...success! Binded as:
[+]      u:INLANEFREIGHT\forend
[+] Attempting to enumerate all AD privileged users

[+] Using DN: CN=Domain Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL
[+]     Found 28 nested users for group Domain Admins:

cn: Administrator
userPrincipalName: administrator@inlanefreight.local

cn: lab_adm

cn: Angela Dunn
userPrincipalName: adunn@inlanefreight.local

```

## Bloodhound
We can take large amount of data and add it into  [BloodHound.py](https://github.com/fox-it/BloodHound.py)  to create graphical representation help to map the attack and uses [graph theory](https://en.wikipedia.org/wiki/Graph_theory) to visually represent relationships. It consists of two parts: the [SharpHound collector](https://github.com/BloodHoundAD/BloodHound/tree/master/Collectors) written in C# use on `Windows system` and the [BloodHound](https://github.com/BloodHoundAD/BloodHound/releases) GUI tool which allows us to upload collected data in the form of `JSON` files. 

After uploaded we can run `prebuilt` queries or `write` custom queries using [Cypher language](https://specterops.io/blog/2017/09/18/bloodhound-intro-to-cypher/).
```shell
bloodhound-python -h

usage: bloodhound-python [-h] [-c COLLECTIONMETHOD] [-u USERNAME]
                         [-p PASSWORD] [-k] [--hashes HASHES] [-ns NAMESERVER]
                         [--dns-tcp] [--dns-timeout DNS_TIMEOUT] [-d DOMAIN]
                         [-dc HOST] [-gc HOST] [-w WORKERS] [-v]
                         [--disable-pooling] [--disable-autogc] [--zip]
                         
<SNIP>
```

`-c` or `--collectionmethod` flag help to retrieve specific data such as `user sessions`, `users` and `groups`, o`bject properties`, `ACLS`, or select `all` to gather as much data as possible.

#### Executing BloodHound.py
```shell
sudo bloodhound-python -u 'forend' -p 'Klmcargo2' -ns 172.16.5.5 -d inlanefreight.local -c all 

INFO: Found AD domain: inlanefreight.local
INFO: Connecting to LDAP server: ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
INFO: Found 1 domains
INFO: Found 2 domains in the forest
INFO: Found 564 computers
INFO: Connecting to LDAP server: ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
INFO: Found 2951 users
INFO: Connecting to GC LDAP server: ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
INFO: Found 183 groups
INFO: Found 2 trusts
INFO: Starting computer enumeration with 10 workers

<SNIP>
```

#### Viewing the Results
```shell
ls

20220307163102_computers.json  20220307163102_domains.json  20220307163102_groups.json  20220307163102_users.json
```

#### Upload the Zip File into the BloodHound GUI
We could then type `sudo neo4j start` to start the [neo4j](https://neo4j.com/) service, firing up the database we'll load the data into and also run `Cypher` queries against.

We can either upload each JSON file one by one or zip them first with a command such as `zip -r ilfreight_bh.zip *.json` and upload the Zip file.
![[Pasted image 20260125223653.png]]

Now we can run queries against databases [custom Cypher queries](https://hausec.com/2019/09/09/bloodhound-cypher-cheatsheet/).
![[Pasted image 20260125223810.png]]

The query used to generate the map was **Find Shortest Paths To Domain Admins**, which identifies logical attack paths through users, groups, hosts, ACLs, GPOs, and other Active Directory relationships that could potentially be abused to escalate privileges to Domain Administrator or an equivalent level. This query is especially useful for planning lateral movement, as it helps visualize how an attacker might move through the environment by leveraging existing permissions and `misconfigurations`.

After uploading data, the **Database Info** tab can be reviewed to confirm successful ingestion and gain an overview of the collected information. Users can search for specific nodes, such as **Domain Users**, and explore all available details in the **Node Info** tab to better understand permissions and relationships. The **Analysis** tab contains several powerful pre-built queries that can quickly reveal common paths to domain takeover. For more advanced analysis, custom **Cypher queries** can be executed by pasting them into the **Raw Query** box. Additional customization options are available in the **Settings** menu, where node and edge displays can be adjusted, query debug mode enabled, and dark mode activated. 

Checked out the [WADComs project](https://wadcoms.github.io/) contain cheat sheets help to see commands.