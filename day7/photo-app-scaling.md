# Day 7 Assignment: Scaling SnapShare

## 1. Assumptions and Load Estimates

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

The following assumptions are based on the assignment:

- Registered users: 10,000,000
- Daily active users: 10% of registered users
- Photos uploaded per active user per day: 1
- Feed pages viewed per active user per day: 50
- Average original photo size: 2 MB
- Average thumbnail size: 50 KB
- Peak traffic: 5 times the average traffic
- A day has approximately 100,000 seconds for easy estimation.
- All uploaded photos and their thumbnails are retained for a year.

### Daily active users

10,000,000 × 10% = 1,000,000 daily active users.

### Photo uploads per second

1,000,000 active users × 1 photo = 1,000,000 uploads per day.

Average uploads per second:

1,000,000 ÷ 100,000 ≈ 10 uploads per second.

Peak uploads per second:

10 × 5 = 50 uploads per second.

### Feed views per second

1,000,000 active users × 50 feed views = 50,000,000 feed views per day.

Average feed views per second:

50,000,000 ÷ 100,000 ≈ 500 feed views per second.

Peak feed views per second:

500 × 5 = 2,500 feed views per second.

### Photo storage per year

Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2,000 GB.

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB.

Total daily storage:

2,000 GB + 50 GB = 2,050 GB, or approximately 2.05 TB.

Estimated storage per year:

2.05 TB × 365 = approximately 748 TB per year.

This estimate excludes additional storage for backups, replication, metadata, and other overhead.

### Read-heavy or write-heavy?

SnapShare is a read-heavy system because users view feed pages much more frequently than they upload photos. It receives approximately 500 feed views per second on average, compared with 10 photo uploads per second.

This means the system should optimise feed loading through caching, database read replicas, and a CDN so that users can access photos quickly without overloading the application servers or database.

## 2. Why Photos Should Use Object Storage

Photos should be stored in object storage rather than directly inside the relational database. Photo files are large, and storing them in the database would increase database size, backups, and the cost of retrieving data.

Object storage, such as Amazon S3 or a similar service, is designed to store large files reliably and scale to very large amounts of data. The database should store photo metadata, such as the photo ID, owner ID, caption, upload time, and object-storage key or URL.

The CDN can then deliver photos and thumbnails efficiently to users.

## 3. SnapShare Architecture Diagram

```text
                         ┌──────────────┐
                         │     DNS      │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │   Browser /  │
                         │ Mobile App   │
                         └───┬───────┬──┘
                             │       │
                  Static files       │ API requests
                             ▼       ▼
                      ┌─────────┐  ┌───────────────┐
                      │   CDN   │  │ Load Balancer │
                      └────┬────┘  └───────┬───────┘
                           │          ┌────┴────┐
                           │          ▼         ▼
                           │     ┌────────┐ ┌────────┐
                           │     │ App 1  │ │ App 2  │
                           │     └───┬────┘ └───┬────┘
                           │         └────┬─────┘
                           │              │
                           │       ┌──────▼──────┐
                           │       │ Cache       │
                           │       │ (Redis)     │
                           │       └─────────────┘
                           │
                           │       ┌──────────────┐
                           │       │ Primary DB   │
                           │       └──────┬───────┘
                           │              │ Replication
                           │       ┌──────▼───────┐
                           │       │ Read Replica │
                           │       └──────────────┘
                           │
                           │       ┌──────────────┐
                           │       │ Object       │
                           │       │ Storage      │
                           │       │ Originals +  │
                           │       │ Thumbnails   │
                           │       └──────────────┘
                           │
                           │       ┌──────────────┐
                           │       │ Message Queue│
                           │       └──────┬───────┘
                           │              ▼
                           │       ┌──────────────┐
                           │       │ Thumbnail    │
                           │       │ Worker       │
                           │       └──────┬───────┘
                           │              │
                           └──────────────┘
                                  Stores thumbnail
                                  in object storage
```

## 4. What Each Component Solves

- **DNS:** Translates SnapShare's domain name into the address needed to reach its services.
- **CDN:** Serves static files and cached photos from locations closer to users, reducing latency and origin traffic.
- **Load balancer:** Distributes API requests across healthy application servers so that one server does not handle all the traffic.
- **Application servers:** Handle user authentication, photo uploads, feed requests, validation, and other application logic.
- **Redis cache:** Stores frequently requested feed data and metadata in memory to reduce database queries and improve response times.
- **Primary database:** Stores authoritative records, including users, followers, captions, photo metadata, and photo-storage keys.
- **Read replica:** Handles suitable read queries so that feed requests put less pressure on the primary database.
- **Object storage:** Stores the original photo files and generated thumbnails without filling the database with large binary files.
- **Message queue:** Holds thumbnail-generation jobs so that uploads do not need to wait for image processing to finish.
- **Thumbnail worker:** Processes queued jobs in the background, creates smaller versions of photos, and saves them to object storage.

## 5. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The application server authenticates the user and validates the upload, including the file type and size.
3. The original photo is uploaded to object storage, potentially using a pre-signed upload URL so the client can transfer the file directly.
4. The application records the photo metadata and its object-storage key in the primary database.
5. The application adds a thumbnail-generation job to the message queue.
6. The application responds that the upload has been accepted, without waiting for thumbnail generation.
7. A background worker retrieves the job and reads the original photo from object storage.
8. The worker generates a smaller thumbnail and saves it in object storage.
9. The worker updates the photo's processing status in the database if the application tracks thumbnail readiness.
10. When another user opens a feed containing that photo, the application retrieves feed metadata from the cache or a suitable database replica, and the CDN delivers the available thumbnail or original photo.

If thumbnail processing fails, the job can be retried, and the application can temporarily display a placeholder until the thumbnail becomes available.

## 6. Trade-offs

### Speed versus freshness

Caching feed data improves response times and reduces database load. However, users may briefly see an outdated feed after someone uploads a new photo. Cache invalidation or short time-to-live values can reduce this problem.

### Reliability versus cost

Multiple application servers and a read replica improve availability and help the system handle more requests. However, running additional servers and database replicas costs more money and requires more operational work.

### Fast uploads versus immediate availability

Using a message queue allows the application to acknowledge an upload before the thumbnail is ready. This improves upload responsiveness, but a newly uploaded photo may initially appear without its thumbnail.

### Storage cost versus image quality

Keeping original photos and thumbnails provides both high-quality images and faster feed loading. However, it increases storage requirements. Compression, lifecycle policies, and suitable image sizes can reduce costs, although aggressive compression can reduce image quality.

## 7. Conclusion

SnapShare should use a horizontally scalable application layer, a load balancer, caching, database read replicas, object storage, a CDN, and background thumbnail processing. The estimated average load is 10 photo uploads and 500 feed views per second, with peaks of 50 uploads and 2,500 feed views per second. The design focuses on fast feed delivery while keeping large photo files out of the database and processing thumbnails asynchronously.