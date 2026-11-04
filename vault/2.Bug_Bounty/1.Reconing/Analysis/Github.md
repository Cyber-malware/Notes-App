```bash
(API_KEY OR api_key OR API_SECRET OR api_secret) tesla
("DB PASSWORD" OR DATABASE_URL OR "DATABASE Password") tesla
(AWS_ACCESS_KEY_ID OR aws_access_key_id OR aws_secret_access_key) tesla
filename:.env tesla
(password OR secret OR credential) tesla
(confidential OR sensitive) tesla
(error OR exception OR fatal) tesla
(token OR access_token) tesla
filename:config tesla
filename:settings tesla
(webhook OR weebhook) tesla
"-----BEGIN CERTIFICATE-----" tesla
"-----BEGIN OPENSSH PRIVATE KEY-----" tesla
"ssh2_auth_password" OR "passkey-passkeys" tesla
secrets tesla
tesla extension:json OR extension:yml OR extension:xml OR extension:config
tesla language:python
tesla language:javascript
```

```bash
org:target
org:target password
"target.com" password NOT test NOT example
"target.com" token NOT test NOT example
"target.com" jdbc NOT test NOT example
"target.com" user= NOT test NOT example
"target.com" user: NOT test NOT example
"target.com" pass= NOT test NOT example
"target.com" pass: NOT test NOT example
"target.com" access_key NOT test NOT example
"target.com" amazonaws NOT test NOT example
```

