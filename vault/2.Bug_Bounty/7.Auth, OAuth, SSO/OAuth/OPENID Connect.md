`OpenID` Connect extends the `OAuth` protocol to provide a dedicated identity and authentication layer that sits on top of the [basic OAuth implementation](https://portswigger.net/web-security/oauth#how-does-oauth-2-0-work). It adds some simple functionality that enables better support for the authentication use case of OAuth.

 To check application using OpenID connect or not You can simply try adding the `openid` scope or changing the response type to `id_token` and observing whether this results in an error.
 - Built on top of **OAuth 2.0**.
- Adds **standardized scopes** (same for all providers).
- Adds **new response type**: `id_token` (JWT containing user identity
### Identifying OIDC
- Look for **`scope=openid`** in authorization request (mandatory).
- Try adding `scope=openid` or `response_type=id_token`.
- Check provider docs or `/.well-known/openid-configuration`.

Before authenticating the user registering or `loging` him can be lead to `vuln`. User can register using endpoint of regestering user provide in configuration file. 
`/.well-known/openid-configuration`. 

After find endpoint of regestration send `req` on `reg` endpoint. You can try `ssrf` on these endpoints.
```bash
POST /openid/register HTTP/1.1 
Content-Type: application/json 
Accept: application/json 
Host: oauth-authorization-server.com 
Authorization: Bearer ab12cd34ef56gh89 

{ 
"application_type": "web", 
"redirect_uris": [ "https://client-app.com/callback", "https://client-app.com/callback2" ], 
"client_name": "My Application", 
"logo_uri": "https://client-app.com/logo.png", 
"token_endpoint_auth_method": "client_secret_basic", 
"jwks_uri": "https://client-app.com/my_public_keys.jwks", "userinfo_encrypted_response_alg": "RSA1_5", "userinfo_encrypted_response_enc": "A128CBC-HS256", 
… 
}
```

**Allowing authorization requests by reference**

- Normally, OAuth params are sent via query string.
- Some providers allow passing them in a JWT, referenced by a `request_uri`.
- `request_uri` can be a potential **SSRF vector**.
- May also bypass parameter validation (e.g., `redirect_uri`).
- Check support via `request_uri_parameter_supported` in config/docs, or test directly (sometimes works even if undocumented).

### 🔹 Response Types 
- `response_type=id_token token` → returns ID token + access token.
- `response_type=id_token code` → returns ID token + authorization code.

### Vulnerabilities
- Stricter than OAuth, but still inherits OAuth weaknesses.
- Extra features (like `id_token`) may add new attack surface.
- Many “OAuth authentication” labs are actually **OIDC-based**.


If state parameter missing so mean no CSRF protections being applied.