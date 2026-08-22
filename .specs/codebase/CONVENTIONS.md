# CONVENTIONS.md — Code Conventions

## Architecture & Module Structure
- **Domain Modules**: `src/modules/[feature]/domain/calculate[Feature].ts`
- **Metadata**: `src/modules/[feature]/metadata/[feature].metadata.ts`
- **Schemas**: `src/modules/[feature]/schemas/[feature].schema.ts`
- **Types**: `src/modules/[feature]/domain/[feature].types.ts`
- **Tests**: `src/modules/[feature]/tests/calculate[Feature].test.ts`
- **Repositories**: `src/modules/[feature]/api/[feature].repository.ts`

## Rules & Quality Gates
- **TypeScript**: `strict: true`, `noUncheckedIndexedAccess: true`.
- **Quality Gate**: `npx tsc --noEmit && npx vitest run` deve passar sem qualquer erro antes de cada commit.
