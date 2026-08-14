import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { StorageStack } from "../lib/storage-stack";

function synth(): Template {
  const app = new App();
  const stack = new StorageStack(app, "StorageStack");
  return Template.fromStack(stack);
}

describe("StorageStack", () => {
  test("data bucket blocks all public access and encrypts at rest", () => {
    const template = synth();

    template.hasResourceProperties("AWS::S3::Bucket", {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          { ServerSideEncryptionByDefault: { SSEAlgorithm: "AES256" } },
        ],
      },
      VersioningConfiguration: { Status: "Enabled" },
    });
  });

  test("data bucket is retained on stack deletion", () => {
    const template = synth();

    template.hasResource("AWS::S3::Bucket", {
      DeletionPolicy: "Retain",
      UpdateReplacePolicy: "Retain",
    });
  });

  // Logical-ID pin (08-iac.md). WHY: the logical ID is CloudFormation's identity
  // for the resource. If a refactor (renaming the construct, moving it into a
  // nested construct) changes this ID, CloudFormation REPLACES the bucket —
  // for a stateful resource that means data loss. This test turns that silent
  // replacement into a loud, reviewable failure. If you change it on purpose,
  // say so in the PR body and plan the migration.
  test("data bucket logical ID is pinned (replacement of a stateful resource = data loss)", () => {
    const template = synth();

    const buckets = Object.keys(template.findResources("AWS::S3::Bucket"));
    expect(buckets).toEqual(["DataBucketE3889A50"]);
  });
});
