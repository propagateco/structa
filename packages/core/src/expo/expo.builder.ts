import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Resource } from 'sst';

export class ExpoBuilder {
  constructor(private projectPath: string, private slug: string) {}
  
  async initializeProject(): Promise<string> {
    console.log(`Initializing EAS project at ${this.projectPath}`);
    
    try {
      // Run EAS project init
      const result = await this.runEasCommand(['project:init', '--non-interactive']);
      
      // Extract project ID from stdout
      const projectIdMatch = result.stdout.match(/Project ID: ([a-f0-9-]+)/);
      if (!projectIdMatch) {
        // Try alternative regex patterns for different EAS CLI output formats
        const altMatch = result.stdout.match(/projectId[\"']?\s*:\s*[\"']([a-f0-9-]+)[\"']/);
        if (!altMatch) {
          console.log('EAS CLI output:', result.stdout);
          throw new Error('Could not extract project ID from EAS output');
        }
        const projectId = altMatch[1];
        await this.updateTenantConfigWithProjectId(projectId);
        return projectId;
      }
      
      const projectId = projectIdMatch[1];
      
      // Update the tenant config with the project ID
      await this.updateTenantConfigWithProjectId(projectId);
      
      return projectId;
    } catch (error) {
      console.error('EAS project init failed:', error);
      throw error;
    }
  }
  
  private async updateTenantConfigWithProjectId(projectId: string): Promise<void> {
    const configPath = join(this.projectPath, 'configs', `${this.slug}.js`);
    const configContent = await fs.readFile(configPath, 'utf-8');
    
    // Simple string replacement for the projectId
    const updatedContent = configContent.replace(
      "projectId: '',",
      `projectId: '${projectId}',`
    );
    
    await fs.writeFile(configPath, updatedContent);
  }
  
  private async runEasCommand(args: string[]): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn('eas', args, {
        cwd: this.projectPath,
        env: {
          ...process.env,
          EXPO_TOKEN: Resource.ExpoToken.value, // Use SST secret
        },
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`EAS command failed with code ${code}: ${stderr}`));
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}