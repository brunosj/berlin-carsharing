import {
  legFromDistanceMatrixElement,
  matrixElementStatusMessage,
  type ParsedRouteLeg,
} from './parseGoogleLeg';

type LatLngLike = google.maps.LatLng | google.maps.LatLngLiteral;

function getDistanceMatrix(
  service: google.maps.DistanceMatrixService,
  request: google.maps.DistanceMatrixRequest
): Promise<{
  response: google.maps.DistanceMatrixResponse | null;
  status: google.maps.DistanceMatrixStatus;
}> {
  return new Promise((resolve) => {
    service.getDistanceMatrix(request, (response, status) => {
      resolve({ response, status });
    });
  });
}

/**
 * Driving distance/duration for each consecutive pair via Distance Matrix
 * (avoids legacy Directions Service which may be disabled on new GCP projects).
 */
export async function fetchConsecutiveDrivingLegs(
  points: LatLngLike[]
): Promise<{ legs: ParsedRouteLeg[] } | { error: string }> {
  if (points.length < 2) {
    return { error: 'Need at least origin and destination.' };
  }

  const service = new google.maps.DistanceMatrixService();
  const legs: ParsedRouteLeg[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const { response, status } = await getDistanceMatrix(service, {
      origins: [points[i]],
      destinations: [points[i + 1]],
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(Date.now()),
        trafficModel: google.maps.TrafficModel.BEST_GUESS,
      },
    });

    if (status !== 'OK' || !response?.rows[0]?.elements[0]) {
      return { error: `Route lookup failed (${status}).` };
    }

    const element = response.rows[0].elements[0];
    if (element.status !== 'OK') {
      return { error: matrixElementStatusMessage(element.status) };
    }

    const leg = legFromDistanceMatrixElement(element);
    if (!leg) {
      return { error: 'Could not read route distance or duration.' };
    }
    legs.push(leg);
  }

  return { legs };
}
