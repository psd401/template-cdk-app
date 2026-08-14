#!/usr/bin/env node
import { App, Tags, Validations } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";

import { StorageStack } from "../lib/storage-stack";

const app = new App();

// cdk-nag v3: AwsSolutions pack wired through CDK's policy-validation framework
// (08-iac.md). Violations fail synth. Suppressions are Validations.of(x).acknowledge(
// { id, reason }) on the offending construct — every NEW acknowledge() is a
// mandatory human-review item; agents may propose one, never merge one.
Validations.of(app).addPlugins(new AwsSolutionsChecks(app, { verbose: true }));

// District tag set (08-iac.md) — applied mechanically at the app level, never
// per-resource. Fill in the CHANGEME values during the first 10 minutes.
Tags.of(app).add("psd:application", "CHANGEME-application");
Tags.of(app).add("psd:environment", process.env.PSD_ENVIRONMENT ?? "dev");
Tags.of(app).add("psd:owner", "technology-services");
Tags.of(app).add("psd:managed-by", "cdk");
Tags.of(app).add("psd:repo", "PSD401/CHANGEME-repo");
// One of: public | internal | student-pii
Tags.of(app).add("psd:data-classification", "internal");

new StorageStack(app, "StorageStack", {
  // Generated names, not physical names; us-west-2 is pinned org-wide via SCP.
  env: { region: "us-west-2" },
});
