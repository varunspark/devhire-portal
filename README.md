# DevHire Portal

A full-stack job portal: **Spring Boot** backend + **React** frontend.

## Features
- User registration & login with **JWT authentication**
- Role-based access (`ADMIN`, `JOBSEEKER`)
- Job CRUD (public read, admin write)
- Company CRUD (public read, admin write)
- Apply for jobs, track application status
- Admin panel: manage jobs, companies, and review/update applications
- Swagger / OpenAPI docs
- Global exception handling + bean validation
- MySQL persistence
- Dockerfiles for both services + `docker-compose.yml`

## Project structure
```
devhire-portal/
├── backend/    Spring Boot API (Java 17, Maven)
└── frontend/   React app (Vite)
```

## Run everything with Docker (easiest)
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## Run manually

### Backend
Requires Java 17, Maven, and a running MySQL instance.
```bash
cd backend
# create a DB called devhire_db, or let ddl-auto=update create it
mvn spring-boot:run
```
Configure via environment variables (see `application.properties`):
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `SERVER_PORT`.

### Frontend
Requires Node 18+.
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:3000 and proxies `/api` to `http://localhost:8080`.

## API overview
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/jobs` | Public |
| POST/PUT/DELETE | `/api/jobs/**` | ADMIN |
| GET | `/api/companies` | Public |
| POST/PUT/DELETE | `/api/companies/**` | ADMIN |
| POST | `/api/applications/jobs/{jobId}` | Authenticated |
| GET | `/api/applications/my` | Authenticated |
| GET | `/api/applications/all` | ADMIN |
| PATCH | `/api/applications/{id}/status` | ADMIN |

Full interactive docs at `/swagger-ui.html` once the backend is running.

## First-time usage
1. Register an account. Choose **Admin / Recruiter** as account type to get admin rights.
2. As admin: go to Admin Panel → create a Company → create a Job under that company.
3. As a job seeker: browse `/jobs`, click **Apply Now**, paste a resume link.
4. Check application status on your **Dashboard**.
