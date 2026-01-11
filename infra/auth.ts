import { domain, NODE_TLS_REJECT_UNAUTHORIZED } from './dns';
import { database } from './database';
import { email } from './email';
import { secret } from './secret';

export const auth = new sst.aws.Auth('Auth', {
	authorizer: {
		handler: 'packages/backend/src/auth/issuer.handler',
		link: [email, secret.GoogleClientId, NODE_TLS_REJECT_UNAUTHORIZED, database],
		environment: {
			NODE_TLS_REJECT_UNAUTHORIZED: NODE_TLS_REJECT_UNAUTHORIZED.value,
		},
	},
	domain: {
		name: 'auth.' + domain,
	},
});
