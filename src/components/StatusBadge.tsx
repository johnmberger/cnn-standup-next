interface StatusBadgeProps {
  type: 'live' | 'up-next';
  children: React.ReactNode;
}

export default function StatusBadge({ type, children }: StatusBadgeProps) {
  if (type === 'live') {
    return (
      <div className="text-white text-sm font-bold px-3 py-1 rounded-md flex items-center space-x-2" 
           style={{ background: 'linear-gradient(135deg, #ee0000 0%, #cc0000 100%)' }}>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div className="bg-black text-white text-sm font-bold px-3 py-1 rounded-md">
      {children}
    </div>
  );
}
