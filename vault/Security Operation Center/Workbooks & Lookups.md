If some one login to account so how to validate that user is legitimate or not who login it.

### Identity Inventory
![[Pasted image 20260130150830.png]]

|Solution|Examples|Description|
|---|---|---|
|Active Directory|On-prem AD, Entra ID|AD itself is an identity database, and it is commonly used by SOC|
|SSO Providers|Okta, Google Workspace|Cloud alternative for AD, an easy way to manage and search the users|
|HR Systems|BambooHR, SAP, HiBob|Limited to employees only, but usually provides full employee data|
|Custom Solution|CSV or Excel Sheets|It is common for IT or security teams to maintain their own solutions|
### Asset Inventory
Asset (software or employees) inventory  also called asset lookup, is a list of all computing resources within an organisation's IT environment.

|   |   |   |
|---|---|---|
|Active Directory|On-prem AD, Entra ID|AD is not only an identity but also a solid asset inventory database|
|SIEM or EDR|Elastic, CrowdStrike|Some SIEM or EDR agents collect information about the monitored hosts|
|MDM Solution|MS Intune, Jamf MDM|A dedicated class of solutions created to list and manage assets|
|Custom Solution|CSV or Excel Sheets|Same as with the identity inventory, custom solutions are common|
### Network Diagram 

`Ip` from external try to connect through `vpn` and try to scan  the network.
![[Pasted image 20260130151449.png]]

### ## SOC Workbooks
`SOC workbook` also called playbook or workflow that defines the steps required to investigate and remediate specific threats efficiently and consistently. Senior analysts often prepare workbooks to support their less experienced teammates.

![[Pasted image 20260130151719.png]]



### Metrics and Objectives
You need to be worried if `TP` or `FP` are too much.

|Metric|Formula|Measures|
|---|---|---|
|Alerts Count|`AC = Total Count of Alerts Received`|Overall load of SOC analysts|
|False Positive Rate|`FPR = False Positives / Total Alerts`|Level of noise in the alerts|
|Alert Escalation Rate|`AER = Escalated Alerts / Total Alerts`|Experience of L1 analysts|
|Threat Detection Rate|`TDR = Detected Threats / Total Threats`|Reliability of the SOC team|

![[Pasted image 20260130160922.png]]

Note that different teams might have different definitions or formulas for the SOC metrics, depending on what they want to measure.

|Metric|Common SLA|Description|
|---|---|---|
|SOC Team Availability|24/7|Working schedule of the SOC team, often Monday-Friday (8/5) or 24/7 mode|
|Mean Time to Detect (MTTD)|5 minutes|Average time between the attack and its detection by SOC tools|
|Mean Time to Acknowledge (MTTA)|10 minutes|Average time for L1 analysts to start triage of the new alert|
|Mean Time to Respond (MTTR)|60 minutes|Average time taken by SOC to actually stop the breach from spreading|

The metrics are often used to evaluate your performance, and good results lead to career growth.
![[Pasted image 20260130161415.png]]


|Issue|Recommendations|
|---|---|
|False Positive Rate  <br>over 80%|**Your team receives too much noise in the alerts. Try to:**  <br>  <br>1. Exclude trusted activities like system updates from your EDR or SIEM detection rules  <br>2. Consider automating alert triage for most common alerts using SOAR or custom scripts|
|Mean Time to Detect  <br>over 30 min|**Your team detects a threat with a high delay. Try to:**  <br>  <br>1. Contact SOC engineers to make the detection rules run faster or with a higher rate  <br>2. Check if SIEM logs are collected in real-time, without a 10-minute delay|
|Mean Time to Acknowledge  <br>over 30 min|**L1 analysts start alert triage with a high delay. Try to:**  <br>  <br>1. Ensure the analysts are notified in real-time when a new alert appears  <br>2. Try to evenly distribute alerts in the queue between the analysts on shift|
|Mean Time to Respond  <br>over 4 hours|**SOC team can't stop the breach in time. Try to:**  <br>  <br>1. As L1, make everything possible to quickly escalate the threats to L2  <br>2. Ensure your team has documented what to do during different attack scenarios|

