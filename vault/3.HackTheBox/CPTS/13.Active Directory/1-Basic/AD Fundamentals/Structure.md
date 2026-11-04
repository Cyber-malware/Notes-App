`AD` Domain service is method for storing directory data and making data available to network users. `AD DS` also provide way for authorize the user on same network.

`AD` is large database for all users to in domain regardless of its privilege. `AD` user account with no  much `Priv` can be used to enumerate the admin accounts.

|                          |                                                         |
| ------------------------ | ------------------------------------------------------- |
| Domain Computers         | List of all machines                                    |
| Domain Group Information | Which group exist and who belong to which group         |
| Default Domain Policy    | main group policy define logout,password complexity etc |
| Password Policy          | Rules for Password                                      |
| Domain Trusts            | Permission on objects                                   |

A domain is structure which contain Users, computers and Groups. Its has many Built in `OU` such as `Domain Controllers`, `Users` and `Computers`. `OUs` may contain Objects and Sub Organizational  Units allow assignment of different group policies. 

```shell
INLANEFREIGHT.LOCAL/
├── ADMIN.INLANEFREIGHT.LOCAL
│   ├── GPOs
│   └── OU
│       └── EMPLOYEES
│           ├── COMPUTERS
│           │   └── FILE01
│           ├── GROUPS
│           │   └── HQ Staff
│           └── USERS
│               └── barbara.jones
├── CORP.INLANEFREIGHT.LOCAL
└── DEV.INLANEFREIGHT.LOCAL
```

![[Pasted image 20251027152706.png]]

Here below in figure `Root` domain trust each other but not child domains. Child domain from Forest A did not built trust with Child domain in Forest B. Mean `admin.dev.freightlogistics.local` would NOT be able to authenticate to machines in the `wh.corp.inlanefreight.local` domain by default even though a bidirectional trust exists between the top-level `inlanefreight.local` and `freightlogistics.local` domains. For this another Trust need to be established. 

![[Pasted image 20251027153001.png]]

















