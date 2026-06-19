# services

Business logic and data access. Services talk to Mongoose models and return
plain data or throw `ApiError`. They contain no Express specifics (`req`/`res`),
which keeps them easy to test and reuse.

No services yet. This is structure only.
