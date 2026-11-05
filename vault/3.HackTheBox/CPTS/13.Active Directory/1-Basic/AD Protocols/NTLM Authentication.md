Aside from Kerberos and LDAP, Active Directory uses several other authentication methods which can be used (and abused) by applications and services in AD. Which includes `LM`, `NTLM`, `NTLMv1` and `NTLMv2`. Where `LM` and `NTLM` are hashes and `NTLMv1` and `NTLMv2` are authentication protocols that utilize `LM` and `NT` hash.
#### Hash Protocol Comparison

| **Hash/Protocol** | **Cryptographic technique**                          | **Mutual Authentication** | **Message Type**                | **Trusted Third Party**                         |
| ----------------- | ---------------------------------------------------- | ------------------------- | ------------------------------- | ----------------------------------------------- |
| `NTLM`            | Symmetric key cryptography                           | No                        | Random number                   | Domain Controller                               |
| `NTLMv1`          | Symmetric key cryptography                           | No                        | MD4 hash, random number         | Domain Controller                               |
| `NTLMv2`          | Symmetric key cryptography                           | No                        | MD4 hash, random number         | Domain Controller                               |
| `Kerberos`        | Symmetric key cryptography & asymmetric cryptography | Yes                       | Encrypted ticket using DES, MD5 | Domain Controller/Key Distribution Center (KDC) |
### LN:
LAN manager hash oldest window password storage mechanism. Stored pass in `SAM` and `NTDS.DIT (DC)`. Disable by default since `Window server 2008`. 
**Weaknesses:**
    - Max **14-character** passwords.
    - Case **insensitive**; converted to uppercase → small `keyspace` (69 chars).
    - Split into **two 7-character chunks** → attacker cracks two small chunks instead of full password.
    - Second half always identical for ≤7-character passwords.
- Uses `DES` encryption with the constant string **KGS!@#$%**.
- Example `LM` hash:  
    `299bd128c1101fd6`
- Older systems (`XP/2003` and earlier) stored both `LM` and `NTLM` by default.
### NT Hash / NTLM
Modern Windows uses **NTLM** (NT LAN Manager). `NTLM` Authentication Process (3 messages):
`NEGOTIATE_MESSAG`
`CHALLENGE_MESSAGE`
`AUTHENTICATE_MESSAGE`

**Hash format**
- Stored in `SAM` (local) or `NTDS.DIT` (domain).
- NT hash = `MD4(UTF-16-LE`(password).
- Stronger than `LM` but still fast to brute force using `GPUs`.
- Vulnerable to `pass-the-hash` (`PtH`).
![[Pasted image 20251209053514.png]]
```e.g
Rachel:500:aad3c435b514a4eeaad3b935b51304fe:e46b9e548fa0d122de7f59fb6d48eaa2:::
```
### NTLMv1 (Net-NTLMv1)
- Challenge/response protocol using **LM + NT hash**.
- Capturable via Responder or NTLM relay.
- Cannot be used for `PtH`.
- Server sends **8-byte challenge** → client returns **24-byte response**.
```e.g
u4-netntlm::kNS:338d08f8e26de933...:9526fb8c23a90751...
```
### NTLMv2 (Net-NTLMv2)
- Default since Windows 2000.
- Stronger than NTLMv1.
- Uses  `HMAC-MD5` and client challenge with timestamps.
```e.g
admin::N46iSNekpT:08ca45b7d7ea58ee:88dcbe...
```
### Domain Cached Credentials (MSCache2 / DCC2)
Used when a domain-joined host cannot communicate with the DC (offline login).
- Stores credentials in `HKEY_LOCAL_MACHINE\SECURITY\Cache`
- Stores **the last 10 hashes by default**.
- Uses **MSCache v2** algorithm (slow to crack).
- Cannot be used for `PtH`.
- Retrieved only after **local admin** access.


