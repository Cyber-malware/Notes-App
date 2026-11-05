
Enumerating and bypassing security controls are outside the scope of this module, but we wanted to give an overview of the possible technologies we may encounter during an assessment.

#### Checking Defender status with Get-MpComputerStatus
`Window 10` defender improved over the year and by default, will block tools such as `PowerView`. We can use build in `Powershell`, `cmdlet`  [Get-MpComputerStatus](https://docs.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) to get current defender status. 
```powershell-session
 Get-MpComputerStatus

AMEngineVersion                 : 1.1.17400.5
AMProductVersion                : 4.10.14393.0
AMServiceEnabled                : True
AntispywareSignatureAge         : 1
QuickScanStartTime              : 9/3/2020 12:49:49 AM
RealTimeProtectionEnabled       : True
```
### PowerShell Constrained Language Mode
`PowerShell` [Constrained Language Mode](https://devblogs.microsoft.com/powershell/powershell-constrained-language-mode/) block `COM` objects and allow only approved `.NET` types, `XAML` based work flows, `Powershell` classes and more. We can find whether we are in `FULL Language Mode` or `Constrained Language Mode`. 

 [AppLocker](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-defender-application-control/applocker/what-is-applocker) is Microsoft's application give control administrator over file and application that user can run. It is common for `org` to block `powershell.exe` or `cmd.exe` and write access to certain directories but this can all be bypassed. 

#### Using Get-AppLockerPolicy cmdlet
`Org` often focus on blocking `PowerShell.exe` executable, but forget about the other [PowerShell executable locations](https://www.powershelladmin.com/wiki/PowerShell_Executables_File_System_Locations) such as 
```powershell
%SystemRoot%\SysWOW64\WindowsPowerShell\v1.0\powershell.exe
or
PowerShell_ISE.exe
```
We can see that this is the case in the `AppLocker` rules shown below. All Domain Users are disallowed from running the 64-bit PowerShell executable located at:
```powershell
%SystemRoot%\system32\WindowsPowerShell\v1.0\powershell.exe
```

 we can merely call it from other locations. Sometimes, we run into more stringent `AppLocker` policies that require more creativity to bypass.
 
```powershell
Get-AppLockerPolicy -Effective | select -ExpandProperty RuleCollections

PathConditions      : {%SYSTEM32%\WINDOWSPOWERSHELL\V1.0\POWERSHELL.EXE}
PathExceptions      : {}
PublisherExceptions : {}
HashExceptions      : {}
Id                  : 3d57af4a-6cf8-4e5b-acfc-c2c2956061fa
Name                : Block PowerShell
Description         : Blocks Domain Users from using PowerShell on workstations
UserOrGroupSid      : S-1-5-21-2974783224-3764228556-2640795941-513
Action              : Deny

PathConditions      : {%PROGRAMFILES%\*}
PathExceptions      : {}
PublisherExceptions : {}
HashExceptions      : {}
Id                  : 921cc481-6e17-4653-8f75-050b80acca20
Name                : (Default Rule) All files located in the Program Files folder
Description         : Allows members of the Everyone group to run applications that are located in the Program Files folder.
UserOrGroupSid      : S-1-1-0
Action              : Allow

PathConditions      : {%WINDIR%\*}
PathExceptions      : {}
PublisherExceptions : {}
HashExceptions      : {}
Id                  : a61c8b2c-a319-4cd0-9690-d2177cad7b51
Name                : (Default Rule) All files located in the Windows folder
Description         : Allows members of the Everyone group to run applications that are located in the Windows folder.
UserOrGroupSid      : S-1-1-0
Action              : Allow

PathConditions      : {*}
PathExceptions      : {}
PublisherExceptions : {}
HashExceptions      : {}
Id                  : fd686d83-a829-4351-8ff4-27c7de5755d2
Name                : (Default Rule) All files
Description         : Allows members of the local Administrators group to run all applications.
UserOrGroupSid      : S-1-5-32-544
Action              : Allow
```


### PowerShell Constrained Language Mode
PowerShell [Constrained Language Mode](https://devblogs.microsoft.com/powershell/powershell-constrained-language-mode/) lock many `powershell` feature such as blocking `COM objects`, allow only approved `.NET` types , `XML` based workflows, `powershell` classes and more. We can check with this command.
```powershell
$ExecutionContext.SessionState.LanguageMode

ConstrainedLanguage
```

### LAPS
The Microsoft [Local Administrator Password Solution (LAPS)](https://www.microsoft.com/en-us/download/details.aspx?id=46899) is used randomize and rotate the local administrator password on windows hosts and prevent lateral movement. We can check what domain user can read `LAPS` password set for machine. The [LAPSToolkit](https://github.com/leoloobeek/LAPSToolkit) greatly help in these tasks.

#### Using Find-LAPSDelegatedGroups
This command checks `OU-level delegated permissions` to see which `groups` have been explicitly granted rights to read `LAPS` passwords.

```powershell
PS C:\htb> Find-LAPSDelegatedGroups

OrgUnit                                             Delegated Groups
-------                                             ----------------
OU=Servers,DC=INLANEFREIGHT,DC=LOCAL                INLANEFREIGHT\Domain Admins
OU=Servers,DC=INLANEFREIGHT,DC=LOCAL                INLANEFREIGHT\LAPS Admins
OU=Workstations,DC=INLANEFREIGHT,DC=LOCAL           INLANEFREIGHT\Domain Admins
OU=Workstations,DC=INLANEFREIGHT,DC=LOCAL           INLANEFREIGHT\LAPS Admins
OU=Web Servers,OU=Servers,DC=INLANEFREIGHT,DC=LOCAL INLANEFREIGHT\Domain Admins
OU=Web Servers,OU=Servers,DC=INLANEFREIGHT,DC=LOCAL INLANEFREIGHT\LAPS Admins
OU=SQL Servers,OU=Servers,DC=INLANEFREIGHT,DC=LOCAL INLANEFREIGHT\Domain Admins
OU=SQL Servers,OU=Servers,DC=INLANEFREIGHT,DC=LOCAL INLANEFREIGHT\LAPS Admins
OU=File Servers,OU=Servers,DC=INLANEFREIGHT,DC=L... INLANEFREIGHT\Domain Admins
OU=File Servers,OU=Servers,DC=INLANEFREIGHT,DC=L... INLANEFREIGHT\LAPS Admins
OU=Contractor Laptops,OU=Workstations,DC=INLANEF... INLANEFREIGHT\Domain Admins
OU=Contractor Laptops,OU=Workstations,DC=INLANEF... INLANEFREIGHT\LAPS Admins
OU=Staff Workstations,OU=Workstations,DC=INLANEF... INLANEFREIGHT\Domain Admins
OU=Staff Workstations,OU=Workstations,DC=INLANEF... INLANEFREIGHT\LAPS Admins
OU=Executive Workstations,OU=Workstations,DC=INL... INLANEFREIGHT\Domain Admins
OU=Executive Workstations,OU=Workstations,DC=INL... INLANEFREIGHT\LAPS Admins
OU=Mail Servers,OU=Servers,DC=INLANEFREIGHT,DC=L... INLANEFREIGHT\Domain Admins
OU=Mail Servers,OU=Servers,DC=INLANEFREIGHT,DC=L... INLANEFREIGHT\LAPS Admins
```

#### Using Find-AdmPwdExtendedRights
The `Find-AdmPwdExtendedRights` checks Any principal with `All Extended Rights` can read the LAPS password even if they’re NOT in LAPS Admins.
```powershell
Find-AdmPwdExtendedRights

ComputerName                Identity                    Reason
------------                --------                    ------
EXCHG01.INLANEFREIGHT.LOCAL INLANEFREIGHT\Domain Admins Delegated
EXCHG01.INLANEFREIGHT.LOCAL INLANEFREIGHT\LAPS Admins   Delegated
SQL01.INLANEFREIGHT.LOCAL   INLANEFREIGHT\Domain Admins Delegated
SQL01.INLANEFREIGHT.LOCAL   INLANEFREIGHT\LAPS Admins   Delegated
WS01.INLANEFREIGHT.LOCAL    INLANEFREIGHT\Domain Admins Delegated
WS01.INLANEFREIGHT.LOCAL    INLANEFREIGHT\LAPS Admins   Delegated
```

#### Using Get-LAPSComputers
we can use `Get-LAPSComputers` function to search for computer that have `LAPS` enabled when `pass` expire time and clear text local admin passwords if our user has access.
```powershell
PS C:\htb> Get-LAPSComputers

ComputerName                Password       Expiration
------------                --------       ----------
DC01.INLANEFREIGHT.LOCAL    6DZ[+A/[]19d$F 08/26/2020 23:29:45
EXCHG01.INLANEFREIGHT.LOCAL oj+2A+[hHMMtj, 09/26/2020 00:51:30
SQL01.INLANEFREIGHT.LOCAL   9G#f;p41dcAe,s 09/26/2020 00:30:09
WS01.INLANEFREIGHT.LOCAL    TCaG-F)3No;l8C 09/26/2020 00:46:04
```

