In the skills assessment, you are in the role of a junior incident responder and need to perform some tasks.

Let's navigate to the bottom of this section and click on "`Click here to spawn the target system!`". Then, let's open TheHive webpage on "Target IP:9000" on port 9000 using the provided credentials to view the alerts.

## Triage the alerts

TheHive is loaded with alerts related to the Insights Nexus breach. You are requested to triage them, starting with:

- Task 1: Create a new case in TheHive. Find all the alerts that are specific to the Insights Nexus breach scenario, and link the alerts in the case. This exercise introduces you to work in TheHive alerts and cases.  
    
- Task 2: Perform triage, enrichment, and correlation in TheHive. In the notes of an alert, you can add useful information for enrichment.  
    
- Task 3: One of the alerts related to Insights Nexus in TheHive contains some information in the notes. The netstat command output shows some connectivity to external IP addresses. You can validate this finding.

![TheHive case interface showing a “Comments” panel with a pasted netstat -ano snippet from host 10.10.5.23. Entries include TCP 127.0.0.1:5357 LISTENING, TCP 10.10.5.23:139 LISTENING, outbound TCP 10.10.5.23:52344 → 198.5.x.x:443 ESTABLISHED, 10.10.5.23:52345 → 203.0.x.x:4444 ESTABLISHED, UDP 10.10.5.23:123 listening, and SMB connections to 10.10.5.17:445 and 10.10.5.18:445 (ESTABLISHED/TIME_WAIT). Top bar shows controls (Create Case, language EN-UK, user HTB-ANALYST).](https://academy.hackthebox.com/storage/modules/148/ir-netstat.png)

This output was captured after the host machine rejoined the domain following recovery. However, it is still connecting to an IP address. The analyst added this in the comments of the alert.

There are some further questions asked at bottom of this section.

## Mapping to the Cyber Kill Chain

A user opens an attachment, which executes a downloader that writes an .exe file to `%AppData%`, creates a `Run` registry key, and later loads `VaultCli.dll` via a suspicious tool, exfiltrating credentials to an external IP. Your task is to map each step of the attack to the kill chain phase.

- Task 1: Map the file download, registry, and exfiltration activity to MITRE ATT&CK.
- Task 2: Check the alert related to Mimikatz in TheHive and identify the MITRE Technique ID.

## Investigate the collected logs

- Task 1: Additionally, you are provided with some event log files (i.e., `logs-wazuh.zip`). One of the tasks is to decode some PowerShell commands and extract IOCs from them.
- Task 2: Identify the user who executed the suspicious PowerShell command.

## OVPN

Download your files and connect within your own environment

View VPN

## LINUX PWNBOX

A complete ready hacking web-based Parrot Linux instance.

View Linux Pwnbox

## WINDOWS PWNBOX beta

A complete ready hacking web-based Windows instance.

View Windows Pwnbox

Linux Pwnbox

Online

Pwnbox settings

## Questions

Answer the question(s) below to complete the section

TARGET

Click Spawn Target to get Target IP

Spawn Target

Authenticate to target with username "htb-analyst" and password "P3n#31337@LOG"

Open the alert "[InsightNexus] Admin Login via ManageEngine Web Console." Find the foreign IP address starting with "203" in the comments. Check VirusTotal for the information related to this IP address, and add the details as a comment in this alert. In VirusTotal, what is the name of the file starting with "Mango" in the Files Referring section?

Submit task answer

Authenticate to target with username "htb-analyst" and password "P3n#31337@LOG"

In VirusTotal, go to the details of the IP address starting with "198." What is the name of the city shown in the Whois Lookup?

Submit task answer

If malware downloads files from a C2 (Command and Control) server into the victim network, under what MITRE technique ID does this tool transfer technique fall? Type it as your answer. The format is T1***.

Submit task answer

Authenticate to target with username "htb-analyst" and password "P3n#31337@LOG"

Open TheHive and check the rule ID 92153 related to the VaultCli.dll module. What is the MITRE technique ID for this activity? The format is T1***.

Submit task answer

Download the "logs-wazuh.zip" file from resources, and identify the suspicious PowerShell command in the logs. Type the suspicious IP address after decoding the command.

Submit task answer

This question requires to download [files](https://cdn.services-k8s.prod.aws.htb.systems/content/questions/file/463813a4-e168-4d70-85db-b9492761b04c.zip)

Show Hint

In the same file (i.e., logs-wazuh.zip), identify the user who executed the suspicious PowerShell command. The format is domain\user.

Submit task answer

This question requires to download [files](https://cdn.services-k8s.prod.aws.htb.systems/content/questions/file/5bb680dd-f063-4284-ae0f-9e4291484dd5.zip)