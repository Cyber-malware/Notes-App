Groups are primarily used to assign permissions to access resources to group of users or machines etc. 
`OUs` can also be used to delegate administrative tasks to a user, such as resetting passwords or unlocking user accounts without giving them additional admin rights that they may inherit through group membership.

### Types
Groups in Active Directory have two fundamental characteristics: `type` and `scope`. The `group type` defines the group's purpose, while the `group scope` shows how the group can be used within the domain or forest.

We must select group type before creating it. There are two main types: `security` and `distribution` groups.
![[Pasted image 20251229025420.png]]

The `Security groups` type is primarily for ease of assigning permissions and rights to a collection of users instead of one at a time. 
The `Distribution groups` type is used by email applications such as Microsoft Exchange to distribute messages to group members.

### Group Scopes

There are three different `group scopes`.
```
1. Domain Local Group
2. Global Group
3. Universal Group
```

#### Domain Local Group
Domain local groups can only be used to manage permissions in the domain where it was created. Local groups cannot be used in other domains but `CAN` contain users from `OTHER` domains. It can be nested to other local group but not in global.
#### Global Group 
It can be used to grant access to resources in another domain. It can contain accounts from  the domain where it created but `global` groups can be added to both `local` and other `global` groups.
#### Universal Group
It used to combine groups or users across multiple domains. Universal groups are stored in the `Global Catalog (GC)`.  The `GC` is replicated to all domain controllers in forest.
```powershell
PS C:\htb> Get-ADGroup  -Filter * |select samaccountname,groupscope

samaccountname                           groupscope
--------------                           ----------
Administrators                          DomainLocal
Users                                   DomainLocal
Guests                                  DomainLocal
Print Operators                         DomainLocal
Backup Operators                        DomainLocal
Storage Replica Administrators          DomainLocal
Domain Computers                             Global
Domain Controllers                           Global
Schema Admins                             Universal
Enterprise Admins                         Universal
Cert Publishers                         DomainLocal
```

- A global group can be converted to Universal group if it is `NOT` part of another global group.
- A domain local group can only be converted to Universal group if Domain local group `NOT` contain any other domain local group as member
- A universal group can be converted to a domain local group with any restriction.
- A universal group can be converted to global group if `NOT` contain any other universal groups as member.

### Built-in Groups vs Custom Groups
These groups are automatically created when a domain is set up. They are used for specific administrative tasks. Most only allow user accounts, not other groups `no group nesting`.

Created by organizations for their own needs and can be security or distribution groups. Commonly used for
```
- Job roles
- Access control
- Applications
```

#### Group Nesting
A group  is member of another group and user inherit permission indirectly. A user Not be directly in an admin group but still have admin privileges because their group is inside another group.
##### Examining Nested Groups via Blood Hound
![[Pasted image 20251229035441.png]]

