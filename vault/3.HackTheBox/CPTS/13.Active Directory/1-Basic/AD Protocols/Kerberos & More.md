### Kerberos
Kerberos is default authentication protocol for domain accounts since 2000. Provide mutual auth ensuring bother user and server authenticate each other identity. Instead of Password it use Ticket based authentication. 

`Key distribution center` (`KDC`) located on `DC` and issues two types of tickets. `Ticket Granting Ticket` and `Ticket Granting service Ticket`.  
#### Kerberos Authentication Process
When user login password encrypted and timestamp sent to `KDC`. if `KDC` can decrypt it so it issues a `TGT` encrypted with `Krbtgt account key`. After authentication user request `TGS` for resources. `TGS` encrypted with `NTLM` hash of resource account. Finally User present `TGS` to resource account to get access.
`Kerberos` Protocol uses port `80` both `TCP and UDP`. 

```
[User / Client]
     |
     | 1. AS-REQ  (login request)
     v
[KDC / DC]
     |
     | 2. AS-REP  (TGT + session key)
     |    encrypted with user's key
     v
[TGT stored in memory]
     |
     | 3. TGS-REQ (ask for service)
     v
[KDC / DC]
     |
     | 4. TGS-REP (service ticket)
     |    encrypted with service key
     v
[Service]
     |
     | 5. AP-REQ (ticket + authenticator)
     v
[Access Granted]
``` 

![[Pasted image 20251031233758.png]]
### DNS
`Domain Name System` is imp for `AD DS` as it allow client and `DC` to locate each other. It resolve `hostnames` to `ip adress`.

`Service Location Record SRV` that locates specific services such as `DC`.  It map service name and port number of server offering that server. It tells client which server providing these services and on which port.

`Dynamic DNS` automatically update the entries when client join network, queries `DNS` for `SRV` record to find domain controller. `DNS` used `UDP port 53` and `TCP port 53` for larger or failed of `UDP` requests. 

![[Pasted image 20251031235805.png]]

Common `lookups` include **Forward Lookup** (resolving domain name to IP) and **Reverse Lookup** (resolving IP to domain name).
### LDAP
`LDAP` is `light weight access protocol` is an open source, cross platform protocol used for `directory Lookups` and `authentication` against directory services such as `AD`.
It operates on `port 389` and `LDAPs` secure use `port 636` to encrypt communication. 

![[Pasted image 20251227094031.png]]

An LDAP session begins by first connecting to an LDAP server, also known as a Directory System Agent. The Domain Controller in AD actively listens for LDAP requests, such as security authentication requests.
![[Pasted image 20251101001934.png]]
It store user `accounts`, `password` and `security data`. `LDAP` act as language that system use to interact with `directory`.

The relationship between **AD and LDAP** is similar to **Apache and HTTP**  AD is the service, while LDAP is the communication protocol. `LDAP` authentication happen through `BIND Operation` which sets authentication state for session.

While uncommon, you may come across organization while performing an assessment that do not have AD but are using LDAP, meaning that they most likely use another type of LDAP server such as [OpenLDAP](https://en.wikipedia.org/wiki/OpenLDAP).

**Simple Athentication:** Uses `username` and `password` or anonymous credentials sent in clear text unless encrypted.
**SASL Authentication:** Uses `simple auth` and `security layer`  relies on other `auth` methods like `Kerberos` for secure authentication.
### MSRPC
MSRPC is microsoft implementation of remote procedure call `RPC` an interprocess communication technique used for client server model based applications. Window system use `MSRPC` to access system in `AD` using four key `RPC` interface.

| **Interface Name** | **Simple Explanation**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **lsarpc**         | Lets Windows manage **security policies**  like password rules and audit settings  and helps control user authentication. A set of `RPC` calls to the [Local Security Authority (LSA)](https://networkencyclopedia.com/local-security-authority-lsa/) system which manages the local security policy on a computer, controls the audit policy, and provides interactive authentication services.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **netlogon**       | Netlogon Used when a user logs in to a domain. It helps verify usernames and passwords and keeps the connection between computers and the Domain Controller active. It is a service that continuously runs in the background.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **samr**           | Used to **manage accounts** like creating, deleting, or viewing users and groups in AD. Attackers can use it to gather info about users and permissions (unless restricted).  Attackers can use the `samr` protocol to perform reconnaissance about the internal domain using tools such as [BloodHound](https://github.com/BloodHoundAD/) to visually map out the AD network and create `attack paths` to illustrate visually how administrative access or full domain compromise could be achieved.                                                                                                                                                                                                                                                                                                                          |
| **drsuapi**        | Handles **data replication** between Domain Controllers (making sure all `DCs` have the same directory info). `drsuapi` is the Microsoft API that implements the Directory Replication Service (`DRS`) Remote Protocol which is used to perform replication-related tasks across Domain Controllers in a multi-DC environment. Attackers can utilize `drsuapi` to [create a copy of the Active Directory domain database](https://attack.mitre.org/techniques/T1003/003/) (`NTDS.dit`) file to retrieve password hashes for all accounts in the domain, which can then be used to perform Pass-the-Hash attacks to access more systems or cracked offline using a tool such as `Hashcat` to obtain the `cleartext` password to log in to systems using remote management protocols such as Remote Desktop (`RDP`) and `WinRM`. |































