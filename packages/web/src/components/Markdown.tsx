import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";

type MarkdownProps = {
	content: string;
	className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
	return (
		<div className={className}>
			<ReactMarkdown
				components={{
					a: ({ href, children, ...props }: any) => {
						if (href?.startsWith("/")) {
							return (
								<Link to={href} {...props}>
									{children}
								</Link>
							);
						}
						return (
							<a href={href} {...props}>
								{children}
							</a>
						);
					},
					img: ({ src, alt, ...props }: any) => (
						<img
							src={src}
							alt={alt || ""}
							loading="lazy"
							className="rounded-lg shadow-md"
							{...props}
						/>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
