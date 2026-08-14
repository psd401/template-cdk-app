import { RemovalPolicy, Stack, StackProps, Validations } from "aws-cdk-lib";
import { BlockPublicAccess, Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

/**
 * Exemplar stateful stack. One S3 bucket with the PSD secure defaults:
 * block public access, encryption at rest, SSL enforced, versioning, RETAIN.
 *
 * Keep stateful resources (buckets, tables, databases) in their own stack,
 * separate from stateless compute (08-iac.md).
 */
export class StorageStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dataBucket = new Bucket(this, "DataBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      // Stateful resource: RETAIN so a stack delete can never destroy data.
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Pre-approved acknowledgment (reviewed with this template): the exemplar
    // bucket ships without server access logging so the template stays a single
    // resource. Enable server access logging (serverAccessLogsBucket) and DELETE
    // this acknowledgment before storing real data. Any NEW acknowledge() in a
    // downstream repo requires human review before merge (08-iac.md).
    Validations.of(dataBucket).acknowledge({
      id: "AwsSolutions-S1",
      reason:
        "Template exemplar bucket; enable server access logging and remove this before storing real data.",
    });
  }
}
