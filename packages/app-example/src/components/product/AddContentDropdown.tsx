import { ProductInterface } from "@core/product/product.interface";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddContentDropdownProps {
	onAddContent: (type: ProductInterface.ContentType) => void;
}

export function AddContentDropdown({ onAddContent }: AddContentDropdownProps) {
	const handleAddContent = (type: ProductInterface.ContentType) => {
		// For now, show coming soon message
		toast.info(
			`${ProductInterface.ContentTypeConfig[type].label} creation coming soon!`,
		);

		// In the future, this will call onAddContent(type)
		// For now, we'll create placeholder content
		onAddContent(type);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="outline" className="w-full">
					<Plus className="w-4 h-4 mr-2" />
					Add content
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-48">
				<DropdownMenuItem onClick={() => handleAddContent("workout")}>
					<span className="mr-2">💪</span>
					Add Workout
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAddContent("audio")}>
					<span className="mr-2">🎧</span>
					Add Audio Content
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAddContent("video")}>
					<span className="mr-2">▶️</span>
					Add Video Content
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAddContent("assessment")}>
					<span className="mr-2">📋</span>
					Add Assessment
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
