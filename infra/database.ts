import { IS_DEPLOYED_STAGE, BRANCH_NAME } from './dns';
import { secret } from './secret';

// Create Neon provider with API key
const neonProvider = new neon.Provider('NeonProvider', {
    apiKey: secret.NeonApiKey.value,
});

const project =
    $app.stage === 'production'
        ? new neon.Project(
              'NeonProject',
              {
                  name: 'structa',
              },
              {
                  provider: neonProvider,
              }
          )
        : neon.Project.get(
              'NeonProject',
              secret.NeonProjectId.value,
              undefined,
              {
                  provider: neonProvider,
              }
          );

const branch =
    $app.stage !== 'production'
        ? new neon.Branch(
              'NeonBranch',
              {
                  name: BRANCH_NAME,
                  projectId: project.id,
                  parentId: project.defaultBranchId,
              },
              {
                  provider: neonProvider,
              }
          )
        : neon.Branch.get('NeonBranch', project.defaultBranchId, undefined, {
              provider: neonProvider,
          });

const endpoint =
    $app.stage !== 'production'
        ? new neon.Endpoint(
              'NeonEndpoint',
              {
                  projectId: project.id,
                  branchId: branch.id,
              },
              {
                  provider: neonProvider,
              }
          )
        : neon.Endpoint.get(
              'NeonEndpoint',
              project.defaultEndpointId,
              undefined,
              {
                  provider: neonProvider,
              }
          );

const role = new neon.Role(
    'NeonRole',
    {
        name: 'neondb-owner',
        projectId: project.id,
        branchId: branch.id,
    },
    {
        provider: neonProvider,
    }
);

const db = new neon.Database(
    'NeonDatabase',
    {
        name: 'neondb',
        projectId: project.id,
        branchId: branch.id,
        ownerName: role.name,
    },
    {
        provider: neonProvider,
    }
);

// Create a Linkable resource to use in your app
export const database = new sst.Linkable('Database', {
    properties: {
        username: role.name,
        password: role.password,
        host: endpoint.host,
        dbname: db.name,
        url: $interpolate`postgresql://${role.name}:${role.password}@${endpoint.host}/${db.name}?sslmode=require`,
    },
});
