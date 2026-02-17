/**
 * GitHub Actions OIDC Infrastructure
 *
 * Creates IAM resources for GitHub Actions deployments.
 */

import { createResourceName } from './utils';

// GitHub's OIDC configuration
const GITHUB_OIDC_URL = 'https://token.actions.githubusercontent.com';
const GITHUB_OIDC_THUMBPRINTS = [
	'6938fd4d98bab03faadb97b34396831e3780aea1',
	'1c58a3a8518e8759bf075b76b750d4f2df264fcd',
];

// Repository in format: owner/repo
const REPOSITORY = 'propagateco/structa';

// Create OIDC provider - SST will track this resource
const github = new aws.iam.OpenIdConnectProvider(createResourceName('GitHubOIDC'), {
	url: GITHUB_OIDC_URL,
	clientIdLists: ['sts.amazonaws.com'],
	thumbprintLists: GITHUB_OIDC_THUMBPRINTS,
});

// Create IAM role that GitHub Actions can assume
const githubRole = new aws.iam.Role(createResourceName('GitHubActionsDeploy'), {
	assumeRolePolicy: {
		Version: '2012-10-17',
		Statement: [
			{
				Effect: 'Allow',
				Principal: {
					Federated: github.arn,
				},
				Action: 'sts:AssumeRoleWithWebIdentity',
				Condition: {
					StringLike: github.url.apply((url) => ({
						[`${url}:sub`]: `repo:${REPOSITORY}:*`,
					})),
				},
			},
		],
	},
});

// Attach AdministratorAccess policy to the role
new aws.iam.RolePolicyAttachment(createResourceName('GitHubActionsDeployPolicy'), {
	policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
	role: githubRole.name,
});
