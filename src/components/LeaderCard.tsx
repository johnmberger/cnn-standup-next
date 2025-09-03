interface LeaderCardProps {
  leaderName: string;
  weekDates: string;
  description: string;
  statusType: 'live' | 'up-next';
  statusText: string;
  borderColor?: string;
}

export default function LeaderCard({
  leaderName,
  weekDates,
  description,
  statusType,
  statusText,
  borderColor = '#ee0000'
}: LeaderCardProps) {
  return (
    <div className={statusType === 'live' ? 'border-b-2 border-gray-200 pb-6' : ''}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`text-white text-sm font-bold px-3 py-1 rounded-md ${
          statusType === 'live' ? 'flex items-center space-x-2' : ''
        }`} 
        style={{ 
          background: statusType === 'live' 
            ? 'linear-gradient(135deg, #ee0000 0%, #cc0000 100%)' 
            : 'black' 
        }}>
          {statusType === 'live' && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          )}
          <span>{statusText}</span>
        </div>
        <h2 className="text-lg font-bold text-black uppercase tracking-wide">
          {statusType === 'live' ? "This Week's Leader" : "Next Week's Leader"}
        </h2>
      </div>
      <div className="px-6 border-l-8" style={{ borderLeftColor: borderColor }}>
        <p className="text-5xl font-bold text-black leading-tight">
          {leaderName}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {weekDates}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {description}
        </p>
      </div>
    </div>
  );
}
