
Add User in `AD`
```powershell
PS C:\htb> New-ADUser -Name "Orion Starchaser" -Accountpassword (ConvertTo-SecureString -AsPlainText (Read-Host "Enter a secure password") -Force ) -Enabled $true -OtherAttributes @{'title'="Analyst";'mail'="o.starchaser@inlanefreight.local"}
```

Remove the user in `AD`
```powershell
 Remove-ADUser -Identity pvalencia
```

To unlock the user.
```powershell
Unlock-ADAccount -Identity amasters 
```

Force to change password
```powershell
Set-ADUser -Identity amasters -ChangePasswordAtLogon $true
```

Create a New `AD OU` and `Security` Group from
```powershell
New-ADOrganizationalUnit -Name "Security Analysts" -Path "OU=IT,OU=HQ-NYC,OU=Employees,OU=CORP,DC=INLANEFREIGHT,DC=LOCAL"
```

```powershell
New-ADGroup -Name "Security Analysts" -SamAccountName analysts -GroupCategory Security -GroupScope Global -DisplayName "Security Analysts" -Path "OU=Security Analysts,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL" -Description "Members of this group are Security Analysts under the IT OU"
```

Add User to Group
```powershell
Add-ADGroupMember -Identity analysts -Members ACepheus,OStarchaser,ACallisto
```

Join Domain
```powershell
Add-Computer -DomainName INLANEFREIGHT.LOCAL -Credential INLANEFREIGHT\HTB-student_adm -Restart
```

Add a `Remote Computer` to a `Domain`
```powershell
Add-Computer -ComputerName ACADEMY-IAD-W10 -LocalCredential ACADEMY-IAD-W10\image -DomainName INLANEFREIGHT.LOCAL -Credential INLANEFREIGHT\htb-student_adm -Restart
```

Check `OU` Membership of a Host
```powershell
Get-ADComputer -Identity "ACADEMY-IAD-W10" -Properties * | select CN,CanonicalName,IPv4Address
```
