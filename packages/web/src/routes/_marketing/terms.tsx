import { createFileRoute } from "@tanstack/react-router";
import { TexturedSection } from "@/components/layout";

export const Route = createFileRoute("/_marketing/terms")({
	component: TermsOfService,
});

function TermsOfService() {
	return (
		<TexturedSection
			showTopDivider={false}
			showBottomDivider={false}
			showTopDiamonds={true}
			showGrid={false}
		>
			<div className="col-span-2 md:col-span-8">
				<header className="my-12 md:my-16 space-y-4">
					<h1 className="font-heading text-4xl md:text-5xl">
						Terms of Service
					</h1>
					<div className="text-muted-foreground">
						Last updated: February 15, 2026
					</div>
				</header>

				<div className="prose prose-lg max-w-none mb-12 md:mb-16 dark:prose-invert">
					<p>
						Propagate Digital Limited ("we", "us", or "our") operates the
						Structa tool including our website, web application, mobile app, and
						any integrations such as APIs and MCP servers (collectively, the
						"Service"). By accessing or using the Service, you agree to be bound
						by these Terms of Service ("Terms").
					</p>
					<p>
						If you do not agree to these Terms, you may not access or use the
						Service.
					</p>

					<h2 id="definitions">1. Definitions</h2>
					<p>In these Terms:</p>
					<ul>
						<li>
							<strong>"Service"</strong> means the Structa website, web
							application, mobile app, APIs, MCP servers, and all related
							services operated by us.
						</li>
						<li>
							<strong>"User"</strong> or <strong>"you"</strong> means any
							individual who accesses or uses the Service.
						</li>
						<li>
							<strong>"Content"</strong> means any data, documents, floor plans,
							images, text, or other materials uploaded, created, or generated
							by Users.
						</li>
						<li>
							<strong>"The Clerk"</strong> means the AI-powered assistant
							feature within the Service.
						</li>
						<li>
							<strong>"Project Pack"</strong> means AI-generated scope-of-work
							documents created from User Content.
						</li>
						<li>
							<strong>"Partner"</strong> means a User invited to share a
							workspace with another User.
						</li>
						<li>
							<strong>"Tradesperson"</strong> means any contractor, builder,
							electrician, plumber, or other professional listed in or contacted
							through the Service.
						</li>
					</ul>

					<h2 id="accounts">2. Accounts and Registration</h2>
					<h3>2.1 Account Creation</h3>
					<p>
						To use certain features of the Service, you must create an account.
						You agree to:
					</p>
					<ul>
						<li>
							Provide accurate, current, and complete information during
							registration
						</li>
						<li>Maintain and update your information to keep it accurate</li>
						<li>Be at least 18 years of age</li>
						<li>
							Not create an account if we have previously suspended or
							terminated your access
						</li>
					</ul>

					<h3>2.2 Account Security</h3>
					<p>You are responsible for:</p>
					<ul>
						<li>Maintaining the confidentiality of your account credentials</li>
						<li>All activities that occur under your account</li>
						<li>
							Notifying us immediately of any unauthorized access or security
							breach
						</li>
					</ul>

					<h3>2.3 Partner Invitations</h3>
					<p>
						You may invite Partners to share your workspace. When you invite a
						Partner, they will have access to shared Content, chat history with
						The Clerk, and documents within that workspace. You are responsible
						for ensuring you have permission to share any Content with invited
						Partners.
					</p>

					<h2 id="subscriptions">3. Subscriptions and Payments</h2>
					<h3>3.1 Subscription Plans</h3>
					<p>
						We offer various subscription plans. Current pricing and features
						are displayed on our website. We reserve the right to modify pricing
						and features at any time.
					</p>

					<h3>3.2 Billing and Renewal</h3>
					<ul>
						<li>
							Subscriptions are billed in advance on a monthly or annual basis,
							as selected
						</li>
						<li>
							Subscriptions automatically renew unless cancelled before the
							renewal date
						</li>
						<li>
							You authorise us to charge your selected payment method for all
							subscription fees
						</li>
					</ul>

					<h3>3.3 Cancellation</h3>
					<ul>
						<li>You may cancel your subscription at any time</li>
						<li>
							Cancellation takes effect at the end of your current billing
							period
						</li>
						<li>
							No refunds are provided for partial billing periods, except as
							required by law
						</li>
					</ul>

					<h3>3.4 Price Changes</h3>
					<p>
						We may change subscription prices with at least 30 days notice. If
						you do not agree to a price change, you may cancel before it takes
						effect.
					</p>

					<h2 id="license">4. License to Use the Service</h2>
					<p>
						Subject to your compliance with these Terms, we grant you a limited,
						non-exclusive, non-transferable, revocable license to access and use
						the Service for your personal, non-commercial use.
					</p>
					<p>
						This license does not include any right to: (a) sell, resell, or
						commercially exploit the Service; (b) copy, modify, or create
						derivative works; (c) rent, lease, or lend access to the Service; or
						(d) use the Service for any unlawful purpose.
					</p>

					<h2 id="acceptable-use">5. Acceptable Use Policy</h2>
					<p>You agree not to:</p>
					<ul>
						<li>Violate any applicable laws or regulations</li>
						<li>
							Infringe the intellectual property rights or privacy of others
						</li>
						<li>
							Upload, post, or transmit any malicious code, viruses, or harmful
							content
						</li>
						<li>
							Attempt to reverse-engineer, decompile, or disassemble the Service
						</li>
						<li>
							Use automated systems (bots, scrapers) to access the Service
							without permission
						</li>
						<li>Share your account credentials with others</li>
						<li>Interfere with or disrupt other Users' use of the Service</li>
						<li>
							Use AI features to generate illegal, harmful, or misleading
							content
						</li>
						<li>Submit false or misleading information to The Clerk</li>
						<li>Harass, abuse, or harm other Users or third parties</li>
						<li>
							Use the Service for any purpose that is unlawful or prohibited by
							these Terms
						</li>
					</ul>

					<h2 id="user-content">6. User Content and Intellectual Property</h2>
					<h3>6.1 Your Ownership</h3>
					<p>
						You retain ownership of all Content you upload to or create using
						the Service, including surveys, floor plans, documents, photos, and
						project data.
					</p>

					<h3>6.2 License Grant to Us</h3>
					<p>
						By uploading or creating Content, you grant us a limited,
						non-exclusive license to process your Content solely for the purpose
						of:
					</p>
					<ul>
						<li>
							Providing the Service (storage, display, sharing with your
							Partners)
						</li>
						<li>Processing through AI features, including The Clerk</li>
						<li>Generating Project Packs and material lists</li>
						<li>
							Technical support and debugging (with your permission where
							practical)
						</li>
						<li>
							Improving our Service (only in anonymized or aggregated form)
						</li>
					</ul>

					<h3>6.3 Your Responsibilities</h3>
					<p>You represent and warrant that:</p>
					<ul>
						<li>
							You own or have the right to upload and share all Content you
							provide
						</li>
						<li>Your Content does not violate any third party's rights</li>
						<li>Your Content is accurate to the best of your knowledge</li>
					</ul>

					<h3>6.4 Content Shared with Partners</h3>
					<p>
						When you share a workspace with Partners, they will have access to
						shared Content. You are responsible for any Content you share. We
						are not liable for any disclosure of Content to Partners you have
						invited.
					</p>

					<h2 id="ai-features">7. AI Features (The Clerk)</h2>
					<h3>7.1 Informational Purpose Only</h3>
					<p>
						<strong>Important:</strong> The Clerk provides informational
						guidance only. It is <strong>not</strong> a substitute for
						professional advice.
					</p>
					<p>The Clerk does not provide:</p>
					<ul>
						<li>Structural engineering assessments or certifications</li>
						<li>Electrical safety inspections or certifications</li>
						<li>Planning permission applications or approvals</li>
						<li>Building regulations compliance certifications</li>
						<li>Professional contractor qualifications or verifications</li>
						<li>Legal or financial advice</li>
					</ul>

					<h3>7.2 Accuracy and Verification</h3>
					<ul>
						<li>
							AI responses are based on the information you provide and may
							contain errors
						</li>
						<li>
							You must verify all AI suggestions with appropriately qualified
							professionals before taking action
						</li>
						<li>
							We do not guarantee the accuracy, completeness, or suitability of
							AI-generated content
						</li>
					</ul>

					<h3>7.3 No Liability for AI Recommendations</h3>
					<p>
						We are not liable for any actions you take based on AI
						recommendations. You are solely responsible for verifying AI outputs
						and making decisions about your renovation project.
					</p>

					<h3>7.4 Third-Party AI Providers</h3>
					<p>
						AI features may be powered by third-party providers (such as
						OpenAI). Your use of AI features is also subject to those providers'
						terms and policies.
					</p>

					<h2 id="tradesperson-features">8. Tradesperson Features</h2>
					<h3>8.1 Directory and Search</h3>
					<p>
						We provide search and directory features to help you find
						tradespeople. We do not endorse, verify, or guarantee the
						qualifications, work quality, or reliability of any tradesperson
						listed.
					</p>

					<h3>8.2 Your Responsibility</h3>
					<p>Before engaging any tradesperson, you should:</p>
					<ul>
						<li>Verify their qualifications, certifications, and insurance</li>
						<li>Check references and reviews</li>
						<li>Obtain and compare multiple quotes</li>
						<li>Enter into appropriate contracts</li>
					</ul>

					<h3>8.3 Project Pack Sharing</h3>
					<p>
						When you share a Project Pack with a tradesperson, you are sharing
						your Content with a third party. We are not responsible for how
						tradespeople use or protect that information.
					</p>

					<h3>8.4 Disputes</h3>
					<p>
						We are not a party to any contract between you and a tradesperson.
						Any disputes with tradespeople are your responsibility to resolve.
						We are not liable for any loss or damage arising from your dealings
						with tradespeople.
					</p>

					<h2 id="service-availability">
						9. Service Availability and Modifications
					</h2>
					<ul>
						<li>
							We do not guarantee that the Service will be available at all
							times or free from errors
						</li>
						<li>
							We may perform scheduled or unscheduled maintenance, which may
							temporarily affect availability
						</li>
						<li>
							We may modify, suspend, or discontinue any feature of the Service
							at any time without notice
						</li>
						<li>
							We may update the Service with new features, improvements, or bug
							fixes without notice
						</li>
					</ul>
					<p>
						We are not liable for any interruption, suspension, or modification
						of the Service.
					</p>

					<h2 id="third-party-services">10. Third-Party Services and Links</h2>
					<p>
						The Service may contain links to third-party websites or integrate
						with third-party services. We are not responsible for:
					</p>
					<ul>
						<li>The content, accuracy, or practices of third-party websites</li>
						<li>
							The terms, privacy policies, or practices of third-party services
						</li>
						<li>
							Any loss or damage arising from your use of third-party services
						</li>
					</ul>
					<p>
						Your use of payment processors and AI providers is governed by their
						respective terms and conditions.
					</p>

					<h2 id="disclaimers">11. Disclaimers</h2>
					<p>
						<strong>
							THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
							WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
						</strong>
					</p>
					<p>
						To the fullest extent permitted by law, we disclaim all warranties,
						including:
					</p>
					<ul>
						<li>
							Warranties of merchantability, fitness for a particular purpose,
							and non-infringement
						</li>
						<li>
							Warranties regarding the accuracy, reliability, or completeness of
							the Service
						</li>
						<li>
							Warranties that the Service will be uninterrupted, secure, or
							error-free
						</li>
						<li>Warranties regarding the correction of defects or errors</li>
					</ul>
					<p>
						We do not guarantee that AI outputs, cost estimates, or
						recommendations will be accurate, safe, or suitable for your
						specific situation.
					</p>

					<h2 id="limitation-of-liability">12. Limitation of Liability</h2>
					<p>
						<strong>
							TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE
							FOR:
						</strong>
					</p>
					<ul>
						<li>
							Any indirect, incidental, special, consequential, or punitive
							damages
						</li>
						<li>Loss of profits, revenue, data, or business opportunities</li>
						<li>Cost of substitute services or procurement</li>
						<li>
							Damages arising from reliance on AI-generated content or
							recommendations
						</li>
						<li>
							Damages arising from your interactions with tradespeople or other
							third parties
						</li>
					</ul>
					<p>
						Our total aggregate liability for all claims arising from or related
						to the Service shall not exceed the amount you paid us in the 12
						months preceding the claim.
					</p>
					<p>
						These limitations apply even if we have been advised of the
						possibility of such damages.
					</p>

					<h2 id="indemnification">13. Indemnification</h2>
					<p>
						You agree to indemnify and hold harmless Propagate Digital Limited
						and its directors, officers, employees, and agents from any claims,
						damages, losses, or expenses (including legal fees) arising from:
					</p>
					<ul>
						<li>Your Content or your use of the Service</li>
						<li>Your violation of these Terms</li>
						<li>Your violation of any third party's rights</li>
						<li>Your interactions with tradespeople or other third parties</li>
						<li>Actions you take based on AI recommendations</li>
					</ul>

					<h2 id="termination">14. Termination</h2>
					<h3>14.1 Termination by You</h3>
					<ul>
						<li>
							You may cancel your subscription at any time through your account
							settings
						</li>
						<li>
							You may request account deletion by contacting{" "}
							<a href="mailto:support@structa.so">support@structa.so</a>
						</li>
						<li>
							Access continues until the end of your current billing period
						</li>
					</ul>

					<h3>14.2 Termination by Us</h3>
					<p>We may suspend or terminate your access to the Service:</p>
					<ul>
						<li>For violation of these Terms</li>
						<li>For non-payment of subscription fees</li>
						<li>For extended periods of account inactivity</li>
						<li>For any reason at our discretion, with or without notice</li>
					</ul>

					<h3>14.3 Effect of Termination</h3>
					<ul>
						<li>
							Upon termination, your license to use the Service immediately
							terminates
						</li>
						<li>
							No refunds are provided for partial billing periods, except as
							required by law
						</li>
						<li>
							We may delete your account and Content within a reasonable
							timeframe
						</li>
						<li>
							We are not obligated to provide data exports after account
							termination
						</li>
					</ul>

					<h2 id="governing-law">15. Governing Law and Jurisdiction</h2>
					<p>
						These Terms are governed by and construed in accordance with the
						laws of
						<strong>England and Wales</strong>, without regard to conflict of
						law principles.
					</p>
					<p>
						Any disputes arising from or relating to these Terms or the Service
						shall be subject to the exclusive jurisdiction of the courts of
						England and Wales.
					</p>

					<h2 id="general-terms">16. General Terms</h2>
					<h3>16.1 Entire Agreement</h3>
					<p>
						These Terms, together with our Privacy Policy, constitute the entire
						agreement between you and us regarding the Service.
					</p>

					<h3>16.2 Severability</h3>
					<p>
						If any provision of these Terms is found to be invalid or
						unenforceable, the remaining provisions shall continue in full force
						and effect.
					</p>

					<h3>16.3 Waiver</h3>
					<p>
						Our failure to enforce any right or provision of these Terms shall
						not constitute a waiver of that right or provision.
					</p>

					<h3>16.4 Assignment</h3>
					<p>
						You may not assign or transfer your rights under these Terms. We may
						assign our rights without restriction.
					</p>

					<h3>16.5 Changes to Terms</h3>
					<p>
						We may update these Terms from time to time. For material changes,
						we will provide at least 30 days notice via email or through the
						Service. Continued use of the Service after changes become effective
						constitutes acceptance of the updated Terms.
					</p>

					<h2 id="contact">17. Contact Information</h2>
					<p>If you have questions about these Terms, please contact us at:</p>
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
