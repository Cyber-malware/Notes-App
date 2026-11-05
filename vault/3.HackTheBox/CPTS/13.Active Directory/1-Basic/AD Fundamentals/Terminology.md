#### Object
An `Object` is any resource like `OU`, `Printers` or `Users` and `Domain controller` present in `AD`.
#### Attributes
Every object in Active Directory has an associated set of [attributes](https://docs.microsoft.com/en-us/windows/win32/adschema/attributes-all) used to define characteristics of the given object such as `hostname` and `DNS` name. All attributes in AD have an associated `LDAP` name that can be used when performing `LDAP` queries, such as `displayName` for `Full Name` and `given name` for `First Name`.
#### Schema
The Active Directory [schema](https://docs.microsoft.com/en-us/windows/win32/ad/schema) is essentially the blueprint of any enterprise environment. It defines what types of objects can exist in the AD database and their associated attributes. It define information that hold about each objects.  For example, users in AD belong to the class user, and computer objects to computer and so on.
#### Domain
A domain is a logical group of objects such as computers, `users`, `OUs` , `groups`, etc. We can think of each domain as a different city within a state or country.
#### Forest
A forest is a collection of Active Directory domains. It is the topmost container and contains all of the AD objects. It can contain multiple domains.
#### Tree
A tree is a collection of Active Directory domains that begins at a single root domain. A forest is a collection of AD trees. Each domain in a tree shares a boundary with the other domains.
![[Pasted image 20260120051150.png]]
#### Container
Two types of Objects in AD. `Container` and `Leaf`
Container objects hold other objects and have a defined place in the directory `subtree` hierarchy.
#### Leaf
Leaf objects do not contain any objects and are found at the end of the `subtree` hierarchy. Its like file inside folder.
#### Global Unique Identifier (GUID)
A [GUID](https://docs.microsoft.com/en-us/windows/win32/adschema/a-objectguid) is a unique 128-bit value assigned when a domain user or group is created. This GUID value is unique across the enterprise, similar to a MAC address. Every single object created by Active Directory is assigned a GUID, not only user and group objects. It help to search most accurate results in Enterprise.
#### Security principals 
[Security principals](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-principals) are anything that the operating system can authenticate, including users, computer accounts, or even threads/processes that run in the context of a user or computer account (i.e., an application such as Tomcat running in the context of a service account within the domain).
#### Security Identifier (SID)
A [security identifier](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-principals), or SID is used as a unique identifier for a security principal or security group. Every account, group, or process has its own unique SID, which, in an AD environment, is issued by the domain controller and stored in a secure database. It can only be used once to identify user or group.
#### Distinguished Name (DN)
A [Distinguished Name (DN)](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ldap/distinguished-names) describes the full path to an object in AD (such as `cn=bjones, ou=IT, ou=Employees, dc=inlanefreight, dc=local`). In this example, the user `bjones` works in the IT department of the company `Inlanefreight`, and his account is created in an Organizational Unit `OU` that holds accounts for company employees.
#### Relative Distinguished Name (RDN)
A [Relative Distinguished Name (RDN)](https://docs.microsoft.com/en-us/windows/win32/ad/object-names-and-identities) is a single component of the Distinguished Name that identifies the object as unique from other objects at the current level in the naming hierarchy. `AD` does not allow two objects with same name under same parent container but there can be two objects with the same `RDNs` that are still unique in the domain because they have different `DNs`.

![[Pasted image 20251027164007.png]]

#### sAMAccountName
The [sAMAccountName](https://docs.microsoft.com/en-us/windows/win32/ad/naming-properties#samaccountname) is the user's logon name. Here it would just be `bjones`. It must be a unique value and 20 or fewer characters.

In the early days of AD, if you had multiple DCs in an environment, they would fight over which DC gets to make changes, and sometimes changes would not be made properly. Then Micrsoft Implement `Last writer wins` , then `Master` and then  [Flexible Single Master Operation (FSMO)](https://docs.microsoft.com/en-us/troubleshoot/windows-server/identity/fsmo-roles) roles. Must Read from Link.

#### Global Catalog
A [global catalog (GC)](https://docs.microsoft.com/en-us/windows/win32/ad/global-catalog) is a domain controller that stores copies of ALL objects in an Active Directory forest. The `GC` stores a full copy of all objects in the current domain and a partial copy of objects that belong to other domains in the forest.

#### Read-Only Domain Controller (RODC)
A [Read-Only Domain Controller (RODC)](https://docs.microsoft.com/en-us/windows/win32/ad/rodc-and-active-directory-schema) has a read-only Active Directory database. No AD account passwords are cached on an RODC (other than the RODC computer account & RODC KRBTGT passwords.)

#### Replication
[Replication](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/replication/active-directory-replication-concepts) happens in AD when AD objects are updated and transferred from one Domain Controller to another. Whenever a DC is added, connection objects are created to manage replication between them.
#### Service Principal Name (SPN)
A [Service Principal Name (SPN)](https://docs.microsoft.com/en-us/windows/win32/ad/service-principal-names) uniquely identifies a service instance. They are used by `Kerberos` authentication to associate an instance of a service with a logon account, allowing a client application to request the service to authenticate an account without needing to know the account name.
#### Group Policy Object (GPO)

[Group Policy Objects (GPOs)](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/policy/group-policy-objects) are virtual collections of policy settings. Each GPO has a unique GUID. A GPO can contain local file system settings or Active Directory settings. GPO settings can be applied to both user and computer objects.
#### Access Control List (ACL)
An [Access Control List (ACL)](https://docs.microsoft.com/en-us/windows/win32/secauthz/access-control-lists) is the ordered collection of Access Control Entries `ACEs` that apply to an object.
#### Access Control Entries (ACEs)
Each [Access Control Entry (ACE)](https://docs.microsoft.com/en-us/windows/win32/secauthz/access-control-entries) in an `ACL` identifies a trustee (user account, group account, or logon session) and lists the access rights that are allowed, denied, or audited for the given trustee.
#### Discretionary Access Control List (DACL)

DACLs define which security principals are granted or denied access to an object; it contains a list of ACEs. When a process tries to access a securable object, the system checks the ACEs in the object's DACL to determine whether or not to grant access.
#### System Access Control Lists (SACL)
Allows for administrators to log access attempts that are made to secured objects. ACEs specify the types of access attempts that cause the system to generate a record in the security event log.
#### Fully Qualified Domain Name (FQDN)
An FQDN is the complete name for a specific computer or host. It is written with the hostname and domain name in the format [host name].[domain name].[tld]. This is used to specify an object's location in the tree hierarchy of `DNS`.
#### Tombstone
A [tombstone](https://ldapwiki.com/wiki/Wiki.jsp?page=Tombstone) is a container object in AD that holds deleted AD objects. When an object is deleted from AD, the object remains for a set period of time known as the `Tombstone Lifetime,` and the `isDeleted` attribute is set to `TRUE`. Its remain in `Tombstone` if `Recycle Bin` is not enabled for 180 days.
#### AD Recycle Bin
The [AD Recycle Bin](https://techcommunity.microsoft.com/t5/ask-the-directory-services-team/the-ad-recycle-bin-understanding-implementing-best-practices-and/ba-p/396944) was first introduced in `Windows Server 2008 R2` to facilitate the recovery of deleted AD objects. This made it easier for sysadmins to restore objects, avoiding the need to restore from backups. It remain in recycle bin for default 60 days,
#### SYSVOL
The [SYSVOL](https://social.technet.microsoft.com/wiki/contents/articles/8548.active-directory-sysvol-and-netlogon.aspx) folder, or share, stores copies of public files in the domain such as system policies, Group Policy settings, logon/logoff scripts, and often contains other types of scripts that are executed to perform various tasks in AD.
#### AdminSDHolder
The [AdminSDHolder](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/appendix-c--protected-accounts-and-groups-in-active-directory) object is used to manage ACLs for members of built-in groups in AD marked as privileged. It acts as a container that holds the Security Descriptor applied to members of protected groups.
#### dsHeuristics
The [dsHeuristics](https://docs.microsoft.com/en-us/windows/win32/adschema/a-dsheuristics) attribute is a string value set on the Directory Service object used to define multiple forest-wide configuration settings.
#### adminCount
The [adminCount](https://docs.microsoft.com/en-us/windows/win32/adschema/a-admincount) attribute determines whether or not the `SDProp` process protects a user. If value `0` or not specify user is not protected and if `1` User is protected. Attackers will often look for accounts with the `adminCount` attribute set to `1` to target in an internal environment. These are often privileged accounts and may lead to further access or full domain compromise.
#### Active Directory Users and Computers (ADUC)
ADUC is a GUI console commonly used for managing users, groups, computers, and contacts in AD. Changes made in ADUC can be done via PowerShell as well.
#### ADSI Edit
ADSI Edit is a GUI tool used to manage objects in AD. It provides access to far more than is available in ADUC and can be used to set or delete any attribute available on an object, add, remove, and move objects as well.
#### sIDHistory
[This](https://docs.microsoft.com/en-us/defender-for-identity/cas-isp-unsecure-sid-history-attribute) attribute holds any SIDs that an object was assigned previously. It is usually used in migrations so a user can maintain the same level of access when migrated from one domain to another.
#### NTDS.DIT
The NTDS.DIT file can be considered the heart of Active Directory. It is stored on a Domain Controller at `C:\Windows\NTDS\` and is a database that stores AD data such as information about user and group objects, group membership, and, most important to attackers and penetration testers, the password hashes for all users in the domain. If the setting [Store password with reversible encryption](https://docs.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/store-passwords-using-reversible-encryption) is enabled, then the `NTDS.DIT` will also store the `cleartext` passwords for all users created
#### MSBROWSE
MSBROWSE is a Microsoft networking protocol that was used in early versions of Windows-based local area networks (LANs) to provide browsing services. It was used to maintain a list of resources, such as shared printers and files, that were available on the network, and to allow users to easily browse and access these resources.
In older version Window we use `nbtstat -A ip-address`. Today, MSBROWSE is largely obsolete and is no longer in widespread use. Modern Windows-based LANs use the Server Message Block (SMB) protocol for file and printer sharing, and the Common Internet File System (CIFS) protocol for browsing services.












































