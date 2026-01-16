import { promises as fs } from 'fs';
import { join } from 'path';

export async function generateTenantProject({
  userId,
  appName,
  slug,
  branding
}: {
  userId: string;
  appName: string;
  slug: string;
  branding: any;
}) {
  const sourceDir = join(process.cwd(), 'packages/multitenant-expo');
  const targetDir = join(process.cwd(), 'packages/expo-projects', `tenant-${userId}`);
  
  // 1. Copy the entire multitenant-expo template
  await fs.cp(sourceDir, targetDir, { recursive: true });
  
  // 2. Generate tenant config file
  const tenantConfig = {
    name: appName,
    slug: slug,
    bundleIdentifier: `com.structa.${slug}`,
    package: `com.structa.${slug}`,
    icon: `./assets/${slug}/icon.png`,
    adaptiveIcon: {
      foregroundImage: `./assets/${slug}/adaptive-icon.png`,
      backgroundColor: branding?.backgroundColor || '#ffffff'
    },
    splash: {
      image: `./assets/${slug}/splash.png`,
      resizeMode: 'contain',
      backgroundColor: branding?.backgroundColor || '#ffffff'
    },
    eas: {
      projectId: '', // Will be filled after EAS init
    },
    appdefinition: {
      colors: {
        text: {
          dark: branding?.darkText || '#ffffff',
          light: branding?.lightText || '#000000',
        },
        primary: branding?.primaryColor,
        secondary: branding?.secondaryColor,
      }
    }
  };
  
  // 3. Write tenant config
  await fs.writeFile(
    join(targetDir, 'configs', `${slug}.js`),
    `module.exports = ${JSON.stringify(tenantConfig, null, 2)};`
  );
  
  // 4. Update eas.json to include this tenant
  const easConfig = {
    "cli": { "version": ">= 10.0.2" },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "preview": {
        "distribution": "internal"
      },
      [slug]: {
        "env": {
          "TENANT": slug
        }
      }
    },
    "submit": {
      "production": {}
    }
  };
  
  await fs.writeFile(
    join(targetDir, 'eas.json'),
    JSON.stringify(easConfig, null, 2)
  );
  
  // 5. Generate basic assets (placeholder for now)
  const assetsDir = join(targetDir, 'assets', slug);
  await fs.mkdir(assetsDir, { recursive: true });
  
  // Copy default assets for now (you can enhance this later with dynamic generation)
  await fs.cp(
    join(sourceDir, 'assets/first-tenant'),
    assetsDir,
    { recursive: true }
  );
  
  return targetDir;
}