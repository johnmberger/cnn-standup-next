import { ImageResponse } from 'next/og';
import { getCurrentStandupLeader, getCurrentWeekNumber } from '@/lib/standup';

export const runtime = 'edge';

export async function GET() {
  const currentLeader = getCurrentStandupLeader();
  const weekNumber = getCurrentWeekNumber();
  const currentYear = new Date().getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ee0000', // CNN Red
          backgroundImage: 'linear-gradient(45deg, #ee0000 0%, #cc0000 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Breaking News Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%,rgb(204, 165, 165) 100%)',
            color: '#ee0000',
            padding: '8px 24px',
            borderRadius: '4px',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '40px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'flex',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          BREAKING NEWS
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            maxWidth: '800px',
            padding: '0 40px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            {currentLeader}
          </div>
          
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '40px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            is leading standup this week
          </div>
        

          <div
            style={{
              fontSize: '24px',
              opacity: 0.8,
              fontStyle: 'italic',
              marginBottom: '14px',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            CNN Media Management Team
          </div>
          <div
            style={{
              fontSize: '16px',
              opacity: 0.9,
              display: 'flex',
              textAlign: 'center',
            }}
          >
            Week {weekNumber} of {currentYear}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '8px',
            backgroundColor: 'white',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
