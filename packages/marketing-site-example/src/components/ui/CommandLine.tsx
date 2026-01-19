import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandLineProps {
  command: string;
  inLinkGroup?: boolean;
  className?: string;
}

export const CommandLine: React.FC<CommandLineProps> = ({
  command,
  inLinkGroup = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-center justify-between',
        'bg-gray-950 border border-gray-800 rounded-lg',
        'px-4 py-3 font-mono text-sm',
        'hover:border-gray-700 transition-colors',
        inLinkGroup && 'w-full',
        className
      )}
    >
      <code className="text-gray-300 select-all">{command}</code>
      
      <button
        onClick={handleCopy}
        className={cn(
          'ml-4 p-1.5 rounded hover:bg-gray-800 transition-colors',
          'flex items-center gap-1.5 text-xs'
        )}
        aria-label="Copy command"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Copy
            </span>
          </>
        )}
      </button>
    </div>
  );
};
