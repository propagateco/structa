import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";

interface ProductEmptyStateProps {
  onCreateClick: () => void;
}

export function ProductEmptyState({ onCreateClick }: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <div className="flex flex-col items-start justify-center min-h-max max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Box className="w-8 h-8 text-muted-foreground stroke-1" />
        </div>
        <h2 className="text-base font-semibold mb-2">Products</h2>
        <p className="text-md text-muted-foreground max-w-2xl mb-8">
          Products are fitness experiences you create for clients -
          comprehensive training programs, curated workout collections,
          long-form video series, or audio playlists, all organized your way.
        </p>
        <div className="flex flex-row items-center gap-3">
          <Button onClick={onCreateClick} size="sm">
            Create new product
            <span className="text-xs">⌘ C</span>
          </Button>
          <a
            href="https://docs.propagate.so/products"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              Documentation
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
