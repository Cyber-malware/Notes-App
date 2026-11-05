### User Accounts (AD + Local)
- Created to let a person or service **log in** and **access resources**.
- When a user logs in:  
    → **Password verified**  
    → **Access token created** (Contains user SID + group memberships)
- Tokens are used by every process/thread representing that user.
- Users can be grouped → easier privilege management.

If the employee leave the company so they deactivate their account not not delete it. It may require in future for audit or anything else.

![[Pasted image 20251209055624.png]]
### Types of User Accounts
- **Standard user** – default Domain User rights (mostly read-only in AD).
- **Admin accounts** – elevated privileges (IT staff often have 2 accounts: normal + admin).
- **Service accounts** – run applications/services under a specific security context.
- **Disabled/Former accounts** – often kept for auditing (seen in `OUs` like _FORMER EMPLOYEES_).

## Local Accounts (on individual machines)

Local accounts are stored locally on a particular server or workstation. Local accounts exist `only on a single host` and their permissions `do NOT apply across the domain`. 
### Default Local Accounts

#### Administrator
- SID: **S-1-5-domain-500**
- First account created on Windows install.
- Cannot be deleted or locked, but can be disabled or renamed.
- Disabled by default on `Win10/Server 2016`.
#### Guest
- Disabled by default.
- Blank password by default (dangerous).
- Should remain disabled.
#### SYSTEM (NT AUTHORITY\SYSTEM)
- Highest privilege level on a Windows host.
- Used by the OS internally (services, processes).
- No user profile and cannot be added to groups.
- Has full control over almost everything.
#### Network Service
- Used by Windows services (`SCM`).
- Presents **machine credentials** when accessing remote services.
#### Local Service
- Minimal privilege account for services.
- Presents **anonymous credentials** to the network.

Studying Microsoft's documentation on [local default accounts](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/local-accounts) in depth to gain a better understanding of how the various accounts work together on an individual Windows system and across a domain network.

### 1. Domain Users (vs Local Users)

- Domain users get **permissions from the domain**, not from a single machine.
- Can access domain resources (file servers, printers, intranet apps, etc.).
- Can log into **any domain-joined host** (if not restricted by policy).
- Rights depend on **user account** + **group memberships**.
- Commonly includes:
    - **Standard domain users**
    - **Admin users (IT, Help Desk, etc.)**
    - **Service accounts**
    
### KRBTGT Account
- Built-in AD account used by **Kerberos Key Distribution Service**.
- Holds the keys that sign Kerberos tickets.
- If compromised → attacker can generate **Golden Tickets** → **full domain compromise**.
- Grade A target for attackers.

|Attribute|What it Means|Why Important|
|---|---|---|
|**UPN (UserPrincipalName)**|Primary logon name (usually email format)|Used for authentication|
|**ObjectGUID**|Permanent unique AD identifier|Never changes (even after rename)|
|**SAMAccountName**|Legacy Windows logon name|Required for older systems|
|**objectSID**|Security Identifier|Defines user + group memberships for access decisions|
|**sIDHistory**|Previous SIDs from migrated domains|Important in domain migrations; can be abused in attacks|
```powershell
PS C:\htb Get-ADUser -Identity htb-student

DistinguishedName : CN=htb student,CN=Users,DC=INLANEFREIGHT,DC=LOCAL
Enabled           : True
GivenName         : htb
Name              : htb student
ObjectClass       : user
ObjectGUID        : aa799587-c641-4c23-a2f7-75850b4dd7e3
SamAccountName    : htb-student
SID               : S-1-5-21-3842939050-3880317879-2865463114-1111
Surname           : student
UserPrincipalName : htb-student@INLANEFREIGHT.LOCAL
```

### Domain-Joined vs Non-Domain-Joined Machines

### Domain-Joined Hosts
- Centrally managed by **Domain Controller**.
- Receive policies & configuration through **Group Policy (GPO)**.
- Users can log into any domain-joined machine.
- Standard in enterprise environments.
### Non-Domain-Joined Hosts (`Workgroups`)
- No centralized management.
- Local users only exist on the local machine.
- Harder to share resources across different hosts.
- Good for home/small business setups.


