In Amazon Simple Storage Service (Amazon S3) and an incredibly wide range of applications, ensuring the security of data stored in Amazon S3 is crucial for any organization. Therefore, here are the measures to safeguard your data in S3. By default, all S3 buckets are private and can only be accessed by users who have been explicitly granted access through ACLs, S3 bucket policies, and identity-based policies. In this training, we discuss the latest S3 features and Amazon Web Services (AWS) services that can assist you in securing your data in S3, including organization-wide preventive measures like AWS Organizations service control policies (SCPs). We also offer suggestions for detective controls in S3, such as Amazon GuardDuty for S3, AWS CloudTrail object-level logging, AWS Security Hub S3 controls, and CloudTrail configuration specific to S3 data events. Additionally, we present options and considerations for data protection, focusing on encrypting data in S3. Lastly, we examine recommendations for backing up and recovering data stored in S3. Considering the diverse range of applications supported by S3, it is important to assess the priority of controls based on your specific use case and associated details.

## Restrict Public Access

Restricting public access to S3 buckets is crucial at the organization level. Identify specific AWS accounts for utilizing public S3 resources and ensure that other S3 buckets do not accidentally become public by activating S3 Block Public Access. Utilize Organizations SCPs (Please check [this link](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) to get detailed description) to verify that the S3 Block Public Access setting remains unchanged. S3 Block Public Access offers protection at both the account and individual bucket levels, even for buckets created in the future. You can prevent existing public access, whether specified by an ACL or policy, and ensure that newly created items are not granted public access. This approach permits only designated AWS accounts to possess public S3 buckets, while denying such access to all other AWS accounts.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-aws-s3-security-best-practices-1.png)

## Enable S3 Protection in GuardDuty to Detect Suspicious Activities

GuardDuty has support for S3. Enabling this feature allows GuardDuty to consistently observe and analyze events related to S3 data access and S3 configuration to detect suspicious activities. These may include actions like requests originating from uncommon geographic locations, deactivation of preventive controls, and API call patterns indicating an effort to uncover improperly configured bucket permissions. To accomplish this, GuardDuty employs a blend of anomaly detection, machine learning, and regularly updated threat intelligence.

## Use Macie to Detect Sensitive Data

Utilize Macie to scan for confidential information beyond designated locations. AWS introduced Amazon Macie, a fully managed service designed to assist in the identification and safeguarding of sensitive data. Macie employs machine learning to automatically examine and categorize data in S3. Enabling Macie across your organization is a straightforward and cost-effective approach to attain a centralized, regularly updated perspective of your entire organization's S3 environment. It allows you to monitor adherence to security best practices through a central console. Macie continuously assesses all buckets for encryption and access control, notifying you of public, unencrypted, or externally shared or replicated buckets. It evaluates sensitive data using a fully managed list of common types and any custom types you create, issuing findings for objects containing sensitive data.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-aws-s3-security-best-practices-2.png)

## Encryption

There are four choices for encrypting data in S3, involving options both on the client side and the server side. Server-side encryption involves S3 encrypting your data at the object level as it writes it to storage in AWS data centers and decrypts it when you access it. If you authenticate your request and have the necessary access permissions, there is no distinction in how you access encrypted or unencrypted objects.

The first two alternatives involve the use of AWS Key Management Service (AWS KMS), a tool for generating and overseeing cryptographic keys with control across a variety of AWS services and applications. Different options exist for managing the encryption keys used for S3 data.

## Server-side Encryption with Amazon S3-managed Encryption Keys (SSE-S3)

When employing SSE-S3, each object is encrypted with a unique key managed by AWS. This option allows you to encrypt your data simply by checking a box, requiring no additional steps. Encryption and decryption are handled transparently, making SSE-S3 a convenient and cost-effective choice.

## Server-side Encryption with Customer Master Keys (CMKs) Stored in AWS KMS (SSE-KMS)

Similar to SSE-S3 but with additional benefits and costs. Separate permissions for CMK use provide enhanced protection against unauthorized access to your S3 objects. SSE-KMS offers an audit trail, revealing when and by whom your CMK was used. Provides control over the key access policy, potentially offering more granular control based on your specific use case.

