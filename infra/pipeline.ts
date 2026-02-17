/**
 * GitHub Actions OIDC Pipeline Infrastructure
 *
 * Creates the AWS resources needed to allow GitHub Actions to deploy
 * to this AWS account without storing long-lived credentials.
 *
 * Resources:
 * - IAM OIDC Identity Provider for GitHub (created in production, referenced in other stages)
 * - IAM Role for GitHub Actions deployments (per-stage)
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

// GitHub's OIDC thumbprint (stable, rarely changes)
const GITHUB_OIDC_THUMBPRINT = '6938fd4d98bab03faadb97b34396831e3780aea1';

// Repository in format: owner/repo
const REPOSITORY = 'propagateco/structa';

// OIDC Provider: Create in production, reference in other stages
// The OIDC provider is an account-level resource that should only be created once
const githubOidcProvider =
	$app.stage === 'production'
		? new aws.iam.OpenIdConnectProvider('GitHubActionsOIDC', {
				url: GITHUB_OIDC_URL,
				clientIdLists: ['sts.amazonaws.com'],
				thumbprintLists: [GITHUB_OIDC_THUMBPRINT],
			})
		: aws.iam.getOpenIdConnectProviderOutput({
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
					"StringLike": {
						"token.actions.githubusercontent.com:sub": "repo:${REPOSITORY}:*"
					},
					"StringEquals": {
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
