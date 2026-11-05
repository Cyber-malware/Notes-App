
![[Pasted image 20260121135144.png]]

```
[Domain User]
     |
     | 1. LDAP query
     v
[AD: Service Accounts with SPNs]
     |
     | 2. Request TGS (no admin needed)
     v
[KDC / DC]
     |
     | 3. TGS encrypted with
     |    Service Account NTLM hash
     v
[TGS Ticket (ciphertext)]
     |
     | 4. Extract ticket
     v
[Offline Password Cracking]
     |
     | 5. Crack succeeds
     v
[Service Account Credentials]
     |
     | 6. Privilege depends on account
     v
[Lateral Movement / PrivEsc / DA]
```