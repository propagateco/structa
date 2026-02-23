import { dnsAdapter, IS_DEPLOYED_STAGE } from './dns';

// Helper to determine subdomain based on stage
const getEmailSubdomain = (subdomain: string): string => {
    if ($app.stage === 'production') return `${subdomain}.structa.so`;
    if ($app.stage === 'dev') return `${subdomain}.dev.structa.so`;
    // Personal stages use dev subdomain for simplicity
    return `${subdomain}.dev.structa.so`;
};

// Authentication emails
export const authEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('AuthEmail', getEmailSubdomain('auth'))
    : new sst.aws.Email('AuthEmail', {
          sender: getEmailSubdomain('auth'),
          dns: dnsAdapter,
      });

// Notification emails
export const notifyEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('NotifyEmail', getEmailSubdomain('notify'))
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

// Personal identity email for sandbox testing (remove after production access)
export const personalEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('PersonalEmail', 'harrison@structa.so')
    : new sst.aws.Email('PersonalEmail', {
          sender: 'harrison@structa.so',
      });

// Local email preview server (react-email)
export const reactEmail = new sst.x.DevCommand('EmailServer', {
    dev: {
        autostart: true,
        command: 'npm run dev:email',
    },
});
