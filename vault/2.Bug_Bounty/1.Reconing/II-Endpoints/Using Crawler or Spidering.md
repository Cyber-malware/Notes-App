Crawler and spidering are imp part they check every link on website and crawl every page.
Modern web App generate dynamic content so we need to use advance crawlers.

[Gospdier](https://github.com/jaeles-project/gospider) is so fanst and provide advance methods such as analyzing JavaScript files and finding AWS S3 buckets.
```bash
gospider -s https://paypal.com
```

It can crawl multiple sites at ones.
```bash
gospider -S domains.txt -o gospider-output -c 10
```

**Crawling with Active Session:**
Serveral pages require authentication for crawling so we can add php session id.
```bash
gospider -s http://demo-site.com/ --cookie "PHPSESSID=jhbjh6f995v1g1mf2ciop70q2l"
```

we can also use OWASP ZAP tool for crawling for GUI.

Using discord we can set up webhooks to post messages in a specific channel
whenever a relevant event occurs, such as discovery of a new subdomain or
a change on a web page.

On the Discord server, we will navigate to the **Integrations** page to create a new **webhook**. This will generate a unique webhook link.
![[Screenshot_2025-07-22_03-16-52 2.png]]

The following Python code demonstrates the entire process in action. The “target” parameter is used to specify the URL that needs to be crawled. Meanwhile, the “webhook” parameter is intended for providing Discord webhook links generated in the previous step.
```python
import subprocess
import requests
import sqlite3
import time
target = "http://demo-site.com"
def run_hakrawler(url):
command = f"echo {url} | hakrawler -u | egrep -v '(\. js|\.css|\.png|\.jpg|\.gif)' "
process = subprocess.Popen(command, shell=True,
stdout=subprocess.PIPE, stderr=subprocess.PIPE)
output, error = process.communicate()
line = output.decode('utf-8')
return line
def discord_notification(url):
webhook = "[YOUR_DISCORD_WEBHOOK_LINK]"
message = {"content": "New Endpoint Found: "+url}
requests.post(webhook, json=message)
def main():
conn = sqlite3.connect('hakrawler-out.db')
cursor = conn.cursor()
cursor.execute(" '
CREATE TABLE IF NOT EXISTS urls (
column_name TEXT
)
"')
sql = "INSERT INTO urls (column_name) VALUES (?)"
urls = run_hakrawler(target).splitlines()
for url in urls:
if target in url:
cursor.execute("SELECT * FROM urls WHERE column_
name = ?", (url,))
existing_data = cursor.fetchone()
if not existing_data:
		
cursor.execute(sql, (url,))
		
if counter != 1:
			discord_notification(url)
conn.commit()
conn.close()
counter = 0
while True:
counter = counter + 1
main()
time.sleep(24 * 60 * 60)
```

```Note
The discord_notification function sends a message to a specified
Discord webhook. Hence, when you receive the notification, You need to
replace your [discord webhook] with your actual Discord webhook URL.
Upon running this script, notifications will be sent in real time to the speci-
fied Discord channel whenever a new endpoint is discovered. The discovered
endpoints will also be saved in the SQLite database.
```
![[Screenshot_2025-07-22_03-16-52 3.png]]


