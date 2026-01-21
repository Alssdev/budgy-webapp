# AGENTS.md

## Do
- use Nuxt v3.20.2
- use Primevue v4.5.4
- use Pinia as State Manager
- default to small components. prefer focused modules over god components
- default to small files and diffs. avoid repo wide rewrites unless asked
- use 2 space tab indent
- before writing code, you have to show a plan to the user an wait for his confirmation.

## Don't
- do not create custom css clases, use tailwindcss always.
- do not hard code colors
- do not add new heavy dependencies without approval
- do not use TypeScript comment directives
- do not use ESLint comment directives
- do not read type definitions in node_modules/, instead, read docs.
- do not use any as type in .ts files

## Commands
### Type check a single file by path
npx tsc --noEmit path/to/file.ts

### Unit tests - pick one
npx eslint --fix path/to/file.tsx

### Unit tests - pick one
npx vitest run path/to/file.test.tsx

Note: Always lint, test, and typecheck updated files. Use project-wide build sparingly.

## Safety and permissions
Allowed without prompt:
- read files, list files
- tsc single file, prettier, eslint,
- vitest single test

Ask first: 
- package installs
- git push
- deleting files, chmod
- running full build or end to end suites

## Project structure
- pages live in `pages/`
- components live in `components/`
- composables live in `composables/`
- middlewares live in `middleware/`
- server api routes live in `server/api/`
- server bussines logic lives in `server/services/`
- server shared logic (small functions) live in `server/utils/`
- server middlewares live in `server/middleware/`

## API docs
- use the appwrite-docs MCP server to look up docs on Appwrite
- use the appwrite MCP server to interact with Appwrite

## When stuck
- ask a clarifying question, propose a short plan, or open a draft PR with notes
- do not push large speculative changes without confirmation

## Nuxt stuff
- auto imports are enabled. missing identifiers like useAppwrite are defined in other folders.

## Appwrite
- when creating collections, remeber to set the correct relations between collections.

# UI/UX
- mobile first