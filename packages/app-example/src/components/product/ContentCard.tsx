import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as ProductContentModel from '@core/product/product-content.model';
import { ProductInterface } from '@core/product/product.interface';
import { GripVertical, Pencil, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// API response type (dates as strings)
type ContentAPIResponse = Omit<ProductContentModel.SchemaType, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
};

interface ContentCardProps {
	content: ProductContentModel.SchemaType | ContentAPIResponse;
	onEdit: () => void;
	onDelete: () => void;
	isEditing: boolean;
}

export function ContentCard({ content, onEdit, onDelete, isEditing }: ContentCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: content.id,
		disabled: !isEditing,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const contentConfig = ProductInterface.ContentTypeConfig[content.contentType];

	// Get the appropriate icon component based on content type
	const getIcon = () => {
		switch (content.contentType) {
			case 'workout':
				return <span className="text-lg">💪</span>;
			case 'audio':
				return <span className="text-lg">🎧</span>;
			case 'video':
				return <span className="text-lg">▶️</span>;
			case 'assessment':
				return <span className="text-lg">📋</span>;
		}
	};

	return (
		<div ref={setNodeRef} style={style}>
			<Card
				className={cn(
					'transition-all',
					isDragging && 'opacity-50',
					isEditing && 'cursor-move hover:shadow-md'
				)}
			>
				<CardContent className="p-3">
					<div className="flex items-start gap-2">
						{isEditing && (
							<div
								className="mt-1 cursor-grab active:cursor-grabbing"
								{...attributes}
								{...listeners}
							>
								<GripVertical className="w-4 h-4 text-muted-foreground" />
							</div>
						)}

						<div
							className="w-8 h-8 rounded flex items-center justify-center shrink-0"
							style={{ backgroundColor: `${contentConfig.color}20` }}
						>
							{getIcon()}
						</div>

						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-sm line-clamp-1">{content.title}</h4>
							{content.description && (
								<p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
									{content.description}
								</p>
							)}
							{content.duration && (
								<div className="flex items-center gap-1 mt-1">
									<Clock className="w-3 h-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										{content.duration} min
									</span>
								</div>
							)}
						</div>

						{isEditing && (
							<div className="flex items-center gap-1 shrink-0">
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7"
									onClick={onEdit}
								>
									<Pencil className="w-3 h-3" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
									onClick={onDelete}
								>
									<Trash2 className="w-3 h-3" />
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
