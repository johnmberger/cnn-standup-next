import { ImageResponse } from 'next/og';
import { getCurrentStandupLeader, getThisWeekDates } from '@/lib/standup';

export const runtime = 'edge';

export async function GET() {
  const currentLeader = getCurrentStandupLeader();
  const thisWeekDates = getThisWeekDates();

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
        {/* This Week Banner */}
        <div
          style={{
            background: 'linear-gradient(45deg, #ffffff 0%, rgb(235, 223, 223) 100%)',
            color: 'black',
            padding: '12px 16px',
            borderRadius: '16px',
            fontSize: '36px',
            fontWeight: '900',
            marginBottom: '50px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'flex',
            boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
          }}
        >
          THIS WEEK
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
              fontSize: '120px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            {currentLeader}
          </div>

          <div
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              marginBottom: '60px',
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            is leading standup.
          </div>


          <div
            style={{
              fontSize: '30px',
              fontStyle: 'italic',
              marginBottom: '18px',
              color: 'white',
              display: 'flex',
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {thisWeekDates}
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
