import { domain, DEV, dnsAdapter } from './dns';

const isLocal = $app.stage !== 'dev' && $app.stage !== 'production';
const devDomain = DEV;

export const email = isLocal
    ? sst.aws.Email.get('Email', devDomain)
    : new sst.aws.Email('Email', {
          sender: domain,
          dns: dnsAdapter,
      });

export const marketingEmail =
    $app.stage === 'production' &&
    new sst.aws.Email('MarketingEmail', {
        sender: 'mail.structa.so',
        dns: dnsAdapter,
    });

// TEMP this creates an identity in AWS SES so we can send emails to it in sandbox mode
export const personalEmail = isLocal
    ? sst.aws.Email.get('PersonalEmail', 'harrison@structa.so')
    : new sst.aws.Email('PersonalEmail', {
          sender: 'harrison@structa.so',
          dns: dnsAdapter,
      });

export const reactEmail = new sst.x.DevCommand('EmailServer', {
    dev: {
        autostart: true,
        command: 'npm run dev:email',
    },
});
