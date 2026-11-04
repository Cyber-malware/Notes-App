
#### Host-Centric Log Sources
These log sources capture events that occurred within or related to the host. Devices that generate `host-centric` logs include Windows, Linux, servers, etc.
#### Network-Centric Log Sources
Network-related logs are generated when the hosts communicate with each other or access the internet to visit a website. Devices that generate network-centric logs are firewalls, `IDS/IPS`, routers, etc.
![[Pasted image 20260131124319.png]]

### SEIM Featues

#### Centralized Log Collection  
`SIEM` gathers logs from all sources such as endpoints, servers, and firewalls, and stores them in a single location. Logs are collected via lightweight agents or APIs. This eliminates the need to access each machine individually for analysis.
#### Normalization of Logs  
Logs from different sources have varying formats and sizes. SIEM standardizes these logs by breaking them into fields (Parsing) and converting them into a consistent format (Normalization). This makes the logs easier to read and analyze.
#### Correlation of Logs  
Single logs are often not meaningful. `SIEM` correlates logs from different sources to find patterns that indicate malicious activity. such as logging in via `VPN` from a new IP, accessing shared documents, executing a script, and making outbound connections can together indicate a potential compromise.
#### Real-time Alerting  
SIEM monitors logs based on predefined and custom rules. When a rule condition is met, it triggers an alert. Analysts are notified and can investigate directly within the SIEM platform, allowing rapid response to threats.
#### Dashboards and Reporting  
Dashboards summarize normalized log data and present actionable insights. SIEM provides default dashboards and allows custom dashboards. Information displayed can include alert highlights, system notifications, health alerts, failed login attempts, event counts, triggered rules, and top visited domains.
![[Pasted image 20260131124738.png]]

## Log Sources

#### Windows Machine
Windows records every event that can be viewed through the Event Viewer. It assigns a unique ID to each type of log activity, making it easy for the analyst to examine and keep track of. To view events in a Windows environment, type `Event Viewer` in the search bar.
![[Pasted image 20260131124959.png]]

#### Linux Machine
Linux OS stores all the related logs, such as events, errors, warnings, etc. These are then ingested into SIEM for continuous monitoring.

- `/var/log/httpd`: Contains `HTTP` Request  / Response and error logs.
- `/var/log/apache`: locations to all `apache` related logs
- `/var/log/cron`: Events related to `cron` jobs are stored in this location.
- `/var/log/auth.log` and /`var/log/secure`: Stores authentication related logs.
- `/var/log/kern`: This file stores `kernel` related events.

### Log Ingestion
All these logs provide a wealth of information and can help identify security issues. Each SIEM solution has its own way of ingesting the logs. Some common methods used by these SIEM.

1. Agent / Forwarder  
    These SIEM solutions provide a `lightweight` tool called an agent (forwarder by Splunk) that gets installed on the Endpoint. It is configured to capture and send all the important `logs` to the SIEM server.
2. **Syslog**  
    `Syslog` is a widely used protocol to collect data from various systems like `web servers`, databases, etc., and send real-time data to the centralized destination.
3. **Manual Upload**  
    Some SIEM solutions, like Splunk, ELK, etc., allow users to `ingest` offline data for quick analysis. Once the data is ingested, it is `normalized` and made available for analysis.
4. **Port-Forwarding**  
    SIEM solutions can also be configured to listen on a certain `port`, and then the endpoints forward the data to the `SIEM` instance on the listening port.
    
![[Pasted image 20260131125719.png]]

# Splunk
Splunk is one of the leading SIEM solutions in the market. It allows users to collect, analyze, and correlate network and machine logs in real time. Splunk have `3` main components that help to search and analyze the data.
![[Pasted image 20260131155118.png]]

### Splunk Forwarder
Splunk Forwarder is a lightweight agent installed on the endpoint intended to be monitored, and its main task is to collect the data and send it to the Splunk instance. It does not affect the endpoint's performance as it takes a few resources to process.
![[Pasted image 20260131155332.png]]

### Splunk Indexer
Splunk Indexer plays the main role in processing the data it receives from forwarders. It parses and normalizes the data into field-value pairs, categorizes it, and stores the results as events, making the processed data easy to search and analyze.
![[Pasted image 20260131155509.png]]

### Search Head
Splunk Search Head is the place within the **Search & Reporting App** where users can search the indexed logs, as shown below. The searches are done using the **SPL** (Search Processing Language), a powerful query language for searching indexed data. When the user performs a search, the request is sent to the indexer, and the relevant events are returned as field-value pairs.
![[Pasted image 20260131155709.png]]

The Search Head also allows you to transform results into presentable tables and visualizations such as pie, bar, and column charts.
![[Pasted image 20260131155729.png]]

When you access Splunk, you will see the default home screen.
![[Pasted image 20260131155905.png]]

