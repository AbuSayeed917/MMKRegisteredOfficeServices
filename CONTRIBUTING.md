# Contributing to MMK Registered Office Services

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20+
- npm 9+
- PostgreSQL database (or use Railway)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/AbuSayeed917/MMKRegisteredOfficeServices.git
cd MMKRegisteredOfficeServices

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your database URL and other required values

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/short-description` | `feat/client-delete-button` |
| Bug fix | `fix/short-description` | `fix/email-not-sending` |
| Refactor | `refactor/short-description` | `refactor/admin-layout` |
| Docs | `docs/short-description` | `docs/api-endpoints` |
| CI/CD | `ci/short-description` | `ci/add-codeql` |

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

**Examples:**
- `feat(admin): add client deletion with confirmation`
- `fix(auth): resolve session expiry redirect loop`
- `docs: update API endpoint documentation`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, focused commits
3. Ensure `npm run lint` and `npm run build` pass
4. Push your branch and open a PR using the template
5. Fill out the PR template completely
6. Wait for CI checks to pass
7. Request a review

## Code Style

- **TypeScript** — strict mode, no `any` unless absolutely necessary
- **React** — functional components, hooks only
- **Tailwind CSS** — utility-first, use design tokens
- **Prisma** — always use transactions for multi-table operations
- **API routes** — validate input, return proper HTTP status codes

## Reporting Issues

- Use the [Bug Report](https://github.com/AbuSayeed917/MMKRegisteredOfficeServices/issues/new?template=bug_report.yml) template for bugs
- Use the [Feature Request](https://github.com/AbuSayeed917/MMKRegisteredOfficeServices/issues/new?template=feature_request.yml) template for features
- For security issues, see [SECURITY.md](.github/SECURITY.md)
