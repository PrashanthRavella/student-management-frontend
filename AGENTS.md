# Frontend agent guide

## Purpose

Responsive React/TypeScript interface for the Student Management Portal.

## Important paths

- `src/pages`: route-level workflows
- `src/components`: reusable layout, form, and feedback UI
- `src/api`: the single Axios client and endpoint functions
- `src/types` and `src/schemas`: TypeScript contracts and Zod validation
- `tests`: Vitest/Testing Library behavior tests

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run test
npm run build
```

## Conventions and definition of done

Use accessible semantic controls, keep HTTP calls in `src/api`, retain backend validation as final authority, and cover loading/empty/error behavior. A change is done when ESLint, Vitest, and the TypeScript production build pass and documentation is current.

## Security and Git

Never commit `.env`, tokens, credentials, private student data, `node_modules`, or `dist`. Never hard-code a production API origin. Do not commit, create remotes, or push without the owner's approval.

