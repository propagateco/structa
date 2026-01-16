import { Button } from "@/components/ui/button";
import { Unplug } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SalesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-start justify-center min-h-max max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Unplug className="w-8 h-8 text-muted-foreground stroke-1" />
        </div>
        <h2 className="text-base font-semibold mb-2">Connect Stripe First</h2>
        <p className="text-md text-muted-foreground max-w-2xl mb-8">
          To access sales features like transaction history and pricing
          management, you'll need to connect your Stripe account first. This
          enables secure payment processing and financial reporting for your
          app.
        </p>
        <div className="flex flex-row items-center gap-3">
          <Link to="/settings/integrations">
            <Button size="sm">Connect Stripe Account</Button>
          </Link>
          <a
            href="https://docs.structa.so/stripe-integration"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
