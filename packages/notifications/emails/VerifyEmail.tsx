import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import { FormattedType } from '../utils/text';

interface VerifyEmailProps {
    type: 'sign-in' | 'email-verification' | 'forget-password';
    validationCode: string;
    location?: { city: string; country: string } | null;
}

export const VerifyEmail = ({
    type,
    validationCode,
    location,
}: VerifyEmailProps) => {
    const formattedType = new FormattedType(type);
    return (
        <Html>
            <Head>
                <style>{`
                    @media only screen and (max-width: 600px) {
                        .border-container {
                            padding: 2rem !important;
                            margin: 2.5rem auto !important;
                            max-width: 300px !important;
                        }
                         .container {
                        }
                        .heading {
                            font-size: 18px !important;
                            padding: 12px 0 !important;
                        }
                        .paragraph {
                            font-size: 11px !important;
                            margin: 15px 0 !important;
                        }
                        .footer-text {
                            font-size: 8px !important;
                            line-height: 14px !important;

                        }
                        .footer-link {
                            font-size: 8px !important;
                        }
                        .hr {
                            margin: 30px 0 !important;
                        }
                        .code-container {
                            width: 150px !important;
                        }
                        .code {
                            font-size: 18px !important;
                            letter-spacing: 8px !important;
                            line-height: 36px !important;
                            padding: 6px 0 !important;
                        }
                        .logo {
                            height: 20px !important;
                        }
                    }
                `}</style>
            </Head>
            <Preview>
                {validationCode} - Structa{' '}
                {formattedType.toUpperCaseHyphenated()} Verification
            </Preview>
            <Body style={main}>
                <Container style={borderContainer} className="border-container">
                    <Container style={container}>
                        <Img
                            src={'https://structa.so/logo-light.svg'}
                            alt="Structa Logo"
                            style={logo}
                            className="logo"
                        />
                        <Heading style={heading} className="heading">
                            Verify your email to {formattedType.toBody()} to{' '}
                            <span style={{ fontWeight: 600 }}>Structa</span>
                        </Heading>

                        <Text style={paragraph} className="paragraph">
                            {location ? (
                                <>
                                    We have received a {formattedType.toBody()}{' '}
                                    attempt from{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        {location.city}, {location.country}
                                    </span>
                                    .
                                </>
                            ) : (
                                `We have received a ${formattedType.toHyphenated()} attempt.`
                            )}
                            <br />
                            <br />
                            To complete the {formattedType.toHyphenated()}{' '}
                            process; enter the 6-digit code in the original
                            window:
                        </Text>

                        <div style={{ padding: '10px 0' }}>
                            <Section
                                style={codeContainer}
                                className="code-container"
                            >
                                <Text style={code} className="code">
                                    {validationCode}
                                </Text>
                            </Section>
                        </div>

                        <Hr style={hr} className="hr" />
                        <Text style={footerText} className="footer-text">
                            If you didn't attempt to {formattedType.toBody()}{' '}
                            but received this email, or if the location doesn't
                            match, please ignore this email. Don't share or
                            forward the 6-digit code with anyone. You are
                            receiving this email because you signed up to{' '}
                            <Link
                                href="https://structa.so"
                                style={footerTextLink}
                                className="footer-link"
                            >
                                Structa
                            </Link>
                            .
                        </Text>
                    </Container>
                </Container>
            </Body>
        </Html>
    );
};

VerifyEmail.PreviewProps = {
    type: 'sign-in',
    validationCode: '561829',
    location: { city: 'London', country: 'United Kingdom' },
} as VerifyEmailProps;

const logo = {
    width: 'auto',
    height: 24,
};

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    maxWidth: '560px',
};

const borderContainer = {
    border: '1px solid #dfe1e4',
    borderRadius: '8px',
    padding: '4rem',
    margin: '4rem auto',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#091717',
    padding: '17px 0',
};

const paragraph = {
    margin: '15px 0',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#091717',
};

const footerText = {
    fontSize: '12px',
    color: '#737373',
};

const footerTextLink = {
    fontSize: '12px',
    fontWeight: 500,
    color: '#737373',
    textDecoration: 'underline',
    textDecorationColor: '#737373',
    textUnderlineOffset: '4px',
};

const hr = {
    borderColor: '#dfe1e4',
    margin: '42px 0 42px',
};

const codeContainer = {
    background: '#F5F5F5',
    borderRadius: '8px',
    verticalAlign: 'center',
    width: '180px',
};

const code = {
    color: '#091717',
    display: 'inline-block',
    fontFamily: "Menlo, Monaco, 'HelveticaNeue-Bold', monospace",
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '10px',
    lineHeight: '40px',
    margin: '0 auto',
    padding: '8px 0',
    width: '100%',
    textAlign: 'center' as const,
};

export default VerifyEmail;
