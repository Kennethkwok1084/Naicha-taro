# Repository Guidelines

## Project Structure & Module Organization
- Client code lives in `src/` using Taro + React + TypeScript; the app entry is `src/app.ts` and shared styles sit in `src/app.scss`.
- Pages live under `src/pages/*` with co-located `index.tsx` and `index.scss`; add new screens as sibling folders to reuse routing conventions.
- Runtime configuration per target is under `config/` (`dev.ts`, `prod.ts`) with env overrides in `.env.development`, `.env.production`, `.env.test`.
- Shared type declarations belong in `types/`; docs, proposals, or reference materials in `docs/`.
## Always resposed in Chinese/中文
## Build, Test, and Development Commands
- Install deps with `pnpm install` (lockfile is `pnpm-lock.yaml`; `npm` also works if necessary).
- Local watch builds: `pnpm dev:weapp` for WeChat; swap `weapp` with `h5`, `alipay`, `tt`, `swan`, `jd`, `qq`, or `harmony-hybrid` to target other platforms.
- Production build: `pnpm build:weapp` (or another platform suffix) outputs compiled assets under `dist/` for the chosen target.
- Taro CLI is bundled; you rarely need global installs. Add `-- --watch` only when extending the dev scripts.

## Coding Style & Naming Conventions
- `.editorconfig` enforces spaces, 2-space indent, UTF-8, trailing newline; honor it in editors and CI scripts.
- ESLint extends `taro/react`; keep JSX lint-clean and avoid unused React imports (rules already configured).
- Styles use Sass with `stylelint-config-standard`; favor BEM-ish selectors per page (`.page__section`) and keep globals minimal.
- Use PascalCase for React components and TypeScript interfaces/types; prefer camelCase for vars/functions and kebab-case for file names unless the framework requires `index.tsx` entry points.

## Testing Guidelines
- No automated tests are present yet; when adding them, colocate per feature (e.g., `src/pages/cart/__tests__/cart.spec.tsx`) and use a consistent runner (Vitest or Jest) plus JSDOM for components.
- Aim for coverage on page logic and shared hooks/utilities; mock Taro APIs to keep tests deterministic.

## Commit & Pull Request Guidelines
- Commit messages must follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.); a Husky `commit-msg` hook runs Commitlint to enforce this.
- Keep commits small and scoped; include platform context when helpful (e.g., `feat(weapp): add milk tea cart page`).
- PRs should summarize changes, list target platforms, and link tracking issues; add screenshots or GIFs for UI changes and mention any build/packaging impacts.

## Configuration & Environment Notes
- Never commit secrets; store app IDs and API keys in `.env.*` files that are already gitignored.
- If adjusting build targets, update both `config/*.ts` and the relevant `dev:`/`build:` scripts so contributors can mirror your setup.
