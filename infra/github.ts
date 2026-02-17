/**
 * GitHub Actions OIDC Infrastructure
 *
 * Creates IAM resources for GitHub Actions deployments.
 * Only permanent stages (dev, production) get OIDC providers and roles.
 */

import { IS_DEPLOYED_STAGE } from './dns';
import { createResourceName } from './utils';

// GitHub's OIDC configuration
const GITHUB_OIDC_URL = 'https://token.actions.githubusercontent.com';
const GITHUB_OIDC_THUMBPRINTS = [
	'6938fd4d98bab03faadb97b34396831e3780aea1',
	'1c58a3a8518e8759bf075b76b750d4f2df264fcd',
];

// Repository in format: owner/repo
const REPOSITORY = 'propagateco/structa';

// Only create OIDC resources for permanent stages (dev, production)
if (IS_DEPLOYED_STAGE) {
	// Reference existing OIDC provider (created by SST auto-deploy or previous setup)
	// Each AWS account has its own provider at account level
	const github = aws.iam.getOpenIdConnectProviderOutput({
		url: GITHUB_OIDC_URL,
	});

	const githubRole = new aws.iam.Role('GitHubActionsDeploy', {
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

	new aws.iam.RolePolicyAttachment('GitHubActionsDeployPolicy', {
		policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
		role: githubRole.name,
	});
}
