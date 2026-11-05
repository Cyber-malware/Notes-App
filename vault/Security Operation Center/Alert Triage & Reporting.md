The system, like your OS, a firewall, or a cloud provider must log the event. After that, all system logs must be shipped to a security solution like `SIEM` or `EDR`.

### Alert Management Platforms

| Solution         | Examples                      | Description                                                                               |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| SIEM  <br>System | Splunk ES,   <br>Elastic      | SIEM have solid alert management capabilities and are a perfect choice for most SOC teams |
| EDR or  <br>NDR  | MS Defender,  <br>CrowdStrike | While EDR and NDR provide their own alert dashboards, it is preferred to use SIEM or SOAR |
| SOAR  <br>System | Splunk SOAR,  <br>Cortex SOAR | Bigger SOC teams can use SOAR to aggregate and centralise alerts from multiple solutions  |
| ITSM  <br>System | Jira,  <br>TheHive            | Some teams may have a custom ticket management (ITSM) setup using a dedicated solution    |

Alert generally have a few properties. 
Alert `time`, alert `name`, alert `severity`, alert `status`(someone working or not), alert `verdict`(alert classification like true or not), alert `assignee`(analyst assign to view alert), alert `description` and alert `fields` (comment or values on which alert trigger.)

Alert review by SOC analysts can also be called alert triage, alert handling, alert processing, alert investigation, or alert analysis.

![[Pasted image 20260125182420.png]]

### ALert Funnel
Most of alerts false positive or solve at `Level-1` but complex and threatening are sent to `Level-2`. 
![[Pasted image 20260130115008.png]]

Before closing or passing to alert `Level-2` you might have to report it. Instead of alert comment you might required to document you investigation specially done for `True Positive.

|   |   |
|---|---|
|**Alert Report Purpose**|**Explanation**|
|Provide context for escalation|- A well-written report saves lots of time for L2 analysts<br>- Also, it helps them quickly understand what happened|
|Save findings for the records|- Raw SIEM logs are stored for 3-12 months, but alerts are kept indefinitely<br>- As a result, it's better to keep all the context inside the alert, just in case|
|Improve investigation skills|- If you can't explain it simply, you don't understand it well enough<br>- Report writing is a great way to boost L1 skills by summarising alerts|
![[Pasted image 20260130120016.png]]

We recommend you to include `5ws` in your report.
- **Who**: Which user logs in, runs the command, or downloads the file
- **What**: What exact action or event sequence was performed
- **When**: When exactly did the suspicious activity start and ended
- **Where**: Which device, IP, or website was involved in the alert
- **Why**: The most important W, the reasoning for your final verdict

### Escalation Steps

![L1 escalates phishing alert to L2, and L2 rotates user's credentials](https://tryhackme-images.s3.amazonaws.com/user-uploads/678ecc92c80aa206339f0f23/room-content/678ecc92c80aa206339f0f23-1743520297119.svg)

Some time you may stuck what to do with alert so in that case you can get help from `Level 2`.
![L1 asks L2 to support with the investigation, L2 accepts and provides a knowledge sharing session](https://tryhackme-images.s3.amazonaws.com/user-uploads/678ecc92c80aa206339f0f23/room-content/678ecc92c80aa206339f0f23-1743520519371.svg)

If you have problem to reach out to `Level 2` so reach out to you manager.  
After a few days, you `realise` that you `misclassified` the alert and likely missed a malicious action. Immediately reach out to your `Level 2` explaining your concerns. 
![[Pasted image 20260130133037.png]]
