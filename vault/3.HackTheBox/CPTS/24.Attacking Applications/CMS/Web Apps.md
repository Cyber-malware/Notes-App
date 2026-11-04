
| **Application**  | **Description (Key Points)**                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **WordPress**    | Open-source PHP CMS, mainly for blogs/forums. Highly customizable & SEO-friendly. Prone to plugin/theme vulnerabilities. Uses Apache & MySQL. |
| **Drupal**       | Open-source PHP CMS. Supports MySQL/PostgreSQL/SQLite. Modular & flexible. Popular with developers.                                           |
| **Joomla**       | PHP-based CMS. Supports MySQL/PostgreSQL/SQLite. Used for blogs, forums, e-commerce. Highly customizable with extensions.                     |
| **Tomcat**       | Java-based open-source web server. Runs Java Servlets/JSP. Popular with Java frameworks (e.g., Spring).                                       |
| **Jenkins**      | Java-based automation server. Enables CI/CD. Runs in servlet containers like Tomcat. Known for some serious RCE vulnerabilities.              |
| **Splunk**       | Log analysis & visualization tool. Used in security monitoring. Not many major vulns; older versions had RCE & info disclosure issues.        |
| **PRTG Monitor** | Agentless network monitoring tool. Uses ICMP, SNMP, WMI, NetFlow. Auto-discovers devices. Written in Delphi.                                  |
| **osTicket**     | PHP-based support ticketing system. Manages tickets via web, email, or phone. Runs on Apache/IIS with MySQL.                                  |
| **GitLab**       | Open-source dev platform. Supports Git, CI/CD, issue tracking, etc. Written in Ruby on Rails, Go, Vue.js. Offers free & enterprise versions.  |

Add ip adress `/etc/hosts` file.
```bash
IP=10.129.42.195
printf "%s\t%s\n\n" "$IP" "app.inlanefreight.local dev.inlanefreight.local blog.inlanefreight.local" | sudo tee -a /etc/hosts
```

Using Eyewitness Tool
```bash
eyewitness --web -x nmap_scans.xml -d inlanefreight_eyewitness 
```

Installing Aqutone Tool
```bash
wget https://github.com/michenriksen/aquatone/releases/download/v1.7.0/aquatone_linux_amd64_1.7.0.zip
cat nmap_scans.xml| ./aquatone -nmap 
```

