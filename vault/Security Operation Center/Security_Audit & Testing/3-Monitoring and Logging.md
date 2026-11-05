Monitoring plays a crucial role in upholding the reliability, availability, and performance of Amazon S3 and your AWS solutions. It's essential to gather monitoring data from all components of your AWS solution, facilitating easier debugging in case of a multi-point failure. AWS offers various tools to monitor your Amazon S3 resources and respond promptly to potential incidents.

## AWS CloudTrail Logs

CloudTrail keeps a log of activities performed by a user, role, or an AWS service in Amazon S3. By leveraging the data captured by CloudTrail, you can identify the specific request made to Amazon S3, the IP address associated with the request, the entity making the request, the timestamp of the request, and other pertinent details. For further details, you can refer to the guide on Logging Amazon S3 API calls using AWS CloudTrail.

Step-by-Step guide to enable CloudTrail logs for S3 buckets.

1.Navigate to CloudTrail > Trails page.

2.Click “Create trail”.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-monitoring-and-logging-1.png)

3.Provide a Name for Trail.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-monitoring-and-logging-2.png)

4.Choose log events.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-monitoring-and-logging-3.png)

5.Select Data Events as S3.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-monitoring-and-logging-4.png)

6.Review and Submit.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-monitoring-and-logging-5.png)

After these operations, users can able to see all logs in Event History tab on CloudTrail page.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-monitoring-and-logging-6.png)

#### Example log:

Code: json

```json
{

    "eventVersion": "1.09",

    "userIdentity": {

        "type": "AWSService",

        "invokedBy": "cloudtrail.amazonaws.com"

    },

    "eventTime": "2023-11-24T21:10:30Z",

    "eventSource": "s3.amazonaws.com",

    "eventName": "GetBucketAcl",

    "awsRegion": "us-east-1",

    "sourceIPAddress": "cloudtrail.amazonaws.com",

    "userAgent": "cloudtrail.amazonaws.com",

    "requestParameters": {

        "bucketName": "aws-cloudtrail-logs-030597212547-ee3b6b96",

        "Host": "aws-cloudtrail-logs-030597212547-ee3b6b96.s3.us-east-1.amazonaws.com",

        "acl": ""

    },

    "responseElements": null,

    "additionalEventData": {

        "SignatureVersion": "SigV4",

        "CipherSuite": "ECDHE-RSA-AES128-GCM-SHA256",

        "bytesTransferredIn": 0,

        "AuthenticationMethod": "AuthHeader",

        "x-amz-id-2": "2Mivhxr9bPOlPr3LcrKR9fWs40RBpXSPBSLw3eg4U0EorQhRwhyxpR3pryY8R5nwoOMEmyzFw3E=",

        "bytesTransferredOut": 556

    },

    "requestID": "N9GFJGNCSR303TPS",

    "eventID": "e081295a-87ce-40c0-9fbf-b689ef89a82d",

    "readOnly": true,

    "resources": [

        {

            "accountId": "03059721234",

            "type": "AWS::S3::Bucket",

            "ARN": "arn:aws:s3:::aws-cloudtrail-logs-030597212547-ee3b6b96"

        }

    ],

    "eventType": "AwsApiCall",

    "managementEvent": true,

    "recipientAccountId": "030597123456",

    "sharedEventID": "3b94bccd-d00e-47bb-9c57-fa6e3852e8b9",

    "eventCategory": "Management"

}
```

This log file example is an entry from AWS CloudTrail, a service that records API calls and related events for your AWS account. Let's break down the key components of this log entry:

#### 1. Event Information:

`eventVersion`: The version of the CloudTrail event.

`eventTime`: The timestamp when the event occurred.

`eventSource`: The AWS service that generated the event (in this case, S3).

`eventName`: The name of the API call or event (`GetBucketAcl` in this case).

`awsRegion`: The AWS region where the event occurred (`us-east-1` in this case).

#### 2. User Identity:

`userIdentity`: Indicates the identity that performed the action.

`type`: The type of identity (`AWSService`).

`invokedBy`: The AWS service that made the request (`cloudtrail.amazonaws.com`).

#### 3. Request Information:

`requestParameters`: Contains details about the request.

`bucketName`: The name of the S3 bucket involved.

`Host`: The host information.

`acl`: The Access Control List (ACL) associated with the bucket.

#### 4. Response Information:

`responseElements`: This field would contain information about the response to the request, but in this case, it's `null` (indicating no specific response).

#### 5. Additional Event Data:

Various additional details about the event, such as the signature version, cipher suite, bytes transferred, authentication method, etc.

#### 6. Resources:

`resources`: Information about the AWS resources that are part of the event.

`accountId`: The AWS account ID.

`type`: The type of AWS resource (`AWS::S3::Bucket`).

`ARN`: The Amazon Resource Name of the S3 bucket.

`7. Event Type` :

`eventType`: The type of CloudTrail event (`AwsApiCall`).

`managementEvent`: Indicates whether the event is a management event.

`readOnly`: Indicates whether the request was read-only (`true` in this case).

`8.`

`Event IDs and Categories` :

`requestID`, `eventID`, `sharedEventID`, `eventCategory`: Various identifiers and categories for the event.

