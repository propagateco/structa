import { DEV, dnsAdapter, IS_DEPLOYED_STAGE } from './dns';

// Helper to determine subdomain based on stage
const getEmailSubdomain = (subdomain: string): string => {
    if ($app.stage === 'production') return `${subdomain}.structa.so`;
    if ($app.stage === 'dev') return `${subdomain}.dev.structa.so`;
    // Personal stages use dev subdomain for simplicity
    return `${subdomain}.dev.structa.so`;
};

// Authentication emails (sign-in OTP, email verification, password reset)
export const authEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('AuthEmail', DEV)
    : new sst.aws.Email('AuthEmail', {
          sender: getEmailSubdomain('auth'),
          dns: dnsAdapter,
      });

// Notification emails (onboarding, account alerts - templates to be created later)
export const notifyEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('NotifyEmail', DEV)
    : new sst.aws.Email('NotifyEmail', {
          sender: getEmailSubdomain('notify'),
          dns: dnsAdapter,
      });

// Marketing subdomain (DNS records for Loops.so integration)
export const marketingEmail =
    $app.stage === 'production' &&
    new sst.aws.Email('MarketingEmail', {
        sender: 'mail.structa.so',
        dns: dnsAdapter,
    });

// Dev-only: Personal email for sandbox testing (remove after production access)
export const personalEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('PersonalEmail', 'harrison@structa.so')
    : undefined;

// Local email preview server (react-email)
export const reactEmail = new sst.x.DevCommand('EmailServer', {
    dev: {
        autostart: true,
        command: 'npm run dev:email',
    },
});
