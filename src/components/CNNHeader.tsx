import Image from 'next/image';

interface CNNHeaderProps {
  showDate?: boolean;
  className?: string;
}

export default function CNNHeader({ showDate = true, className = '' }: CNNHeaderProps) {
  return (
    <div className={`text-white px-6 py-4 ${className}`} style={{ backgroundColor: '#ee0000' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <Image
            src="/cnn-logo-red-large.jpg"
            alt="CNN Logo"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <div className="text-sm font-medium tracking-wide">
            MEDIA MANAGEMENT TEAM
          </div>
          {showDate && (
            <div className="text-xs text-red-100">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
