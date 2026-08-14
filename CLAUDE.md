# CLAUDE.md — template-cdk-app

Map, not manual. Change this file in the same PR that changes the convention.

## Stack

- AWS CDK v2 (TypeScript strict, `noUncheckedIndexedAccess`) · cdk-nag v3 (AwsSolutions pack)
- Jest 30 + ts-jest + `aws-cdk-lib/assertions` · ESLint flat config · `tsx` runs `bin/app.ts`

## Commands (exact)

```bash
bun install          # bun is the PSD JS package manager (bun.lock is committed)
bun run test         # jest (CI gate; zero-test repos fail psd-ci)
bun run synth        # cdk synth — runs cdk-nag; violations fail synth
bun run diff         # cdk diff against deployed state
bun run lint         # eslint . — includes test-quality rules
bun run typecheck    # tsc --noEmit
```

Always `bun run test` (the package script), never bare `bun test` (bun's own runner).

## Map

- `bin/app.ts` — app entrypoint: district tags via `Tags.of(app)`, cdk-nag via `Validations.of(app).addPlugins(...)`. All stacks instantiate here.
- `lib/` — one stack per file. `storage-stack.ts` is the stateful exemplar (S3 bucket, secure defaults, RETAIN).
- `test/` — assertion tests per stack, including logical-ID pins on stateful resources.
- `cdk.json` — committed; `cdk.context.json` gets committed too when it appears.

## IaC rules (08-iac.md — review-blocking)

- **IAM comes from `grant*()` methods and L2 conveniences, never hand-written JSON.** A raw `PolicyStatement` with `*` requires written justification + acknowledgment.
- **No new `Validations.of(x).acknowledge({id, reason})` without human review.** Agents may propose a suppression, never merge one. CI diff-detects new acknowledgments.
- **Never run `cdk deploy` locally** — deploys happen only in CI via OIDC role with environment protection. Do not add deploy to scripts or allowlists.
- Stateful resources: own stack, `RemovalPolicy.RETAIN`, termination protection in prod, and a **logical-ID pin test** — replacement = data loss.
- Generated names, not physical names. Tags at app level only, never per-resource. `us-west-2` pinned.
- Pin `aws-cdk-lib` and `aws-cdk` CLI independently; they version separately.

## Anti-patterns (will fail review)

- Editing tag values per-resource or removing entries from the district tag set.
- Suppressing a cdk-nag finding instead of fixing the resource (the S1 acknowledgment shipped here is pre-approved and must be removed when real data arrives).
- Renaming/moving a stateful construct without a migration plan (the pin test will fail — that is the point).
- Snapshot tests as the only tests — fine-grained assertions first, snapshots secondary.
- Weakening CI, deleting tests, or adding `--require-approval never` anywhere.

## PR evidence bar

Jest + lint + typecheck output pasted in PR; reviewers read the `cdk diff` sticky comment, not the TypeScript.
