The WordPress admin console will usually prompt us when plugins or themes need to be updated or when WordPress itself requires an upgrade. We can even modify the `wp-config.php` file to enable automatic updates by inserting the lines.

```php
define( 'WP_AUTO_UPDATE_CORE', true );

add_filter( 'auto_update_plugin', '__return_true' );

add_filter( 'auto_update_theme', '__return_true' );
```

Only install trusted themes and plugins from the WordPress.org website. Before installing a plugin or theme, check its reviews, popularity, number of installs, and last update date.Routinely audit your WordPress site and remove any unused themes and plugins

Several WordPress security plugins can be used to enhance the website's security. These plugins can be used as a Web Application Firewall (WAF).

-  [Sucuri Security](https://wordpress.org/plugins/sucuri-scanner/) : Activity audit, file integrity check, malware scan, blacklist monitor.
-  [iThemes Security](https://wordpress.org/plugins/better-wp-security/): 2FA, salts/keys, reCAPTCHA, user logging, 30+ protections.
-  [Wordfence Security](https://wordpress.org/plugins/wordfence/):  Firewall & scanner, blocks malicious traffic, premium offers real-time updates & IP blacklisting.

- **User Management:**
    - Disable default admin, use unique usernames
    - Enforce strong passwords & 2FA
    - Apply least privilege, audit users, remove unused accounts
    
- **Configuration Management:**
    - Block user enumeration
    - Limit login attempts
    - Rename/relocate wp-login.php, restrict access by IP

