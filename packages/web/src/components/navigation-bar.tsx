import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function NavigationBar() {
	const [isOpen, setIsOpen] = React.useState(false);

	const navLinks = [
		{ name: "Home", to: "/" },
		{ name: "About", to: "/about" },
	];

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link to="/" className="flex items-center gap-2">
						<div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
							S
						</div>
						<span className="font-semibold text-gray-900 dark:text-gray-100">
							Structa
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
								>
									{link.name}
								</Link>
							))}
							<Link to="/login">
								<Button className="bg-teal-600 hover:bg-teal-700">
									Get Started
								</Button>
							</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
						onClick={() => setIsOpen(!isOpen)}
					>
						<Menu className="h-6 w-6" />
					</button>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
						<div className="container mx-auto px-4 py-4 space-y-4">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="block py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium"
									onClick={() => setIsOpen(false)}
								>
									{link.name}
								</Link>
							))}
							<Link
								to="/login"
								className="block"
								onClick={() => setIsOpen(false)}
							>
								<Button className="w-full bg-teal-600 hover:bg-teal-700">
									Get Started
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
