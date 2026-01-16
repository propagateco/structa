interface VideoCardProps {
    src: string;
    alt?: string;
    className?: string;
}

export const VideoCard = ({ src, alt = "Video", className = "" }: VideoCardProps) => {
    return (
        <div className={`aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl p-8 relative ${className}`}>
            <div className="w-full h-full rounded-lg overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                    src={src}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};
