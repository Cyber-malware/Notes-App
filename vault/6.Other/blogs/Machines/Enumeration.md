
We have target site  name

so we first check is it built on wordpress.
```bash
      
┌──(kali㉿kali)-[~/Tools/Aqutoane]
└─$ curl -s http://blog.inlanefreight.local/ | grep wordpress
</ul></div></div></div><div id="block-4" class="widget widget_block"><div class="wp-block-group"><div class="wp-block-group__inner-container"><h2>Recent Comments</h2><ol class="wp-block-latest-comments"><li class="wp-block-latest-comments__comment"><article><footer class="wp-block-latest-comments__comment-meta"><a class="wp-block-latest-comments__comment-author" href="https://wordpress.org/">A WordPress Commenter</a> on <a class="wp-block-latest-comments__comment-link" href="http://blog.inlanefreight.local/?p=1#comment-1">Shipping Industry News</a></footer></article></li></ol></div></div></div><div id="block-5" class="widget widget_block"><div class="wp-block-group"><div class="wp-block-group__inner-container"><h2>Archives</h2><ul class=" wp-block-archives-list wp-block-archives">   <li><a href='http://blog.inlanefreight.local/?m=202108'>August 2021</a></li>
        
```

Then we will check for themes that its being used.
```bash

──(kali㉿kali)-[~/Tools/Aqutoane]
└─$ curl -s http://blog.inlanefreight.local/ | grep themes   
<link rel='stylesheet' id='bootstrap-css'  href='http://blog.inlanefreight.local/wp-content/themes/business-gravity/assets/vendors/bootstrap/css/bootstrap.min.css' type='text/css' media='all' />
<link rel='stylesheet' id='kfi-icons-css'  href='http://blog.inlanefreight.local/wp-content/themes/business-gravity/assets/vendors/kf-icons/css/style.css' type='text/css' media='all' />
<link rel='stylesheet' id='owlcarousel-css'  href='http://blog.inlanefreight.local/wp-content/themes/business-gravity/assets/vendors/OwlCarousel2-2.2.1/assets/owl.carousel.min.css' type='text/css' media='all' />

```

As we can see this site using Business-gravity theme. so next we will enumerate for plugin.

```bash

┌──(kali㉿kali)-[~/Tools/Aqutoane]
└─$ curl -s http://blog.inlanefreight.local/ | grep plugins  
<link rel='stylesheet' id='contact-form-7-css'  href='http://blog.inlanefreight.local/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.4.2' type='text/css' media='all' />
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/subscriber.js?ver=5.8' id='subscriber-js-js'></script>
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/jquery.validationEngine-en.js?ver=5.8' id='validation-engine-en-js'></script>
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/jquery.validationEngine.js?ver=5.8' id='validation-engine-js'></script>
                <link rel='stylesheet' id='mm_frontend-css'  href='http://blog.inlanefreight.local/wp-content/plugins/mail-masta/lib/css/mm_frontend.css?ver=5.8' type='text/css' media='all' />
<script type='text/javascript' src='http://blog.inlanefreight.local/wp-content/plugins/contact-form-7/includes/js/index.js?ver=5.4.2' id='contact-form-7-js'></script>
       
```

This site using mail-masta contact form-7 plugin.After this we enumerate `p=1`endpoint and we find another plugin name wpdiscuz.
```bash

┌──(kali㉿kali)-[~/Tools/Aqutoane]
└─$ curl -s http://blog.inlanefreight.local/?p=1 | grep plugins
<link rel='stylesheet' id='contact-form-7-css'  href='http://blog.inlanefreight.local/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.4.2' type='text/css' media='all' />
<link rel='stylesheet' id='wpdiscuz-frontend-css-css'  href='http://blog.inlanefreight.local/wp-content/plugins/wpdiscuz/themes/default/style.css?ver=7.0.4' type='text/css' media='all' />
<link rel='stylesheet' id='wpdiscuz-fa-css'  href='http://blog.inlanefreight.local/wp-content/plugins/wpdiscuz/assets/third-party/font-awesome-5.13.0/css/fa.min.css?ver=7.0.4' type='text/css' media='all' />

```

so quick findings 
WordPress version that being installed is 5.8
Plugin mail-masta v1.0.0 vulnerable to file inclusion vuln
Plugin contact-form-7 v5.4.2 vulnerable to Prev-Esclation vuln
Plugin wpdiscuz v7.0.4 vulnerable to admin store cookie and lot others.