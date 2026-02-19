/**
 * GitHub Actions OIDC Infrastructure
 *
 * Creates IAM resources for GitHub Actions deployments.
 * - For deployed stages (dev, production): Creates new resources
 * - For personal/PR stages: References existing dev resources
 */

import { createResourceName } from './utils';
import { IS_DEPLOYED_STAGE } from './dns';

// GitHub's OIDC configuration
const GITHUB_OIDC_URL = 'https://token.actions.githubusercontent.com';
const GITHUB_OIDC_THUMBPRINTS = [
	'6938fd4d98bab03faadb97b34396831e3780aea1',
	'1c58a3a8518e8759bf075b76b750d4f2df264fcd',
];

// Repository in format: owner/repo
const REPOSITORY = 'propagateco/structa';

// OIDC Provider - only create for deployed stages, otherwise reference dev's
const github = IS_DEPLOYED_STAGE
	? new aws.iam.OpenIdConnectProvider(createResourceName('GitHubOIDC'), {
			url: GITHUB_OIDC_URL,
			clientIdLists: ['sts.amazonaws.com'],
			thumbprintLists: GITHUB_OIDC_THUMBPRINTS,
		})
	: aws.iam.OpenIdConnectProvider.get(
			createResourceName('GitHubOIDC'),
			`arn:aws:iam::${aws.getCallerIdentityOutput({}).accountId}:oidc-provider/token.actions.githubusercontent.com`
		);

// Create IAM role that GitHub Actions can assume
const githubRole = new aws.iam.Role(createResourceName('GitHubActionsDeploy'), {
	name: createResourceName('GitHubActionsDeploy'),
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
