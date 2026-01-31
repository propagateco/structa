export interface VideoSectionProps {
    videoSrc?: string;
    alt?: string;
}

export function VideoSection({
    videoSrc = '/lovable-uploads/seerexample.mp4',
    alt = 'Structa AI in action',
}: VideoSectionProps) {
    return (
        <div className="relative -mt-24 sm:-mt-36">
            <div className="relative w-full rounded-xl overflow-hidden">
                <div className="aspect-[1.91/1]">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl border border-border"
                        src={videoSrc}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
}
