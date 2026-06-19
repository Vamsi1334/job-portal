# controllers

Request and response handlers. One file per resource (for example
`auth.controller.js`, `job.controller.js`). Controllers read validated input
from `req`, call a service, and shape the HTTP response. Keep business logic in
`services`, not here. Wrap async handlers with `utils/asyncHandler`.

No controllers yet. This is structure only.
