import { domain, DEV, dnsAdapter, IS_DEPLOYED_STAGE } from './dns';

export const email = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('Email', DEV)
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
export const personalEmail = !IS_DEPLOYED_STAGE
    ? sst.aws.Email.get('PersonalEmail', 'harrison@structa.so')
    : new sst.aws.Email('PersonalEmail', {
          sender: 'harrison@structa.so',
      });

export const reactEmail = new sst.x.DevCommand('EmailServer', {
    dev: {
        autostart: true,
        command: 'npm run dev:email',
    },
});
