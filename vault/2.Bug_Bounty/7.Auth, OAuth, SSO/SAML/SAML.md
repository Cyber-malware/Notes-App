Security Assertion Markup Language (SAML) is an open standard that allows the communication between an `identity providers `(IdP) and a` service providers` (SP).
SAML has feature SSO (single sign in) which allow user to create account on one site and use it to other linked sites.

`SAML` simplifies the Auth and Oauth process also it keep you identity seprate from SP (service provider).
For more here [article](https://medium.com/stolabs/how-saml-works-and-some-attacks-on-it-2f62db0ef1d9) and this [article](https://medium.com/@ibm_ptc_security/saml-security-fundamentals-and-penetration-testing-892145dde398).

### Vulnerabilities
- SSRF via SAML
- XXE via SAML
- XLST via SAML
- Signature Validation
- XML via SAML (SP)
- Certificate Faking

### Extension
SAML Radar