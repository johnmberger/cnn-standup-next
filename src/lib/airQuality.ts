export function getAirQualityAlert(aqi: number): { icon: string; label: string } {
  if (aqi <= 50) {
    return { icon: '✓', label: 'Good air quality' };
  }

  if (aqi <= 100) {
    return { icon: '💨', label: 'Moderate air quality' };
  }

  if (aqi <= 150) {
    return { icon: '😷', label: 'Poor air quality' };
  }

  if (aqi <= 200) {
    return { icon: '⚠️', label: 'Unhealthy air quality' };
  }

  if (aqi <= 300) {
    return { icon: '⚠️', label: 'Very unhealthy air quality' };
  }

  return { icon: '⚠️', label: 'Hazardous air quality' };
}
