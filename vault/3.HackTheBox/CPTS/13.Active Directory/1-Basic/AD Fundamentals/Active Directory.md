Active Directory is a directory service for Windows network environments. It is a distributed, hierarchical structure that allows for centralized management of an organization's resources.
AD provides authentication and authorization functions within a Windows domain environment.

![[Pasted image 20251026040839.png]]

Ransomware operators have been increasingly targeting Active Directory as a key part of their attack paths. The [Conti Ransomware](https://www.cisa.gov/sites/default/files/publications/AA21-265A-Conti_Ransomware_TLP_WHITE.pdf) which has been used in more than 400 attacks around the world has been shown to leverage recent critical Active Directory flaws such as [PrintNightmare (CVE-2021-34527)](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34527) and [Zerologon (CVE-2020-1472)](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2020-1472) to escalate privileges and move laterally in a target network.

`LDAP` Lightweight Directory Access Protocol foundation of AD and appeared in RFCs around 1971.
Its concept produced by `X.500` organizational unit model.  Microsoft tried directory services in `1990` with `Windows NT 3.0`.  NT evolved through the `1990s`, adopting `LDAP` and `Kerberos` + `Microsoft’s proprietary extensions`. `AD` beta released in `1997` and become part of `Window server 2000`. **95% of Fortune 500** use `AD`.  

- **2003**: Added **Forests** (group domains/users).
- **2008**: Added **AD Federation Services (ADFS)** → Single Sign-On using **claims-based auth**.
- **2016**: Cloud migration + **gMSA**, **user monitoring**, protection vs **Kerberoasting**.


