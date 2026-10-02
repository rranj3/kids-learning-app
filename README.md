# Kids Learning App 📚🧮

> A multi-age learning platform for children ages 2-12 combining engaging storytelling, interactive games, and adaptive feedback.

## 🎯 Overview

The **Kids Learning App** is a web-based learning platform designed for children aged 2-12 (Toddler through Grade 6). It features:

- **Age-Specific Content** across 6 age bands with scaffolded difficulty
- **ELA Module**: Stories, comprehension quizzes, word games, grammar exercises
- **Math Module**: Number sense, operations, problem-solving with visual/interactive concepts
- **Story-Driven Learning**: Recurring characters (Shreya, Neel, Krisha, Adit) create emotional engagement
- **Progress Tracking**: Parents can monitor learning milestones and achievements
- **Claude AI Integration** (Phase 4+): Adaptive hints, personalized feedback, quiz generation

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14 + React + TypeScript + Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL 15 |
| **Caching** | Redis 7 |
| **Deployment** | Vercel (frontend) + Railway/Render (backend) |
| **AI** | Claude API (Anthropic) + Prompt Caching |
| **Monitoring** | Sentry + Datadog |
| **DevOps** | Docker Compose (local), GitHub Actions (CI/CD) |

---

## 🚀 Quick Start

### Prerequisites

- **Docker** & **Docker Compose**
- **Git**
- **Node.js 18+** (for frontend development)
- **Python 3.11+** (for backend development)
- **PostgreSQL CLI** (optional, for manual DB access)

### Option 1: Docker Compose (Recommended for Local Dev)

```bash
# Clone the repository
git clone https://github.com/rranj3/kids-learning-app.git
cd kids-learning-app

# Create .env file
cp .env.example .env
# Edit .env and add your CLAUDE_API_KEY

# Start all services
docker-compose up -d

# Backend runs on: http://localhost:8000
# Frontend runs on: http://localhost:3000
# PostgreSQL runs on: localhost:5432
# Redis runs on: localhost:6379
```

### Option 2: Manual Setup (Local Development)

#### Backend Setup

```bash
cd backend

# Create Python virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
psql kids_learning_dev < migrations/schema.sql
psql kids_learning_dev < migrations/seed.sql

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start Next.js dev server
npm run dev
# Frontend runs on: http://localhost:3000
```

---

## 📁 Project Structure

```
kids-learning-app/
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── main.py                   # Entry point
│   │   ├── routes/                   # API endpoints
│   │   │   ├── auth.py               # Authentication
│   │   │   ├── children.py           # Child profiles
│   │   │   ├── stories.py            # Stories & reading
│   │   │   ├── quizzes.py            # Comprehension quizzes
│   │   │   └── progress.py           # Learning progress tracking
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── utils/
│   │   │   ├── config.py             # Configuration & settings
│   │   │   └── database.py           # DB connection & sessions
│   ├── migrations/
│   │   ├── schema.sql                # Database schema
│   │   └── seed.sql                  # Seed data
│   ├── content/
│   │   └── stories/                  # Markdown story files
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                         # Next.js application
│   ├── app/
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   ├── components/               # Reusable components
│   │   │   ├── ProfileSelector.tsx   # Child profile selection
│   │   │   ├── StoryReader.tsx       # Story display
│   │   │   ├── QuizComponent.tsx     # Quiz UI
│   │   │   └── Dashboard.tsx         # Parent dashboard
│   │   ├── pages/
│   │   │   ├── stories/[id].tsx      # Story detail page
│   │   │   ├── quiz/[id].tsx         # Quiz page
│   │   │   └── dashboard.tsx         # Parent dashboard
│   │   ├── styles/                   # Global styles
│   │   ├── utils/                    # Utility functions
│   │   └── lib/                      # API client, helpers
│   ├── public/                       # Static assets
│   ├── .env.local.example
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml                # Docker Compose configuration
├── .gitignore
└── README.md                         # This file
```

---

## 🗄️ Database Schema

### Core Tables

#### `users` (Parents/Guardians)
```sql
- id (UUID, PK)
- email (unique)
- password_hash
- name
- role (parent | admin)
- created_at, updated_at
```

#### `children` (Child Profiles)
```sql
- id (UUID, PK)
- parent_id (FK → users)
- name
- age_band (2yo | 3yo | 4-5yo | K-G2 | G3-G4 | G5-G6)
- date_of_birth
- avatar_url
- preferences (JSON)
- created_at, updated_at, last_active_at
```

