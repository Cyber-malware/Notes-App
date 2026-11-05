`OAuth` is a commonly used authorization framework that enables websites and web applications to request limited access to a user's account on another application. Crucially, `OAuth` allows the user to grant this access without exposing their login credentials to the requesting application.
![[Pasted image 20260101130124.jpg]]

If you see grant type as code in request so its `Auth` grant type and if you see grant type as implicit so its implicit grant type. `Client_secret` is imp and client app need to validate its self  to access data which given while regestering.

In implicit grant type token stored in browser history or can be stolen by attacker through `Xss` so it has been deprecated. 

Check for `redirect_uri` parameter or `callback` parameter for open redirect or `SSRF`.
```bash
https://oauth-authorization-server.com/?client_id=123&redirect_uri=client-app.com/callback&redirect_uri=evil-user.net

https://client-app.com/oauth/callback/../../example/path
```

Also check for `CSRF` attack
```bash
<iframe src="https://YOUR-LAB-ID.web-security-academy.net/oauth-linking?code=STOLEN-CODE"></iframe>
```

