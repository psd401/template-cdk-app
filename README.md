# template-cdk-app

PSD401 template for AWS CDK v2 (TypeScript) apps, built to the district IaC standard (08-iac.md). CDK on AWS is the district rule — no Terraform-on-AWS.

## What this template gives you

- **`bin/app.ts`** — district tag set applied mechanically via `Tags.of(app)` (`psd:application`, `psd:environment`, `psd:owner`, `psd:managed-by=cdk`, `psd:repo`, `psd:data-classification`), and **cdk-nag v3** AwsSolutions pack wired through the CDK policy-validation framework (`Validations.of(app).addPlugins(...)`).
- **`lib/storage-stack.ts`** — one exemplar stateful stack: an S3 bucket with block-public-access, encryption at rest, SSL enforced, versioning, and `RemovalPolicy.RETAIN`.
- **Jest tests** (`test/storage-stack.test.ts`) using `aws-cdk-lib/assertions`: a `hasResourceProperties` assertion on the secure defaults and a **logical-ID pin test** on the bucket (replacement of a stateful resource = data loss).
- **Committed `cdk.json`**, PSD CI callers, Dependabot, MIT LICENSE, CLAUDE.md.

## First 10 minutes

1. **Rename**: `package.json` name; every CHANGEME in `bin/app.ts` (application, repo, data classification).
2. **Set repo custom properties**: `tier` (default `c-experiment`), `owner`, `lifecycle: active`; add topics (`cdk`, …).
3. **Review CLAUDE.md**, especially the IaC rules — they are review-blocking.
4. **Verify green**: `npm install && npm test && npm run lint && npm run typecheck && npm run synth`.
5. Replace `StorageStack` with your real stacks. Keep stateful and stateless resources in separate stacks; re-pin logical IDs in tests for every stateful resource you add.

## Deploying

Nobody — human or agent — runs `cdk deploy` locally. Merged PRs deploy through GitHub Actions with an OIDC role and environment protection; PRs get a `cdk diff` sticky comment and reviewers read the diff, not the TypeScript. Pin `aws-cdk-lib` and the `aws-cdk` CLI independently — they version separately.

## Commands

| Task | Command |
|------|---------|
| Test | `npm test` |
| Synth (runs cdk-nag) | `npm run synth` |
| Diff | `npm run diff` |
| Lint / Typecheck | `npm run lint` / `npm run typecheck` |

## Owner

Technology Services, Peninsula School District.
