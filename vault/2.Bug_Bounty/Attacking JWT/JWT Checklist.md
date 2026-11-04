| No. | Test                       | What to Check                         | Vulnerable If          | Fix                                 |
| --- | -------------------------- | ------------------------------------- | ---------------------- | ----------------------------------- |
| 1   | **Sensitive Claims**       | JWT payload has passwords/keys        | Sensitive info present | Avoid storing sensitive data in JWT |
| 2   | **Signature Not Verified** | Modify payload, keep signature        | Access still granted   | Always verify JWT signatures        |
| 3   | **Alg: none**              | Set `alg` to `none`, remove signature | Token accepted         | Disallow `none` algorithm           |
| 4   | **Weak Secret**            | Brute-force HMAC secret               | Secret guessed         | Use strong, random secrets          |
| 5   | **Alg Confusion**          | Change `RS256` to `HS256`             | Token accepted         | Enforce strict algorithm validation |
| 6   | **Missing `exp`**          | No or invalid `exp` claim             | Token never expires    | Require and validate `exp`          |
| 7   | **Audience (`aud`)**       | Use token for wrong service           | Access granted         | Enforce correct `aud` claims        |
| 8   | **Tampered Payload**       | Modify payload only                   | Access granted         | Verify signature matches payload    |
| 9   | **Client-side Token**      | Tokens generated in frontend          | Secrets exposed        | Generate tokens server-side only    |
| 10  | **Long Token Lifetime**    | Very long `exp` value                 | Risk of misuse         | Use short-lived + refresh tokens    |

| #   | Test                      | What to Check                       | Vulnerable If             | Fix                                   |
| --- | ------------------------- | ----------------------------------- | ------------------------- | ------------------------------------- |
| 11  | **JWK Injection**         | Add attacker `jwk` to header        | Token accepted            | Validate against trusted keys only    |
| 12  | **JKU Spoofing**          | Point `jku` to attacker URL         | Key fetched from attacker | Allowlist JWKS URLs, validate TLS     |
| 13  | **`kid` Injection**       | Use path traversal or SQLi in `kid` | Server error/access       | Sanitize and validate `kid`           |
| 14  | **SSRF via x5u/jku**      | Use internal/malicious URLs         | Server makes requests     | Restrict and validate URLs            |
| 15  | **x5c Injection**         | Use fake certs in `x5c`             | Token accepted            | Accept certs only from trusted CAs    |
| 16  | **ES256 Nonce Reuse**     | Same `k` reused in ES256            | Private key leaked        | Use secure libs with random nonces    |
| 17  | **Predictable `jti`**     | Reuse or guess `jti`                | Token replayed            | Use random `jti`, track used tokens   |
| 18  | **Improper Scope**        | Use token on wrong service          | Access granted            | Enforce `scope`, `aud`, `role` claims |
| 19  | **Ignore Time Claims**    | Modify `exp`, `nbf`, `iat`          | Token accepted            | Enforce validation of time claims     |
| 20  | **Weak Algorithm**        | Use deprecated `alg`                | Token accepted            | Use RS256/ES256, reject weak `alg`    |
| 21  | **Invalid/Missing `iat`** | No or invalid `iat`                 | Token accepted            | Validate `iat`, sync server time      |
| 22  | **Insecure Storage**      | Tokens in localStorage              | Accessible via XSS        | Use HTTP-only cookies                 |
| 23  | **No Revocation**         | Use old token after logout          | Access still works        | Implement token revocation            |
| 24  | **No HTTPS**              | Send token via HTTP                 | Token sniffed             | Enforce HTTPS, use HSTS               |
| 25  | **Improper Session Mgmt** | JWT used for sessions               | Replay/session issues     | Implement secure session flow         |
| 26  | **CSRF with JWT**         | JWT auto-sent in CSRF attack        | Action allowed            | Use SameSite, CSRF tokens             |
| 27  | **JWT Theft via XSS**     | Steal token with JS                 | Token exfiltrated         | Prevent XSS, use HTTP-only storage    |
