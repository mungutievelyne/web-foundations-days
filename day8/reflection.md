# Day 8 Reflection

The most difficult concept in this course was understanding how to design a system that works correctly when many users make requests at the same time. At first, it is easy to assume that checking whether a seat is available before selling it is enough. However, two requests can check the same seat before either one updates the database. I learned that transactions, row locking and database constraints work together to prevent this race condition. Working through the TicketHub example helped me understand why system design must consider both normal usage and unexpected traffic spikes.

One part of my QuickNotes capstone that I would improve is the integration between the frontend and backend API. I would make sure that creating, searching and deleting notes works reliably with real API responses, that errors are displayed clearly and that notes remain available after refreshing the page. I would also add automated tests to check important user flows. I would refine these improvements further using the specific feedback received on my capstone.

Next, I want to learn how to build a real backend using Node.js and Express, connect it to PostgreSQL and implement REST API endpoints. I also want to practise SQL transactions and learn how to test APIs. Finally, I would like to deploy a complete application and use monitoring tools to understand its performance under load.

This course has taught me that good software design is not just about making an application work. It is about making it reliable, understandable, secure and ready to grow.
