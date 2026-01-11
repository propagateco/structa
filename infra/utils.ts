import * as path from 'path';
import * as fs from 'fs';

export function createResourceName(resourceName: string): string {
	return `${$app.name}-${$app.stage}-${resourceName}`;
}

export function getPathToFunction(functionName: string): string {
	const projectRoot = process.cwd();
	const sourcePath = path.join(projectRoot, `packages/backend/src/functions/${functionName}`);
	if (fs.existsSync(sourcePath)) {
		return sourcePath;
	}
	return path.join(projectRoot, `.sst/packages/backend/src/functions/${functionName}`);
}
