
**Abusing Forgot Password Functionality**  
Password reset features can be exploited if not implemented securely. Common issues include:
- **Predictable Tokens:** Using guessable values (e.g., MD5/SHA1 of username) for reset links.
- **Link Reuse:** Allowing reset links to be used multiple times instead of expiring after one use.
- **Token Reuse Across Users:** Using the same reset token for multiple accounts, enabling unauthorized access.

**Predictable Reset Token:**
The following is a real-world scenario that has been recreated for confidentiality purposes. The application in question contains a `Forgot Password` feature, allowing users to reset their password by providing a valid username.
![[Screenshot_2025-08-11_03-35-55.png]]

Here we can see Token is too short and weak easily exploitable.
![[Screenshot_2025-08-11_03-37-13.png]]

The backend code first converts the username into its hexadecimal representation, then encodes it using Base64, and finally appends it to the password reset link. 
This implementation makes it possible to generate a valid password reset token for any username. Here we generate the reset link for the username `admin`.
```bash
Python3 -c "print(".join([hex(ord(char))[2:] for char in 'admin'])) " | base64
```
We generate the reset token and reset the password successfully.

**PASSWORD RESET LINK POISONING VIA HOST HEADER INJECTION:**
Exploits Host Header Injection in password reset functionality to generate reset links pointing to an attacker controlled domain, allowing theft of reset tokens and account compromise.
![[Screenshot_2025-08-11_04-13-30.png]]

![[Screenshot_2025-08-11_04-14-09.png]]

When user click on reset link it will redirect to attacker domain and attacker will get the token. we can also do this task automated if token is for short time.

#### **Attacking Authorization:**
  IT Involves exploiting flaws like lack of access control, IDOR, or parameter tampering to access restricted resources.
- **Horizontal Privilege Escalation:** Accessing another user’s data/functions at the same privilege level.
- **Vertical Privilege Escalation:** Accessing data/functions meant for higher-privilege users (e.g., admins).

#### **1 - Horizontal Privilege Escalation
##### **Lack of Access Control:**
Missing or weak authorization checks can allow unauthorized access to sensitive endpoints or data. Often classified by OWASP as **Broken Access Control**.

During a bug bounty program, a directory was observed, which was protected against HTTP Basic Authentication.
![[Screenshot_2025-08-11_05-29-25.png]]
After this website reveal endpoint that contain sensitive information.
#### **2 - Vertical Privilege Escalation:**
Weak session handling allowed a low privileged user’s session ID to access admin only resources, resulting in vertical privilege escalation.
![[Screenshot_2025-08-11_05-34-38.png]]

##### **Insecure Direct Object References (IDOR)**
An access control flaw where attackers manipulate parameters (e.g., URLs, cookies) to directly access unauthorized objects (files, DB records, etc.) due to missing or improper authorization checks. Common in apps without centralized access control, especially in complex multi-role environments.

**IDOR in User.jsp:** The `user` parameter accepted a user ID (e.g., `261132`) to update account details. Incrementing the ID revealed other users’ data, including plaintext usernames and passwords, leading to **information disclosure** and potential **account takeover**.
![[Screenshot_2025-08-11_05-39-34.png]]

#### **Web Parameter Tampering:**
Many researchers use web parameter tampering and IDOR interchangeably but both are difference.
- **IDOR:** Manipulating parameters to access/modify unauthorized objects.
- **Web Parameter Tampering:** Manipulating parameters to alter app behavior (e.g., bypass authentication, disable security features).

**Example:** In a pentest, a profile settings page required the current password to change security settings (e.g., toggle 2FA, update password). Parameter tampering could bypass this requirement.
![[Screenshot_2025-08-11_05-50-39.png]]
We send wrong password and intercept the request it said wrong password and tell us to verify with OTP.
![[Screenshot_2025-08-11_05-51-08.png]]

We manually change the response form false to true and it did not ask us to verify with OTP.
![[Screenshot_2025-08-11_05-53-05.png]]

