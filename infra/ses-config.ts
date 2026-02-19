import { IS_DEPLOYED_STAGE } from './dns';
import { emailBounceTopic, emailComplaintTopic } from './sns';

// SES Configuration Set for tracking email events
export const emailConfigSet = IS_DEPLOYED_STAGE
    ? new aws.sesv2.ConfigurationSet('TransactionalEmailConfigSet', {
          configurationSetName: 'transactional-emails',
      })
    : undefined;

// Link bounce events to SNS topic
if (IS_DEPLOYED_STAGE && emailConfigSet && emailBounceTopic) {
    new aws.sesv2.ConfigurationSetEventDestination('BounceEventDestination', {
        configurationSetName: emailConfigSet.configurationSetName,
        eventDestinationName: 'bounce-notifications',
        eventDestination: {
            enabled: true,
            matchingEventTypes: ['BOUNCE'],
            snsDestination: {
                topicArn: emailBounceTopic.arn,
            },
        },
    });
}

// Link complaint events to SNS topic
if (IS_DEPLOYED_STAGE && emailConfigSet && emailComplaintTopic) {
    new aws.sesv2.ConfigurationSetEventDestination('ComplaintEventDestination', {
        configurationSetName: emailConfigSet.configurationSetName,
        eventDestinationName: 'complaint-notifications',
        eventDestination: {
            enabled: true,
            matchingEventTypes: ['COMPLAINT'],
            snsDestination: {
                topicArn: emailComplaintTopic.arn,
            },
        },
    });
}
