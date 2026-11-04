`Rights` are typically assigned to users or groups and deal with permissions to `access` an object such as a file.
`privileges` grant a user permission to `perform an action` such as run a program, shut down a system, reset passwords, etc.

#### Important Built-in Groups
Active Directory comes with` premade` groups. Each group gives its members special rights and privileges. Some groups are VERY powerful and dangerous if misused.
Important `Build in` groups are Administrators, Enterprise admins and Domain admins.
Even if you’re not an `admin`, Windows can give you `special privileges` using Group Policy.

#### User Account Control
- Stops programs from using full power unless needed. You must run `PowerShell` or `CMD` as an `Administrator`. It protects against accidental damage

`Administrator` built-in group will grant a user full and unrestricted access to a computer. 
`SeBackupPrivilege` user right grants a user the ability to make backups of a system. 
`whoami /priv` Windows command can show us all user rights assigned to the current user.

