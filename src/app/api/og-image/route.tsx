import { ImageResponse } from 'next/og';
import { getCurrentStandupLeader, getThisWeekDates } from '@/lib/standup';

export const runtime = 'edge';

export async function GET(request: Request) {
  const currentLeader = getCurrentStandupLeader();
  const thisWeekDates = getThisWeekDates();
  
  // Get cache buster from query params
  const url = new URL(request.url);
  const version = url.searchParams.get('v') || 'default';

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
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            maxWidth: '800px',
            padding: '0 40px',
          }}
        >
          {currentLeader ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  fontSize: '120px',
                  fontWeight: 'bold',
                  marginBottom: '30px',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  width: '100%',
                  wordWrap: 'break-word',
                  lineHeight: '1.1',
                  whiteSpace: 'normal',
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
                  textAlign: 'center',
                  width: '100%',
                  whiteSpace: 'normal',
                }}
              >
                is leading standup this week.
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: '100px',
                fontWeight: 'bold',
                marginBottom: '60px',
                textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                textAlign: 'center',
                width: '100%',
                whiteSpace: 'normal',
              }}
            >
              No standup this week
            </div>
          )}

          <div
            style={{
              fontSize: '30px',
              fontStyle: 'italic',
              marginBottom: '18px',
              color: 'white',
              textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              fontWeight: 'bold',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {thisWeekDates}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'ETag': `"${version}-${currentLeader}"`, // ETag based on version and leader
      },
    }
  );
}
