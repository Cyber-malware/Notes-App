There are five `Flexible Single Master Operation FSMO` roles.

| **Roles**                  | **Description**                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Schema Master`            | Manages  read/write copy of schema, which defines all attributes  apply to an object.                                                                                                                                                                                                                                        |
| `Domain Naming Master`     | Manages domain names and ensures that two domains of same name are not created in the same forest.                                                                                                                                                                                                                           |
| `Relative ID (RID) Master` | Assigns blocks of `RIDs` to other `DCs` within domain that can be used for new objects. The `RID` Master helps ensure that multiple objects are not assigned the same `SID`. Domain object `SIDs` are the domain `SID` combined with the `RID` number assigned to the object to make the unique `SID`.                       |
| `PDC Emulator`             | The host with this role would be the authoritative `DC` in the domain and respond to authentication requests, password changes, and manage Group Policy Objects (`GPOs`). The `PDC` Emulator also maintains time within the domain.                                                                                          |
| `Infrastructure Master`    | This role translates `GUIDs`, `SIDs`, and `DNs` between domains. This role is used in organizations with multiple domains in a single forest. The Infrastructure Master helps them to communicate. If this role is not functioning properly, Access Control Lists (`ACLs`) will show `SIDs` instead of fully resolved names. |
These roles may be assigned to specific `DCs` or default each time new `DC` added. `FSMO` roles lead with `authentication` and `authorization`. 
## Domain and Forest Functional Levels
Microsoft introduced functional levels to determine features and capabilities in Active Directory Domain Services at the domain and forest level. They are also used to specify which Windows Server can run a Domain Controller in a domain or forest.
[This](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754918\(v=ws.10\)?redirectedfrom=MSDN) and [this](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-functional-levels) article describe both the domain and forest functional levels from `Windows 2000` native to `Windows Server 2012 R2`.

Forest functional levels have introduced a few key capabilities over the years.

|**Version**|**Capabilities**|
|---|---|
|`Windows Server 2003`|saw the introduction of the forest trust, domain renaming, read-only domain controllers (RODC), and more.|
|`Windows Server 2008`|All new domains added to the forest default to the Server 2008 domain functional level. No additional new features.|
|`Windows Server 2008 R2`|Active Directory Recycle Bin provides the ability to restore deleted objects when AD DS is running.|
|`Windows Server 2012`|All new domains added to the forest default to the Server 2012 domain functional level. No additional new features.|
|`Windows Server 2012 R2`|All new domains added to the forest default to the Server 2012 R2 domain functional level. No additional new features.|
|`Windows Server 2016`|[Privileged access management (PAM) using Microsoft Identity Manager (MIM).](https://docs.microsoft.com/en-us/windows-server/identity/whats-new-active-directory-domain-services#privileged-access-management)|
## Trusts
A trust is used to establish `forest-forest` or `domain-domain` authentication, allowing users to access resources in (or administer) another domain outside of the domain their account resides in. A trust creates a link between the authentication systems of two domains.

There are several trust types.

| **Trust Type** | **Description**                                                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Parent-child` | Domains within the same forest. The child domain has a two-way transitive trust with the parent domain.                                                                |
| `Cross-link`   | a trust between child domains to speed up authentication.                                                                                                              |
| `External`     | A non-transitive trust between two separate domains in separate forests which are not already joined by a forest trust. This type of trust utilizes SID filtering.     |
| `Tree-root`    | a two-way transitive trust between a forest root domain and a new tree root domain. They are created by design when you set up a new tree root domain within a forest. |
| `Forest`       | a transitive trust between two forest root domains.                                                                                                                    |
![[Pasted image 20251027200025.png]]

Trusts can be transitive or non-transitive.
- A transitive trust means that trust is extended to objects that the child domain trusts.
- In a non-transitive trust, only the child domain itself is trusted.
    
Trusts can be set up to be one-way or two-way (bidirectional).
- In bidirectional trusts, users from both trusting domains can access resources.
- In a one-way trust, only users in a trusted domain can access resources in a trusting domain, not vice-versa. The direction of trust is opposite to the direction of access.
Often, domain trusts are set up improperly and provide unintended attack paths.












