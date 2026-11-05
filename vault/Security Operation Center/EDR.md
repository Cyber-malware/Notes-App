Endpoint detection and response `EDR` is a series of tools that monitor devices for activity that could indicate a threat.

`EDR` is a security solution that offers deep-level protection for endpoints. No matter where the endpoints are, the `EDR` will make sure they are monitored constantly and threats are detected.
![[Pasted image 20260131101153.png]]


## Visibility 
Visibility is one of the features of **EDR** that makes it unique from other endpoint security solutions. It collects detailed data from the endpoints, which includes process modifications, registry modifications, file and folder modifications, user actions, and much more. Any detections in the EDR land with a whole context.

|   |   |   |   |   |
|---|---|---|---|---|
|Process Modifications|Registry Modifications|File And Folder Modifications|User Actions|And Much More|

Screenshot shows graphical representation of a process tree. We can see which processes were spawned on the endpoint. Each node represents a process. The lines connecting them represents their relationship.
![[Pasted image 20260131110249.png]]

## Detection 
The detection feature of `EDR` wins over traditional detection capabilities. It incorporates signature-based `detections` as well as behavior-based `detections`. With modern machine learning capabilities, it identifies any deviation from the baseline behavior and instantly flags it. It can also detect `fileless` malware that resides in memory. It also allows us to feed custom `IOCs` for threat `detections`.
![[Pasted image 20260131110445.png]]

## Response 
`EDR` also empowers analysts to take action on detected threats. These actions can be taken at any endpoint within the central `EDR` console. Imagine getting a detection on the EDR with full-fledged details on when, where, and what happened, and you have to opt for the best possible action for that detection. As an analyst, you may decide to isolate a complete endpoint, terminate a process, or quarantine some files.

