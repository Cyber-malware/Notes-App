Any resource present within an Active Directory environment such as OUs, printers, users, domain controllers.
![[Pasted image 20251027172202.png]]
#### Users
These are the users within the organization's AD environment. Users are considered `leaf objects`, which means that they cannot contain any other objects within them. A User consider as security principal hash `SID` and `GSID`. A user may have [attributes](http://www.kouti.com/tables/userattributes.htm) and list is about `800`.

#### Machine 
Machine account are important in `AD` and can be identify by a `$` sign. like machine named `DC01` will have a machine account called `DC01$`. `Admin` accounts are attached with machine and no one can login to other instance and password of account automatically rotated out and generally comprised of 120 random characters. 

#### Contacts
A contact object is usually used to represent an external user and contains informational attributes such as first name, last name, email address, telephone number, etc. They are `leaf objects` and are NOT security principals (securable objects), so they don't have a SID, only a GUID. An example would be a contact card for a third-party vendor or a customer.
#### Printers
A printer object points to a printer accessible within the AD network. Like a contact, a printer is a `leaf object` and not a security principal, so it only has a GUID. Printers have attributes such as the printer's name, driver information, port number, etc.
#### Computers
A computer object is any computer joined to the AD network (workstation or server). Computers are `leaf objects` because they do not contain other objects. However, they are considered security principals and have a SID and a GUID.
#### Shared Folders
A shared folder object points to a shared folder on the specific computer where the folder resides. Shared folders can have stringent access control applied to them and accessible to everyone (even those without a valid AD account), open to only authenticated users (which means anyone with even the lowest privileged user account OR a computer account (`NT AUTHORITY\SYSTEM`) could access it), or be locked down to only allow certain users/groups access. 
Shared folders are NOT security principals and only have a GUID. A shared folder's attributes can include the name, location on the system, security access rights.
#### Groups
A group is considered a `container object` because it can contain other objects, including users, computers, and even other groups. A group IS regarded as a security principal and has a SID and a GUID.
The tool [BloodHound](https://github.com/BloodHoundAD/BloodHound) helps to discover attack paths within a network and illustrate them in a graphical interface.
#### Organizational Units (OUs)
Organizational Unit `OU` refers to containers that hold users, groups and computers to which similar policies should apply. In most cases, `OUs` will match departments in an enterprise.`OUs` are often used for administrative delegation of tasks without granting a user account full administrative rights
#### Domain
A domain is the structure of an AD network. Domains contain objects such as users and computers, which are organized into container objects: groups and OUs. Every domain has its own separate database and sets of policies that can be applied to any and all objects within the domain.
#### Domain Controllers
Domain Controllers are essentially the brains of an AD network. They handle authentication requests, verify users on the network, and control who can access the various resources in the domain.
#### Sites
A site in AD is a set of computers across one or more subnets connected using high-speed links. They are used to make replication across domain controllers run efficiently.
#### Built-in
In AD, built-in is a container that holds [default groups](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups) in an AD domain. They are predefined when an AD domain is created.
#### Foreign Security Principals
A foreign security principal (FSP) is an object created in AD to represent a security principal that belongs to a trusted external forest.




















































































