interface NewsTickerProps {
  text?: string;
  className?: string;
}

export default function NewsTicker({ 
  text = "BREAKING NEWS", 
  className = "" 
}: NewsTickerProps) {
  const repeatedText = Array(10).fill(text).join(' • ');
  
  return (
    <div className={`overflow-hidden ${className}`} style={{ backgroundColor: '#ee0000' }}>
      <div className="ticker text-white text-sm font-bold py-2 whitespace-nowrap">
        <span className="inline-block mr-8">
          {repeatedText}
        </span>
        <span className="inline-block mr-8">
          {repeatedText}
        </span>
      </div>
    </div>
  );
}
