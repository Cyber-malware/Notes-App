Elastic Stack (ELK) was originally developed to store, search, and visualize large amounts of data. Organizations used it to monitor application performance and perform searches on large datasets.

![[Pasted image 20260131193527.png]]

#### Elasticsearch
The first component, Elasticsearch, is a full-text search and analytics engine for `JSON`-formatted documents. It stores, analyzes, and correlates data and supports a `RESTful` API for interacting with it.

#### Logstash
`Logstash` is a data processing engine that takes data from different sources, filters it, or normalizes it, and then sends it to the destination, which could be Kibana or a listening port. A Logstash configuration file is divided into three parts.

1. The **Input** part is where the user defines the source from which the data is being ingested.
2. The **Filter** part is where the user specifies the filter options to normalize the log ingested above. 
3. The **Output** part is where the user wants the filtered data to be sent. It can be a listening port, Kibana Interface, Elasticsearch database, or file.
![[Pasted image 20260131204813.png]]
#### Beats
Beats are host-based agents known as data-shippers that ship/transfer data from the endpoints to Elasticsearch. Each beat is a single-purpose agent that sends specific data to Elasticsearch
![[Pasted image 20260131204901.png]]
#### Kibana
Kibana is a web-based data visualization tool that works with Elasticsearch to analyze, investigate, and visualize data streams in real time. It allows users to create multiple visualizations and dashboards for better visibility.

- **Beats** collect data from multiple agents. For example, `Winlogbeat` collects Windows event logs, and `Packetbeat` collects network traffic flows.
- **Logstash** collects data from beats, ports, or files, parses/normalizes it into field value pairs, and stores them into Elasticsearch.
- **Elasticsearch** acts as a database used to search and analyze data.
- **Kibana** is responsible for displaying and visualizing the data stored in Elasticsearch. The data stored in Elasticsearch can easily be shaped into different visualizations, time charts, `infographics`, etc., using Kibana.
![[Pasted image 20260131211327.png]]


![[Pasted image 20260131214908.png]]

Let's briefly see what each element (as highlighted in the above screenshot) of the Discover tab does: 
```
Logs  
    Each row shows a single log containing information about the event, along with the fields and values found in that log.
    
Fields Pane  
    The left panel of the interface shows the list of fields parsed from the logs. We can click on any field to add it to the filter or remove it from the search.
    
Index Pattern  
    Each type of log is stored in a different index pattern. We can select the index pattern from which we need the logs. For example, for VPN logs, we would need to select the index pattern in which VPN logs are stored.
    
Search Bar  
    It is a place where the user adds search queries and applies filters to narrow down the results. In the next task, we will learn how to perform searches through queries.
    
Time Filter  
    We can narrow down results based on any specific time duration. 
    
Time Interval  
    This chart shows the event counts over time.
    
TOP Bar  
    This bar contains various options to save the search, open the saved searches, share or save the search, etc.
    
Discover Tab  
    This is the main workspace in Kibana for exploring, searching, and analyzing raw data.
    
Add Filter  
    We can apply filters to specific fields to narrow down results, rather than manually typing entire queries.
```
### KQL Overview
`KQL Kibana Query Language` is a search query language used to search the ingested logs/documents in Elasticsearch. With KQL, we can search for the logs in two different ways.
- Free text search
- Field-based search

### Free text Search
Free text search allows users to search for logs based on text only. That means a simple search of the term `security` will return all the documents that contain this term, irrespective of the field.
![[Pasted image 20260131221000.png]]

### Logical Operators (AND | OR | NOT)
You can also use `AND`, `OR` and `NOT` operator while searching in logs.
![[Pasted image 20260131221233.png]]

### Field-based search
In the Field-based search, we will provide the field name and the value we are looking for in the logs. This search has a special syntax as `Field: Value`.
![[Pasted image 20260131221302.png]]

The visualization tab allows us to visualize the data in different forms such as tables, pie charts, bar charts, etc.  There are differenet methods to create visuilization. 
![[Pasted image 20260131222009.png]]

#### Correlation Option
Often, we require creating correlations between multiple fields. Dragging the required field in the middle will create a correlation tab in the visualization tab. Here, we selected the `Source_Country` as the second field to show a correlation among the client `Source_IP`.
![[Pasted image 20260131221819.png]]

We can also create a table to show the values of the selected fields as columns, as shown below.
![[Pasted image 20260131222025.png]]

The most important step in creating these visualizations is saving them. To do so, click on the save Option on the right side and fill in the descriptive values below.
![[Pasted image 20260131222040.png]]

Steps to take after creating Visualizations:
- Create a visualization and click the Save button at the top right corner.
- Add the title and description to the visualization.
- Click Save and add to the library when it's done.
- 