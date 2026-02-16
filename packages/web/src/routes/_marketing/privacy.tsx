import { createFileRoute } from "@tanstack/react-router";
import { TexturedSection } from "@/components/layout";

export const Route = createFileRoute("/_marketing/privacy")({
	component: PrivacyPolicy,
});

function PrivacyPolicy() {
	return (
		<TexturedSection
			showTopDivider={false}
			showBottomDivider={false}
			showTopDiamonds={true}
			showGrid={false}
		>
			<div className="col-span-2 md:col-span-8">
				<header className="my-12 md:my-16 space-y-4">
					<h1 className="font-heading text-4xl md:text-5xl">Privacy Policy</h1>
					<div className="text-muted-foreground">
						Last updated: February 15, 2026
					</div>
				</header>

				<div className="prose prose-lg max-w-none mb-12 md:mb-16 dark:prose-invert">
					<p>
						Propagate Digital Limited ("we", "us", or "our") operates the
						Structa tool including our website, web application, mobile app, and
						any integrations such as APIs and MCP servers (collectively, the
						"Service").
					</p>

					<p>
						We take user privacy seriously and collect only the data necessary
						to operate and improve the Service.
					</p>

					<h2 id="information-we-collect">Information We Collect</h2>

					<h3>1. Account Data</h3>
					<p>When you create an account, we collect:</p>
					<ul>
						<li>Your name</li>
						<li>Email address</li>
						<li>Password (encrypted and stored securely)</li>
					</ul>

					<h3>2. Product Usage Data (PostHog)</h3>
					<p>
						We use analytics such as <strong>PostHog</strong> to collect basic
						product analytics, such as:
					</p>
					<ul>
						<li>Feature usage</li>
						<li>Interaction patterns</li>
						<li>Performance metrics</li>
						<li>General device and browser information</li>
					</ul>
					<p>
						This data helps us understand how the Service is used and improve
						product quality. We do <strong>not</strong> use analytics data for
						advertising.
					</p>

					<h3>3. Session Data and Logs</h3>
					<p>In order to:</p>
					<ul>
						<li>Investigate bugs</li>
						<li>Respond to support requests</li>
						<li>Improve reliability and performance</li>
					</ul>
					<p>we may review:</p>
					<ul>
						<li>Application logs</li>
						<li>Error reports</li>
						<li>Limited session data</li>
					</ul>
					<p>
						Access to this data is restricted and used only for product quality
						and support purposes.
					</p>

					<h3>4. Property and Renovation Data</h3>
					<p>To provide personalized renovation guidance, we collect:</p>
					<ul>
						<li>Property address and location</li>
						<li>Property type (terraced, semi-detached, detached, flat)</li>
						<li>Build year</li>
						<li>
							Property characteristics (ceiling heights, wall construction,
							floor types)
						</li>
						<li>
							Uploaded documents (surveys, architectural plans, quotes, photos,
							floor plans)
						</li>
						<li>Renovation goals, timeline, and budget information</li>
					</ul>
					<p>
						This data is used to provide context-aware advice through The Clerk
						AI feature and to generate accurate cost estimates.
					</p>

					<h3>5. AI Interaction Data</h3>
					<p>When you use The Clerk AI assistant, we process:</p>
					<ul>
						<li>Your questions and prompts</li>
						<li>AI responses and recommendations</li>
						<li>Context from your property data and uploaded documents</li>
					</ul>

					<h3>6. Payment Data</h3>
					<p>
						Payment information is processed by our payment provider. We do not
						store full payment card details. We may retain:
					</p>
					<ul>
						<li>Billing address</li>
						<li>Transaction history</li>
						<li>Last four digits of payment method (for identification)</li>
					</ul>

					<h2 id="what-we-do-not-do">What We Do Not Do</h2>
					<ul>
						<li>
							We <strong>do not sell</strong> user data
						</li>
						<li>
							We <strong>do not share</strong> data with third parties for
							advertising or marketing
						</li>
						<li>
							We <strong>do not use</strong> your data to train AI models
							without your explicit consent
						</li>
					</ul>

					<h2 id="how-we-use-your-data">How We Use Your Data</h2>
					<p>We use your personal data to:</p>
					<ul>
						<li>Provide, maintain, and improve the Service</li>
						<li>
							Process your documents and property data to generate personalized
							advice
						</li>
						<li>Enable AI features through The Clerk</li>
						<li>
							Facilitate collaboration between you and your invited Partners
						</li>
						<li>Generate Project Packs and material lists</li>
						<li>Process payments and manage subscriptions</li>
						<li>Respond to support requests and investigate bugs</li>
						<li>Comply with legal obligations</li>
						<li>
							Send service-related communications (account updates, feature
							announcements)
						</li>
					</ul>

					<h2 id="legal-basis">Legal Basis for Processing (UK GDPR)</h2>
					<p>We process personal data under the following legal bases:</p>
					<ul>
						<li>
							<strong>Contract performance:</strong> Processing necessary to
							provide the Service you've requested
						</li>
						<li>
							<strong>Legitimate interests:</strong> To improve our Service,
							prevent fraud, and ensure security
						</li>
						<li>
							<strong>Consent:</strong> Where required for specific features or
							marketing communications
						</li>
						<li>
							<strong>Legal obligation:</strong> To comply with applicable laws
							and regulations
						</li>
					</ul>

					<h2 id="ai-features">AI Features and Data Processing</h2>
					<p>
						The Clerk AI assistant processes your property data, uploaded
						documents, and questions to provide renovation guidance. Key points:
					</p>
					<ul>
						<li>
							<strong>Third-party AI providers:</strong> We use services such as
							OpenAI to process AI requests. These providers process data on our
							behalf and are bound by data protection agreements.
						</li>
						<li>
							<strong>No automated decisions:</strong> AI recommendations are
							informational only. We do not make solely automated decisions that
							significantly affect you.
						</li>
						<li>
							<strong>Human review available:</strong> You can request human
							review of any AI-processed outputs by contacting support.
						</li>
						<li>
							<strong>Data minimization:</strong> We only send relevant context
							to AI providers necessary to answer your specific questions.
						</li>
					</ul>

					<h2 id="data-sharing">Data Sharing</h2>
					<p>We only share data with:</p>
					<ul>
						<li>
							<strong>AI providers:</strong> To process your questions and
							documents (e.g., OpenAI)
						</li>
						<li>
							<strong>PostHog:</strong> For product analytics (as described
							above)
						</li>
						<li>
							<strong>Payment processors:</strong> To process subscription
							payments
						</li>
						<li>
							<strong>Cloud infrastructure providers:</strong> To host and
							operate the Service
						</li>
						<li>
							<strong>Your invited Partners:</strong> When you share a
							workspace, Partners can see shared content, chat history, and
							documents
						</li>
						<li>
							<strong>Tradespeople:</strong> Only when you explicitly choose to
							share a Project Pack
						</li>
					</ul>
					<p>
						All service providers are contractually bound to protect your data
						and process it only on our behalf.
					</p>

					<h2 id="international-transfers">International Data Transfers</h2>
					<p>
						Some of our service providers may be located outside the UK and EEA.
						Where this occurs, we ensure appropriate safeguards are in place,
						including:
					</p>
					<ul>
						<li>
							Standard contractual clauses approved by the UK and EU authorities
						</li>
						<li>Data protection agreements with all processors</li>
						<li>
							Selection of providers with strong security and privacy practices
						</li>
					</ul>

					<h2 id="data-security">Data Security</h2>
					<p>
						We use industry-standard security practices to protect user data,
						including:
					</p>
					<ul>
						<li>Secure cloud infrastructure</li>
						<li>Limited internal access controls</li>
						<li>Encrypted connections (HTTPS/TLS)</li>
						<li>Encrypted storage of sensitive data</li>
						<li>Regular security reviews</li>
					</ul>
					<p>
						However, no system can be guaranteed to be 100% secure. If you
						believe your account has been compromised, please contact us
						immediately.
					</p>

					<h2 id="data-retention">Data Retention</h2>
					<p>We retain data only as long as necessary to:</p>
					<ul>
						<li>Operate and improve the Service</li>
						<li>Comply with legal obligations</li>
						<li>Resolve disputes</li>
						<li>Respond to support requests</li>
					</ul>
					<p>
						When you close your account, we will delete your personal data
						within a reasonable timeframe, unless retention is required for
						legal purposes. Some data may be retained in anonymized or
						aggregated form for analytics.
					</p>

					<h2 id="your-rights">Your Rights (UK GDPR)</h2>
					<p>Under the UK GDPR, you have the following rights:</p>
					<ul>
						<li>
							<strong>Right of access:</strong> Request a copy of your personal
							data
						</li>
						<li>
							<strong>Right to rectification:</strong> Request correction of
							inaccurate data
						</li>
						<li>
							<strong>Right to erasure:</strong> Request deletion of your
							personal data ("right to be forgotten")
						</li>
						<li>
							<strong>Right to restrict processing:</strong> Request that we
							limit how we use your data
						</li>
						<li>
							<strong>Right to data portability:</strong> Request your data in a
							portable format
						</li>
						<li>
							<strong>Right to object:</strong> Object to processing based on
							legitimate interests
						</li>
						<li>
							<strong>Rights related to automated decision-making:</strong>{" "}
							Request human review of AI-generated outputs
						</li>
						<li>
							<strong>Right to withdraw consent:</strong> Where processing is
							based on consent, you can withdraw it at any time
						</li>
					</ul>
					<p>
						To exercise any of these rights, contact us at{" "}
						<a href="mailto:support@structa.so">support@structa.so</a>.
					</p>
					<p>
						If you are not satisfied with how we handle your request, you have
						the right to lodge a complaint with the Information Commissioner's
						Office (ICO) at <a href="https://ico.org.uk">ico.org.uk</a>.
					</p>

					<h2 id="childrens-privacy">Children's Privacy</h2>
					<p>
						The Service is not intended for users under 18 years of age. We do
						not knowingly collect personal data from children. If you believe a
						child has provided us with personal data, please contact us
						immediately.
					</p>

					<h2 id="changes-to-this-policy">Changes to This Policy</h2>
					<p>
						We may update this Privacy Policy from time to time. Changes will be
						posted on this page, and the "Last updated" date will be revised.
						For material changes, we will provide notice via email or through
						the Service.
					</p>
					<p>
						We encourage you to review this Privacy Policy periodically to stay
						informed about how we are protecting your data.
					</p>

					<h2 id="contact-us">Contact Us</h2>
					<p>
						If you have questions about this Privacy Policy or our data
						practices, contact us at:
					</p>
					<p>
						<strong>Propagate Digital Limited</strong>
						<br />
						<strong>Contact:</strong> Harrison King
						<br />
						<strong>Address:</strong> 5 Mylne Square, Wokingham, United Kingdom
						<br />
						<strong>Email:</strong>{" "}
						<a href="mailto:support@structa.so">support@structa.so</a>
						<br />
						<strong>Instagram DM:</strong>{" "}
						<a
							href="https://instagram.com/lifewithcharacter"
							target="_blank"
							rel="noopener noreferrer"
						>
							@lifewithcharacter
						</a>
					</p>
				</div>
			</div>
		</TexturedSection>
	);
}