In summary, this log entry represents a read-only API call (`GetBucketAcl`) on an S3 bucket (`aws-cloudtrail-logs-030597212547-ee3b6b96`) in the `us-east-1` region. The call was made by the AWS CloudTrail service itself for management purposes.

## CloudWatch Alarms

With Amazon CloudWatch Alarms, you can monitor a specific metric over a defined time period. If the metric surpasses a set threshold, a notification is dispatched to an Amazon SNS topic or AWS Auto Scaling policy. It's important to note that CloudWatch alarms don't trigger actions merely due to being in a certain state; instead, the state must have changed and persisted for a specified number of periods.

Please check this [blogpost](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudwatch-monitoring.html) for detailed information.

## Recording Requests Through Server Access Logging

Logging requests with server access logging gives a lot of details about the requests that go to a bucket. These logs are good for many things. For example, they can be helpful for security and checking who can access things.

Server access logging provides detailed records for the requests made to an Amazon S3 bucket. These logs are helpful for many things. For instance, they can be useful for security and checking who can access things. This info can also give insights into your customer base and help you understand your Amazon S3 bill. By default, Amazon S3 doesn't automatically gather these server access logs. You need to enable logging, and once done, Amazon S3 sends access logs from a source bucket to a destination bucket (also called a target bucket) of your choice. The destination bucket must be in the same AWS Region and AWS account as the source bucket. An access log record includes details about the requests to a bucket. This can cover the type of request, the resources specified in the request, and the time and date when the request was processed.

## How Can I Turn on Log Delivery?

To enable log delivery, follow these basic steps. You can find more details in the guide on activating Amazon S3 server access logging.

1. Provide the name of the destination bucket (also called a target bucket). This is where you want Amazon S3 to keep the access logs as objects. Both the source and destination buckets should be in the same AWS Region and owned by the same account. The destination bucket should not have an S3 Object Lock default retention period configuration, and Requester Pays should not be enabled.

- You can choose any bucket you own in the same Region as the source bucket for log delivery, including the source bucket itself. However, for easier log management, we suggest saving access logs in a different bucket.
    
- If your source bucket and destination bucket are the same, extra logs are created for the logs written to the bucket, leading to an endless loop of logs. We advise against this as it could result in a slight increase in your storage billing. Additionally, the extra logs about logs might make it more challenging to find the log you are looking for.
    

2. If you decide to save access logs in the source bucket, it's recommended to specify a destination prefix (also known as a target prefix) for all log object keys. This makes log objects easier to identify by having a common string at the beginning of all log object names.
3. Optionally, assign a destination prefix to all Amazon S3 log object keys. This prefix makes it simpler for you to locate the log objects. For example, if you specify the prefix value logs/, each log object created by Amazon S3 starts with the logs/ prefix in its key, like this:

- logs/2013-11-01-21-32-16-E568B2907131C0C0
    
- If you specify the prefix value logs, the log object appears like this:
    
- logs2013-11-01-21-32-16-E568B2907131C0C0
    
- Prefixes are also helpful to distinguish between source buckets when multiple buckets log to the same destination bucket.
    
- This prefix can also assist when deleting logs. For instance, you can set a lifecycle configuration rule for Amazon S3 to delete objects with a specific prefix. More details can be found in the guide on deleting Amazon S3 log files.
    

4. Optionally, set permissions so that others can access the generated logs. By default, only the bucket owner always has full access to the log objects. If your destination bucket uses the Bucket owner enforced setting for S3 Object Ownership to disable access control lists (ACLs), you can't grant permissions in destination grants (also called target grants) that use ACLs. However, you can update your bucket policy for the destination bucket to grant access to others. More information can be found in the guide on identity and access management in Amazon S3 and permissions for log delivery.
5. Optionally, set a log object key format for the log files. You have two options for the log object key format (also known as the target object key format):

- Non-date-based partitioning – This is the original log object key format. If you choose this format, the log file key format appears as follows:
    
- [DestinationPrefix][YYYY]-[MM]-[DD]-[hh]-[mm]-[ss]-[UniqueString]
    
- For example, if you specify logs/ as the prefix, your log objects are named like this:
    
- logs/2013-11-01-21-32-16-E568B2907131C0C0
    
- Date-based partitioning – If you choose date-based partitioning, you can choose the event time or delivery time for the log file as the date source used in the log format. This format makes it easier to query the logs.
    
- If you choose date-based partitioning, the log file key format appears as follows:
    

[DestinationPrefix][SourceAccountId]/[SourceRegion]/[SourceBucket]/[YYYY]/[MM]/[DD]/[YYYY]-[MM]-[DD]-[hh]-[mm]-[ss]-[UniqueString]

- For example, if you specify logs/ as the target prefix, your log objects are named like this:

logs/123456789012/us-west-2/DOC-EXAMPLE-SOURCE-BUCKET/2023/03/01/2023-03-01-21-32-16-E568B2907131C0C0

- For delivery time delivery, the time in the log file names corresponds to the delivery time for the log files.
    
- For event time delivery, the year, month, and day correspond to the day on which the event occurred, and the hour, minutes, and seconds are set to 00 in the key. The logs delivered in these log files are for a specific day only.
    

In this part of the module, monitoring and logging operations on Amazon S3 are mentioned. In the next part of the module, `S3 Security Incident Response` is explained.