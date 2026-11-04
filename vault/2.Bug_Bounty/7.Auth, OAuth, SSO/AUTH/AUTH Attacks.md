**Authentication:**
The process of verifying a user’s identity, usually through credentials like usernames or email addresses, passwords, or unique tokens/pin codes.

**Authorization:**
authentication is successful and the user’s identity is verified, the next step involves determining which resources the user can access.
Modern web app use many authentication and authorization mechanism some use SSO single-sign-on  allow acces multiple application with single set of credentials.

**JWT:** Used for authentication and secure data exchange between applications. Supports both authentication and authorization.  
**OAuth:** Authorization protocol for third-party apps without sharing passwords. Primarily for authorization but can support authentication with other protocols.  
**SAML:** SSO protocol for exchanging authentication and authorization data between services. Enables single login for multiple apps; supports user attribute sharing.

#### **Username Enumeration:**
Occurs when apps reveal if a username/email exists during login attempts. This can help attackers narrow the attack surface to just guessing the password.

| **Username Exists**                                        | **Username Doesn’t Exist**                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------------- |
| Error message indicating that wrong<br>password is entered | Error message indicating that the<br>username or email does not exist |
| New cookie is set                                          | Cookies deleted                                                       |
| Modification in HTML response                              | HTML response remains same.                                           |
| Server takes more time to process the<br>request.          | Response time will be same                                            |
#### **Username Enumeration through Error Messages:**
Applications show different error messages for valid vs. invalid usernames. Attackers use this behavior with common username lists to identify valid accounts.
![[Screenshot_2025-07-23_14_50_26 3.png]]

#### **Username Enumeration through Timing Attack:**
Processing valid usernames often takes longer due to extra operations (e.g., fetching user data). Even if error messages are generic, attackers can measure response time to identify valid usernames.
Here is command to check response time
```bash
time curl - X POST - d "username="tmgm&password=ad" http://dev-portal.local:5000/
```
![[Screenshot_2025-07-23_14_50_26 4.png]]

**0m0.010s:** Represents the application taking approximately nine to ten milliseconds to respond, possibly when an invalid username such as **tmgm** or “demo” is supplied.
**0m0.060s:** Represents the application taking 60 milliseconds to respond, possibly when a valid username such as “admin” is supplied.
User sign-up page and password reset page, might also be susceptible to this behavior.

#### **Brute Force and Dictionary Attacks:**
Once a valid username is found, attackers typically attempt to guess the password using the following methods
- **Brute Force:** Tries all possible combinations; effective only against weak passwords.
- **Dictionary Attacks:** Target common or weak passwords (even long ones) found in wordlists.
- **Common Password Lists:** Use lists like _Common-Credentials_ from [SecLists](https://github.com/danielmiessler/SecLists/tree/master/Passwords/Common-Credentials) for realistic attempts. 
- **Detection:** Brute force attacks are noisy and easily detected by WAFs, SIEMs, and other security tools.

#### **Brute Forcing HTTP Basic Authentication:**
HTTP Basic authentication is one of the first forms of web authentication and is still quite popular. To brute force it we can use OWASP ZAP or wfuzz.
```bash
wfuzz --hc 401 -w password.txt --basic admin:FUZZ "http://site:5050/admin.php"
```
![[Screenshot_2025-07-22_04-16-56.png]]

Once attackers obtain a username or email address, they often turn to the darkweb or breaching databases. For this we can use [haveibeenpwned site](https://haveibeenpwned.com/) . Even if passwords are **hashed or encrypted**, attackers can still attempt to recover them using method like dictionary attacks, brute force, and precomputed tables, commonly known as **Rainbow Tables**

#### **Bypassing Authentication Using HTTP Verb Tampering:**
HTTP verb tampering can also be utilized to bypass the authentication mechanism. HTTP has various verbs allowing clients to interact with the server in different ways.
```headers
GET: Retrieves data from a resource.
HEAD: Like GET but only fetches headers, no body/content.
POST: Sends data to create or update a resource.
PUT: Creates or updates a resource on the server.
DELETE:Deletes the specified resource from the server.
```

Some web apps and servers may be misconfigured, improperly handling less common HTTP methods like PUT or DELETE while blocking POST. This can cause security issues such as authentication bypass.
we send GET request.
![[Screenshot_2025-07-23_14_50_26 5.png]]
when utilizing a “PUT” request to access the same resource unauthorized access was still possible.
![[Screenshot_2025-07-23_14_50_26 6.png]]


