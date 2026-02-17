/**
 * GitHub Actions OIDC Pipeline Infrastructure
 *
 * Creates the AWS resources needed to allow GitHub Actions to deploy
 * to this AWS account without storing long-lived credentials.
 *
 * Resources:
 * - IAM OIDC Identity Provider for GitHub (shared across all stages)
 * - IAM Role for GitHub Actions deployments (per-stage)
 *
 * Trust Policy by Stage:
 * - production: Only allows deployments from 'production' branch
 * - dev: Only allows deployments from 'dev' branch
 * - personal/*: Allows deployments from any branch (for testing)
 *
 * Usage in GitHub Actions:
 * ```yaml
 * - uses: aws-actions/configure-aws-credentials@v4
 *   with:
 *     role-to-assume: arn:aws:iam::571512465874:role/structa-dev-GitHubActionsDeploy
 *     aws-region: eu-west-2
 * ```
 */

import { createResourceName } from './utils';

// GitHub's OIDC token endpoint
const GITHUB_OIDC_URL = 'https://token.actions.githubusercontent.com';

// Repository in format: owner/repo
const REPOSITORY = 'propagateco/structa';

// Determine the trust policy subject condition based on stage
// - production: restrict to production branch only
// - dev: restrict to dev branch only
// - personal stages: allow any branch (for developer testing)
const getTrustPolicySubject = (): string => {
	const stage = $app.stage;

	if (stage === 'production') {
		return `repo:${REPOSITORY}:ref:refs/heads/production`;
	}

	if (stage === 'dev') {
		return `repo:${REPOSITORY}:ref:refs/heads/dev`;
	}

	// Personal stages - allow any branch for flexibility
	return `repo:${REPOSITORY}:*`;
};

// Reference the existing GitHub OIDC Identity Provider (account-level, shared across stages)
const githubOidcProvider = aws.iam.getOpenIdConnectProviderOutput({
	url: GITHUB_OIDC_URL,
});

// Create the IAM role that GitHub Actions can assume
const deployRole = new aws.iam.Role(createResourceName('GitHubActionsDeploy'), {
	description: `Role for GitHub Actions to deploy SST infrastructure (${ $app.stage } stage)`,
	assumeRolePolicy: githubOidcProvider.arn.apply((arn) => `{
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Principal": {
					"Federated": "${arn}"
				},
				"Action": "sts:AssumeRoleWithWebIdentity",
				"Condition": {
					"StringEquals": {
						"token.actions.githubusercontent.com:sub": "${getTrustPolicySubject()}",
						"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
					}
				}
			}
		]
	}`),
});

// Attach AdministratorAccess policy to the role
// TODO: Consider scoping down to least-privilege permissions for production
const adminPolicyAttachment = new aws.iam.RolePolicyAttachment(
	createResourceName('GitHubActionsDeployAdmin'),
	{
		role: deployRole.name,
		policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
	}
);

// Export the role ARN for use in GitHub Actions
export const githubActionsRoleArn = deployRole.arn;
export const oidcProviderArn = githubOidcProvider.arn;
