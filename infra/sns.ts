import { IS_DEPLOYED_STAGE } from './dns';

// SNS topic for SES bounce notifications (production/dev only)
export const emailBounceTopic = IS_DEPLOYED_STAGE
    ? new aws.sns.Topic('EmailBounceTopic', {
          name: `${$app.stage}-ses-bounce`,
          tags: {
              Environment: $app.stage,
              Project: 'structa',
          },
      })
    : undefined;

// SNS topic for SES complaint notifications (production/dev only)
export const emailComplaintTopic = IS_DEPLOYED_STAGE
    ? new aws.sns.Topic('EmailComplaintTopic', {
          name: `${$app.stage}-ses-complaint`,
          tags: {
              Environment: $app.stage,
              Project: 'structa',
          },
      })
    : undefined;

// Email subscriptions for bounce notifications
if (IS_DEPLOYED_STAGE && emailBounceTopic) {
    new aws.sns.TopicSubscription('BounceEmailSubscription', {
        topic: emailBounceTopic.arn,
        protocol: 'email',
        endpoint: 'harrison@structa.so',
    });
}

// Email subscriptions for complaint notifications
if (IS_DEPLOYED_STAGE && emailComplaintTopic) {
    new aws.sns.TopicSubscription('ComplaintEmailSubscription', {
        topic: emailComplaintTopic.arn,
        protocol: 'email',
        endpoint: 'harrison@structa.so',
    });
}