#### `content_items` (Stories, Quizzes, Games)
```sql
- id (UUID, PK)
- type (story | quiz | game | grammar_lesson | math_problem)
- age_band
- subject (ELA | MATH)
- title, body_markdown
- difficulty_level (1-5)
- estimated_duration_minutes
- metadata (JSON)
```

#### `progress` (Learning Tracking)
```sql
- id (UUID, PK)
- child_id (FK → children)
- content_id (FK → content_items)
- completed_at, time_spent_seconds
- score (0-100), attempt_count
- ai_feedback
```

See `backend/migrations/schema.sql` for complete schema.

---

## 🔄 API Endpoints

### Authentication (Phase 2+)
- `POST /api/auth/login` - Parent login
- `POST /api/auth/signup` - Parent registration

### Children
- `GET /api/children` - List all children (parent's account)
- `POST /api/children` - Create new child profile
- `GET /api/children/{child_id}` - Get child details
- `PUT /api/children/{child_id}` - Update child profile

### Stories
- `GET /api/stories` - List stories (filter by age_band, subject)
- `GET /api/stories/{story_id}` - Get story content
- `POST /api/stories/ingest` - Ingest stories from Markdown

### Quizzes
- `GET /api/quizzes/{story_id}` - Get comprehension quiz for story
- `POST /api/quizzes/{quiz_id}/submit` - Submit quiz answers

### Progress
- `GET /api/progress/{child_id}/summary` - Get learning summary
- `GET /api/progress/{child_id}/history` - Get activity history
- `POST /api/progress/{child_id}/log` - Log learning activity

---

## 👥 Character Universe: Shreya & Friends

### Shreya (9 years old, Grade 4)
- Protagonist and curious learner
- Loves solving puzzles and helping her brother
- Target learner: G3-G4 students

### Neel (2 years old, Toddler)
- Shreya's little brother
- Learning to count and recognize words
- Target learner: 2-year-olds

### Krisha (9 years old, classmate)
- Shreya's best friend at school
- Appears in collaboration and teamwork stories
- Target learner: K-G2 and G3-G4

### Adit (9 years old, best friend)
- Shreya's best friend outside school
- Loves math and mysteries
- Team problem-solver
- Target learner: G3-G4

### Stories Feature
- Recurring characters create emotional engagement
- Stories scaffold across age bands
- Learning objectives embedded in narratives

---

## 📖 Content Structure

### Stories Included (Phase 1)

| Title | Age Band | Subject | Characters |
|-------|----------|---------|-----------|
| Shreya and Neel's First Adventure | 2yo | ELA | Shreya, Neel |
| Counting with Neel: Numbers 1-5 | 2yo | MATH | Shreya, Neel |
| Shreya's School Day with Krisha | K-G2 | ELA | Shreya, Krisha |
| Shreya and Adit Solve a Mystery | G3-G4 | ELA | Shreya, Adit |
| Shreya's Pizza Party Math | G3-G4 | MATH | Shreya, Adit, Krisha |

**To add more stories:**
1. Create a Markdown file in `backend/content/stories/`
2. Follow the YAML frontmatter structure (see examples)
3. Run `POST /api/stories/ingest` to import

---

## ⚙️ Environment Configuration

### `.env` (Backend)
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kids_learning_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256

# Claude API
CLAUDE_API_KEY=sk-your-api-key-here

# Environment
ENVIRONMENT=development  # development, staging, production

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

### `.env.local` (Frontend)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## 🐳 Docker Compose Services

### PostgreSQL (Port 5432)
- Automatic schema initialization
- Health check enabled
- Data persisted in `postgres_data` volume

### Redis (Port 6379)
- Session management & caching
- Health check enabled

### FastAPI Backend (Port 8000)
- Auto-reload in development
- Depends on PostgreSQL and Redis
- Interactive API docs at `/docs`

### Frontend (Port 3000)
- Next.js dev server with hot reload
- Connected to backend via `http://backend:8000`

---

## 📊 Database Initialization

### With Docker Compose (Automatic)
```bash
docker-compose up -d
# Schema and seed data run automatically on container startup
```

### Manual Setup
```bash
# Create database
createdb kids_learning_dev

# Run migrations
psql kids_learning_dev < backend/migrations/schema.sql
psql kids_learning_dev < backend/migrations/seed.sql

# Verify
psql kids_learning_dev -c "\dt"  # List tables
```

---

## 🚀 Deployment

### Vercel (Frontend)

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard:
#   NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# Automatic deployment on push to main
```

### Railway/Render (Backend)

```bash
# 1. Push backend code to GitHub
# 2. Connect Railway/Render to GitHub repo
# 3. Set environment variables:
#    - DATABASE_URL
#    - REDIS_URL
#    - CLAUDE_API_KEY
#    - JWT_SECRET (different for prod!)
#    - ENVIRONMENT=production

# 4. Database setup (Railway/Render can provision PostgreSQL)
# 5. Run migrations in deployment:
#    psql $DATABASE_URL < migrations/schema.sql
#    psql $DATABASE_URL < migrations/seed.sql
```

### GitHub Actions (CI/CD)

```yaml
# .github/workflows/deploy.yml
# Tests → Lint → Build → Deploy to staging/prod
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
pytest tests/ -v  # Verbose
pytest tests/ --cov  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

---

## 📝 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/story-viewer
```

### 2. Make Changes
```bash
# Edit files, test locally
npm run dev  # Frontend
uvicorn app.main:app --reload  # Backend
```

### 3. Commit & Push
```bash
git add .
git commit -m "feat: add story viewer component"
git push origin feature/story-viewer
```

### 4. Pull Request
- Create PR on GitHub
- Wait for CI checks to pass
- Request review
- Merge after approval

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# View logs
docker-compose logs backend
docker-compose logs postgres

# Restart services
docker-compose restart

# Full reset
docker-compose down -v
docker-compose up -d
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# Verify connection
psql postgresql://postgres:postgres@localhost:5432/kids_learning_dev
```

### Frontend Can't Connect to Backend
```bash
# Check CORS configuration
# Verify NEXT_PUBLIC_API_URL in .env.local
# Check backend is running: curl http://localhost:8000/health
```

---

## 🔐 Security Considerations

- ✅ JWT tokens stored in httpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ CORS restrictions
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Input validation (Pydantic schemas)
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: HTTPS in production
- ⚠️ TODO: API key rotation

---

## 📈 Performance Optimization

- **Prompt Caching**: Claude API calls cached for curriculum data (~80% reuse)
- **Redis Caching**: Session management, frequently accessed content
- **Database Indexing**: Optimized queries on `age_band`, `difficulty_level`, `child_id`
- **CDN**: Static assets served via Vercel CDN
- **Code Splitting**: Next.js automatic route-based code splitting

---

## 🎓 Learning Science Principles

1. **Storytelling Over Isolated Skills** - Content embedded in Shreya universe narratives
2. **Multi-Sensory Learning** - Text, images, audio, animations
3. **Scaffolding** - Gradual release of responsibility (Vygotsky)
4. **Spaced Repetition** - Vocabulary across stories → games → quizzes
5. **Growth Mindset** - Positive feedback, celebrate effort
6. **Interleaving** - Mix different skills in sessions

---

## 🗺️ Roadmap

### Phase 1 (Weeks 1-8): Foundation ✅
- Repo setup, Docker, schema
- Auth scaffolding
- Reading module v1 (K-G2)
- Basic dashboard

### Phase 2 (Weeks 9-20): Core Features
- Math module (K-G2)
- Word games
- Grammar basics
- Parent dashboard improvements

### Phase 3 (Weeks 21-30): Content Expansion
- G3-G6 stories
- Illustrations (Midjourney API)
- Achievement badges
- UX polish

### Phase 4 (Weeks 31-38): AI Integration
- Claude API hints
- Personalized feedback
- Quiz generation
- Prompt caching

### Phase 5 (Weeks 39-46): Adaptive Learning
- Learning path recommendations
- Spaced repetition engine
- Mastery thresholds

### Phase 6 (Weeks 47-52): Polish & Mobile
- Design system
- Accessibility (WCAG 2.1 AA)
- Offline mode
- Mobile app wrapper

---

## 📚 Resources

- [Shreya Universe Docs](./docs/shreya-universe.md)
- [API Documentation](http://localhost:8000/docs)
- [Learning Science Guide](./docs/pedagogy.md)
- [Database Schema](./backend/migrations/schema.sql)
- [Claude API Docs](https://docs.anthropic.com)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development workflow
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file

---

## 💬 Support

For questions or issues:
- GitHub Issues: https://github.com/rranj3/kids-learning-app/issues
- Email: rajesh@example.com

---

## 🎉 Authors

- **Rajesh Kumar** (@rranj3) - Project Lead
- **Claude AI** - Development Assistant

---

**Happy learning! 📚✨**