## Server-side Encryption with Customer-provided Keys (SSE-C)

You manage the encryption keys, while S3 manages the encryption and decryption processes. Useful when you need to provide and manage your own encryption keys.

Note that responsibility lies with you for creating, storing, and tracking the keys used for each object. AWS cannot recover customer-provided keys if lost, and you must provide the customer-managed key every time you PUT or GET an object.

## Client-side Encryption

Another option involves encrypting your data in S3 on the client side. You can use a CMK stored in AWS KMS or a master key within your application. In client-side encryption, data is encrypted before being sent to AWS and decrypted upon retrieval. AWS does not manage keys and is not responsible for encryption or decryption. Implementation of client-side encryption typically requires deep integration into your application.

Please visit [Setting default server-side encryption behavior for Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html) for more information.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-aws-s3-security-best-practices-3.png)

## Safeguard Your Data in S3 Against Accidental Removal Through the Use of S3 Versioning and S3 Object Lock

Amazon S3 is crafted to ensure the durability of 99.999999999 percent of objects across various Availability Zones. It is resilient against events impacting an entire zone and is designed for 99.99 percent availability throughout a given year. When devising strategies to back up your S3 data, the focus often revolves around shielding buckets and objects from accidental deletion. In such cases, S3 Versioning proves valuable, allowing the preservation, retrieval, and restoration of every version of each object stored in your buckets. This feature permits the retention of multiple versions of an object within the same bucket and aids in the recovery of objects from accidental deletion or overwrites. It's important to note that using S3 Versioning incurs associated costs. Consider implementing S3 Versioning selectively, especially for S3 buckets containing critical backup data or sensitive information.

By enabling S3 Versioning on your S3 buckets, you have the option to enhance security further by configuring the bucket to enable multi-factor authentication (MFA) delete. With this setup, the bucket owner must provide two forms of authentication in any request to delete a version or alter the versioning status of the bucket.

S3 Object Lock serves as a feature to mitigate data loss by adopting a [write-once-read-many (WORM)](https://en.wikipedia.org/wiki/Write_once_read_many) model. Through Object Lock, you can prevent an object from being overwritten or deleted for a specific duration or indefinitely. It's essential to recognize that Object Lock is suitable for specific use cases, particularly those where it is crucial to ensure that data remains unchanged or undeleted after being written.

## Activate Logging for S3 Using CloudTrail and S3 Server Access Logging

Amazon S3 is seamlessly integrated with CloudTrail, which captures a subset of API calls, covering interactions from the S3 console and code-based calls to the S3 APIs. Furthermore, you have the option to enable CloudTrail data events for all your buckets or for a specific list of buckets. It's important to note that a highly active S3 bucket may generate a substantial volume of log data, potentially leading to increased CloudTrail costs. If cost is a concern, consider enabling this additional logging exclusively for S3 buckets containing critical data.

Server access logging furnishes comprehensive records of the requests made to a bucket, offering valuable insights for security and access audits.

We’ll investigate this better in the next section.

![](https://cdn.services-k8s.prod.aws.htb.systems/content/sections/aws-s3-basics-aws-s3-security-best-practices-4.png)

## Ensure the Safety of Your Data in S3 by Creating Backups

While S3 inherently spreads your data across multiple Availability Zones located in diverse geographic regions, certain compliance requirements may necessitate storing data at even greater distances. Cross-region replication (CRR) provides a solution by allowing the replication of data between distant AWS Regions, catering to these specific requirements. CRR facilitates the automatic and asynchronous copying of objects across buckets situated in different AWS Regions. It's essential to be aware that utilizing this feature incurs associated costs. Consider implementing CRR selectively, especially for S3 buckets containing crucial backup data or sensitive information.

Please visit [this blogpost](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html) for further information.

By implementing the these practices outlined in this blog post, you can establish robust protective measures for your data stored in Amazon S3. These measures encompass least privilege access, encryption of data at rest, prevention of public access, comprehensive logging, vigilant monitoring, and configuration checks. For more in-depth information on S3 security, refer to the [Amazon S3 Security documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security.html) .

In this part of the module, best practices that can be applied for Amazon S3 security are mentioned. In the next part of the module, `Monitoring and Logging` is explained.