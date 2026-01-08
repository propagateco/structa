import { MessageSquare, AlertCircle, Bell, TrendingUp, Target } from 'lucide-react';

const FloatingNotifications = () => {
  return (
    <div className="absolute inset-0 w-full h-[200px] overflow-visible pointer-events-none">
      {/* Reddit Mention - top left */}
      <div className="absolute left-[10%] top-[15%] text-gray-600/80 animate-float-1">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
          <MessageSquare className="h-4 w-4 text-orange-500" />
          <span className="text-xs">Alert: we've finished building your backend database.</span>
        </div>
      </div>

      {/* Twitter Mention - top right */}
      <div className="absolute right-[10%] top-[15%] text-gray-600/80 animate-float-2">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <span className="text-xs">Alert: we've just deployed your app to the cloud!</span>
        </div>
      </div>

      {/* Target Alert - middle left */}
      <div className="absolute left-[15%] top-[45%] text-gray-600/80 animate-float-5">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
          <Target className="h-4 w-4 text-purple-500" />
          <span className="text-xs">Found 15 people who need your product on Reddit</span>
        </div>
      </div>

      {/* General Alert - bottom right */}
      <div className="absolute right-[20%] top-[55%] text-gray-600/80 animate-float-3">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
          <Bell className="h-4 w-4 text-emerald-500" />
          <span className="text-xs">5 new video ideas to get leads on YouTube</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotifications; 