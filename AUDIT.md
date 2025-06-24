# Security Audit

This document summarizes the results of a static audit of the repository `AutenticacionAutorizacionNodeExpres`.

## Architecture Overview
- **auth-service** (port 3000) – handles login operations.
- **user-service** (port 4000) – manages user CRUD operations.
- **frontend** – Next.js application interacting with the services.
- **MongoDB** container started via `docker-compose.yml`.

Both services expose Swagger documentation at `/docs`.

## Key Findings
1. **Credentials in source code**
   - MongoDB connection strings embed `admin:admin123` directly in [`auth-service/db.js`](auth-service/db.js) and [`user-service/db.js`](user-service/db.js).
   - The same credentials appear in `docker-compose.yml`.
2. **Passwords stored in plain text**
   - Login in `auth-service/index.js` searches for a user by matching the provided password directly, implying passwords are stored without hashing.
3. **No authentication for `user-service` routes**
   - All endpoints are publicly accessible; there is no verification of identity or permissions.
4. **Overly permissive CORS configuration**
   - `user-service` allows any origin to access its API.
5. **Lack of input validation**
   - User data is inserted into MongoDB with no validation or sanitization.
6. **HTTP usage**
   - Services are configured for HTTP only; HTTPS is recommended for production.

## Recommendations
- Move sensitive credentials to environment variables.
- Hash and salt user passwords (e.g., using `bcrypt`).
- Require authentication tokens for `user-service` endpoints.
- Restrict CORS origins in production.
- Validate request payloads before writing to the database.
- Use HTTPS in production deployments.

This audit was produced through static inspection only; no automated tools or runtime analysis were executed.

