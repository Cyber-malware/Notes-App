
[WordPress](https://wordpress.org/) is the most popular open source Content Management System (CMS), powering nearly one-third of all websites in the world. It can be used for multiple purposes, such as hosting blogs, forums, e-commerce, project management, document management, and much more.
## CMS:
A CMS is a powerful tool that helps build a website without the need to code everything from scratch (or even know how to write code at all).
A CMS is made up of two key components:

- A Content Management Application (CMA) - the interface used to add and manage content.
- A Content Delivery Application (CDA) - the backend that takes the input entered into the CMA and assembles the code into a working, visually appealing website.

WordPress requires a fully installed and configured LAMP stack (Linux operating system, Apache HTTP Server, MySQL database, and the PHP programming language) before installation on a Linux host. All directories in webroot located at `/var/www/html`.

```shell-session
malware9211@htb[/htb]$ tree -L 1 /var/www/html
.
├── index.php
├── license.txt
├── readme.html
├── wp-activate.php
├── wp-admin
├── wp-blog-header.php
├── wp-comments-post.php
├── wp-config.php
├── wp-config-sample.php
├── wp-content
├── wp-cron.php
├── wp-includes
├── wp-links-opml.php
├── wp-load.php
├── wp-login.php
├── wp-mail.php
├── wp-settings.php
├── wp-signup.php
├── wp-trackback.php
└── xmlrpc.php
```

- `index.php` is the homepage of WordPress.
- `license.txt` contains useful information such as the version WordPress installed.
- `wp-activate.php` is used for the email activation process when setting up a new WordPress site.
- `wp-admin` folder contains the login page for administrator access and the backend dashboard. it can b located at
    - `/wp-admin/login.php`
    - `/wp-admin/wp-login.php`
    - `/login.php`
    - `/wp-login.php`

- `xmlrpc.php` is a file representing a feature of WordPress that enables data to be transmitted with HTTP acting as the transport mechanism and XML as the encoding mechanism. This type of communication has been replaced by the WordPress [REST API](https://developer.wordpress.org/rest-api/reference)
- The `wp-config.php` file contains information required by WordPress to connect to database, such as database name, database host and can also be used for Debug mode.

```php
<?php
/** <SNIP> */
/** The name of the database for WordPress */
define( 'DB_NAME', 'database_name_here' );

/** MySQL database username */
define( 'DB_USER', 'username_here' );

/** MySQL database password */
define( 'DB_PASSWORD', 'password_here' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Authentication Unique Keys and Salts */
/* <SNIP> */
define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );

/** WordPress Database Table prefix */
$table_prefix = 'wp_';

/** For developers: WordPress debugging mode. */
/** <SNIP> */
define( 'WP_DEBUG', false );

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
```

- The `wp-content` folder is the main directory where plugins and themes are stored. The subdirectory `uploads/` is usually where any files uploaded to the platform are stored. Issue in this directory can lead to RCE.

```shell-session
malware9211@htb[/htb]$ tree -L 1 /var/www/html/wp-content
.
├── index.php
├── plugins
└── themes
```

- `wp-includes` contains everything except for the administrative components and the themes that belong to the website. Cert, font and js files stored here.

```shell-session
malware9211@htb[/htb]$ tree -L 1 /var/www/html/wp-includes
.
├── <SNIP>
├── theme.php
├── update.php
├── user.php
├── vars.php
├── version.php
├── widgets
├── widgets.php
├── wlwmanifest.xml
├── wp-db.php
└── wp-diff.php
```

# User Roles
Five types of user roles in wordpress. Author and editor might have some access then user.

|Role|Description|
|---|---|
|Administrator|This user has access to administrative features within the website. This includes adding and deleting users and posts, as well as editing source code.|
|Editor|An editor can publish and manage posts, including the posts of other users.|
|Author|Authors can publish and manage their own posts.|
|Contributor|These users can write and manage their own posts but cannot publish them.|
|Subscriber|These are normal users who can browse posts and edit their profiles.|
