JWT (JSON Web Token) is an alternative to session-based authentication and is commonly used in web services for exchanging authentication information. It ensures message integrity, allowing both the client and the server to verify authenticity. Being stateless, JWT is ideal for REST APIs and helps reduce server resource usage. After a user logs in, the server issues a token containing claims such as the user ID, roles, and other relevant details, which are then used to authenticate subsequent requests.

- **Header** – token type & signing algorithm.
- **Payload** – claims/data.
- **Signature** – ensures data integrity.
![[Screenshot_2025-08-12_10-47-51.png]]
To generate the signature, both the header and the payload need to be encoded using base64 URL encoding.

**JWT Scenario 1: Brute Force Secret Key**
In this secret key is too short. It can allow an attacker to recreate the JWT and sign it with the key.
![[Screenshot_2025-08-12_10-58-23.png]]
Hashcat will be used to guess the secret key using a wordlist. The secret key[ jwt-secret]([https://github.com/wallarm/jwt-secrets) to brute force the key.

```bash
hashcat -a 0 -m 16500 <token> <wordlist>
```

![[Screenshot_2025-08-12_10-59-14.png]]
Now we can change the information in jwt and encode it again.

#### **JWT Scenario 2: Exploiting None Token**
In JWTs, the `alg` field specifies the algorithm used to sign the token. The vulnerability emerges when JWT libraries rely exclusively on the `alg` to identify the signing algorithm and mistakenly validate tokens with the `None` algorithm as genuinely signed.
Originally, the **`"alg": "none"`** option in JWT was **intended for trusted environments** where the token’s authenticity was already confirmed through **some other secure method** (e.g., sent over a secure, pre-validated channel, or generated and consumed entirely in a closed system).

- `alg` field in JWT specifies the signing algorithm. `"none"` means no signature.
- Some libraries **incorrectly accept** `"alg": "none"` as valid without verification.
- Attackers can forge tokens with arbitrary claims (e.g., `"role": "admin"`).

Modify the token algorithm value to none and then remove the signature.
```token
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VybmFtZSI-
6InRtZ20iLCJhZG1pbmlzdHJhdG9yIjp0cnVlLCJ0aW1lc3RhbXAiO-
jE2OTgzMjU2NjEsImV4cCI6MTY5ODMyOTI2MSwidXNlcl9pZCI6M-
TIzNDV9.
```
![[Screenshot_2025-08-12_11-09-15.png]]

