# models

Mongoose schemas and models.

| Model | Purpose | Notes |
| --- | --- | --- |
| `Employee` | User account and profile | Password hashed on save, soft delete, unique email |
| `Otp` | One time passcodes | Hashed code, TTL expiry, attempt limits |
| `Session` | Login and device sessions | TTL expiry, revoke support |
| `RefreshToken` | Refresh token records | Hashed token, rotation, TTL expiry |
| `AuditLog` | Append-only activity trail | Indexed by actor and action, immutable |

Shared behavior lives in `plugins/`:

- `softDelete.js` adds `deletedAt` and hides soft-deleted documents from normal queries.
- `toJSON.js` removes private paths, maps `_id` to `id`, and drops `__v`.

All models use timestamps. Secrets are never stored in plain text: passwords and
OTP codes use bcrypt, refresh tokens use SHA-256.