![CrowdStrike Falcon EDR's RTR (Real Time Response) console.](https://tryhackme-images.s3.amazonaws.com/user-uploads/6645aa8c024f7893371eb7ac/room-content/6645aa8c024f7893371eb7ac-1755242797142.png)

#### Antivirus vs EDR:
`Antivirus` detects known threats using signature-based detection. It provides basic protection against common malware. It has limited visibility and response capabilities.

`EDR` monitors endpoint behavior continuously in real time. It detects advanced and unknown threats using behavioral analysis. It provides deep visibility and active incident response.

The Antivirus (AV) may detect some basic threats, but to detect advanced threats that evade normal `detections`, we need an `EDR`. Unlike antivirus software's basic signature-based detection, it monitors and records the behaviors of the endpoint. An `EDR` also provides organization-wide visibility of any activity. For example, if a suspicious file is detected on one endpoint, the `EDR` will also check it across all the other endpoints.
![[Pasted image 20260131111020.png]]

|   |   |   |
|---|---|---|
|**Attack Steps**|**AV's Response**|**EDR's Response**|
|Step #1|Does nothing if the downloaded file has no previous signature in the database|Logs the file download activity and monitors it|
|Step #2|Does nothing upon the opening of the document since winword.exe is a legitimate utility|Records the execution of winword.exe and keeps monitoring|
|Step #3|Does nothing if the executed macro has no previous signature|Detects and flags the macro execution due to the unusual parent-child relationship of winword.exe and PowerShell.exe processes|
|Step #4|Typically, AVs will not detect obfuscated PowerShell scripts|Flags the obfuscated script execution|
|Step #5|Will not flag malicious injection into svchost.exe since it does not monitor the memory injections|Detects Process Injection in svchost.exe|
|Step #6|Lacks Network Level Visibility|Flags the unexpected behaviour of svchost.exe, making an outbound connection|
|Final Action|May be marked as clean|Generates an alert with the full attack chain and enables the analyst to take actions from within the EDR|


## How EDR work

![[Pasted image 20260131111737.png]]

### Agents

We can integrate multiple endpoints with our EDR and manage them through a centralized console. There are EDR agents that we have to deploy inside those endpoints. They are the eyes and ears of the EDR and their job is to monitor all the activities on endpoint.The EDR agents can do some basic `signature-based` and `behavior-based detections` by themselves and send them to the EDR console, which triggers alerts.
### EDR Console
All detailed sent by EDR agents is correlated and analyzed through complex logic and machine learning algorithms. The threat intelligence information is matched with the collected data. The EDR is just like the brain connecting all the dots. These dots connect to form a detection, often called an alert.
![[Pasted image 20260131111727.png]]

### Telemetry
Telemetry is the black box of an endpoint with everything necessary for detection and investigation. Let's take a brief look at some of the telemetry that it collects:

`Process Executions and Terminations`
    It keeps track of all the running and idle processes which helps to identify suspicious child-parent process relationships, suspicious `executables` initiating a process, malware payload.
`Network Connections`
    All the endpoints network connections are monitored, which helps identify any connection to a `C2 server`, unusual port usage, data `exfiltration`, or lateral movement within the network.Command Line Activity
    It captures all the commands executed on the endpoints in `CMD`, `PowerShell`, etc., which helps to identify malicious command execution, obfuscated PowerShell script executions.
`Files and Folders Modifications ` 
    Threat actors modify different files and folders during data staging, ransomware executions, and malicious file dropping. The EDR tracks this.
`Registry Modifications`
    The registry is a goldmine of information about the configurations in a Windows system. There are many registry modifications that occur during a malicious activity, and most of these are monitored by the EDR.

## Detection Capabilities

`Behavioral Detection ` 
    Instead of just matching the signatures with known threats, it observes the complete behavior of a file. Advanced threats craft their malware to look clean and use legitimate processes to carry out their attack. EDR catches this behavior.  
`Anomaly Detection  `
    With time, EDR understands the baseline behavior of the endpoints. Any activity that deviates from this behavior will be flagged. During any malicious activity, the endpoint's behavior deviates from normal. EDR picks it up. Sometimes, this can generate false positives as well.
`IOC matching`  
    `EDRs` have some strong threat intelligence field integrations. Except for zero-day attacks, most of the attacks have indicators published in the threat intelligence feeds. EDR flags any activity that matches any known `IOC`.
`MITRE ATT&CK Mapping `
    Any activity flagged by the EDR is not only marked as malicious or suspicious but also mapped with the `MITRE` Tactic and Technique (attack stage) that the particular activity was on. This proves to be very helpful for the analysts.  

##### Machine Learning Algorithms
Advanced threat actors try to evade defenses and their activities may sometimes bypass advanced detection techniques. Modern `EDRs` have machine learning models trained by a large dataset of normal and malicious behaviors. This can detect complex patterns of an attack.  

## Response
The next step after any detection is the response. EDR offers both automated and manual responses. You can make policies to block known malicious behaviors automatically.
`Isolate Host`
    During any malicious activity on an endpoint, you can isolate that endpoint from the network through EDR. This is a very effective function for containing malicious activity. Isolating the infected endpoint on time can stop this from happening.
`Terminate Process`
    Not every malicious activity requires host isolation. Some hosts run the core business operations, and isolating them can cause more loss than the malicious activity. In such cases, terminating a process is enough to neutralize the malicious activity.
`Quarantin  `
    If a malicious file comes into the endpoint, it can be quarantined. Quarantine ensures that the file is moved to an isolated location where it can not be executed. The analysts can then review the file to restore or permanently remove it. 
`Remote Access `
    Analysts can also remotely access the shell of any endpoint. Through remote access, analysts can gain deeper visibility into the system or take custom actions within the endpoints. The analysts can also run scripts or collect their desired data from the host through remote access.  
![[Pasted image 20260131120454.png]]
##### Artefacts Collection 
Sometimes, the analysts may need to extract some data from the endpoints for detailed forensic investigation or reporting for legal actions. Analysts can extract important `artefacts` from the endpoints without physically accessing the device.
- Memory Dump
- Event Logs
- Specific Folder Contents
 - Registry Hives

