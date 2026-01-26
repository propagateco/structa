import * as React from "react";
import { Link } from "@tanstack/react-router";

export function Footer() {
	return (
		<footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Product
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
								>
									Pricing
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Resources
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
								>
									Documentation
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Company
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
								>
									About Us
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Legal
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
					<p className="text-gray-600 dark:text-gray-400 text-sm">
						© {new Date().getFullYear()} Structa. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
