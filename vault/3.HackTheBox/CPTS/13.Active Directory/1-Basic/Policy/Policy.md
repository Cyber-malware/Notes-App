### Group Policy Objects (GPOs)
A [Group Policy Object (GPO)](https://docs.microsoft.com/en-us/previous-versions/windows/desktop/policy/group-policy-objects) is a virtual collection of policy settings that can be applied to `user(s)` or `computer(s)`. `GPOs` include policies such as screen lock timeout, disabling USB ports, enforcing a custom domain password policy etc.
[Security](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/security-policy-settings) policies also provided to secure the account and Domain.

#### GPO Precedence Order
![[Pasted image 20251229064124.png]]

### Enforced vs Block Inheritance:
Block Inheritance = `Ignore parent rules`
If an `OU` has Block Inheritance enabled:
- It will `NOT` receive `GPOs` from:
    - Domain
    - Parent `OUs`

Enforced ALWAYS wins
- `Parent GPO` = `Enforced`
- `Child OU` = `Block Inheritance`

