
Every machine that join domain except `DCs` will put in container called computer. 
![[Pasted image 20260120013748.png]]

`Workstation` is most common device in `AD` that user used to do their work and browsing purposes. This should never have privileged user signed into them. 

`Server` are second most imp in `AD` and provide services to users.  

`Domain controller` are third most imp devices used to manage `AD` domain and consider as most sensitive as they contain password hashes.

Its recommendable to create separate `OUs` for Servers and Workstations
![[Pasted image 20260120015100.png]]

Group policy opening is complete `OU` hierarchy.
![[Pasted image 20260120015140.png]]

GPO will apply to the linked `OU` and any `subOUs` under it.
From those, the `Default Domain Policy` and `RDP Policy` are linked to the `thm.local` domain as a whole, and the `Default Domain Controllers Policy` is linked to the `Domain Controllers` `OU` only.

### GPO distribution
`GPOs` are distributed to network via network called `SYSVOL` which stored in `DC`. All the user in network have access to this share to `sync` their `GPOs` and default share point is `C:\Windows\SYSVOL\sysvol\`.
It take 2 hours to implement the changes done in `GPOs`.  if you want quick on any computer you can run this command on desired `PC`.

```powershell
PS C:\> gpupdate /force
```


### Trust Relationships
`One way trust relationship` if `Domain A` trust `DOmain B` mean a user from `B` can authorize to access resource on `A`.
![[Pasted image 20260120051533.png]]

`Two way trust relationship` can be made allow both domain mutually authorize user from other. Joining server domains under a tree or forest will form two way trust relationship. 

