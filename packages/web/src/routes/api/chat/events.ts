import { createFileRoute } from "@tanstack/react-router";
import { chatEventsShapeRequest } from "./shape";

export const Route = createFileRoute("/api/chat/events")({
	server: { handlers: { GET: ({ request }: { request: Request }) => chatEventsShapeRequest(request) } },
});
