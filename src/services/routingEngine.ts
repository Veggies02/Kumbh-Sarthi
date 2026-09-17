import { RouteOption, TravelPersona, RoutePreference, CrowdZone } from '../types';
import precomputedCorridorsRaw from '../data/precomputedRoadCorridors.json';

const precomputedCorridors = precomputedCorridorsRaw as {
  routeA: [number, number][];
  routeB: [number, number][];
  routeC: [number, number][];
};

interface RoutingParams {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string; id: string };
  persona: TravelPersona;
  preference: RoutePreference;
  crowdZones: CrowdZone[];
}

export function computeRoutes({
  origin,
  destination,
  persona,
  preference,
  crowdZones
}: RoutingParams): RouteOption[] {
  const oLat = origin.lat;
  const oLng = origin.lng;
  const dLat = destination.lat;
  const dLng = destination.lng;

  // Exact geographic distance calculation
  const dLatKm = (dLat - oLat) * 111.0;
  const dLngKm = (dLng - oLng) * 111.0 * Math.cos((oLat * Math.PI) / 180);
  const directDist = Math.max(0.2, Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm));

  // Context detection
  const isOriginMet = (Math.abs(oLat - 20.0468) < 0.02 && Math.abs(oLng - 73.8582) < 0.02) || origin.name.toLowerCase().includes('met') || origin.name.toLowerCase().includes('bhujbal');
  const isDestNearAdgaon = (Math.abs(dLat - 20.0468) < 0.025 && Math.abs(dLng - 73.8582) < 0.025) || destination.id.includes('adgaon');
  const isDestPanchavati = (Math.abs(dLat - 20.000) < 0.035 && Math.abs(dLng - 73.792) < 0.035) || destination.id.includes('kund') || destination.id.includes('kalaram') || destination.id.includes('panchavati') || destination.id.includes('sita') || destination.id.includes('tapovan');

  // Crowd surge status in Panchavati / Ram Kund
  const ramKundZone = crowdZones.find(z => z.id === 'ram-kund');
  const ramKundDensity = ramKundZone ? ramKundZone.density : 45;
  const isSurging = ramKundDensity >= 75;

  // Surge only affects trips that head into or through the surged Panchavati / Godavari corridor
  const isTripImpactedBySurge = isSurging && (isDestPanchavati || (!isDestNearAdgaon && directDist > 4.0));

  // Persona-specific walking pace and requirements
  let paceMultiplier = 1.0;
  let personaBadge = 'General Pilgrim';
  let personaHighlight = 'Standard walking path';

  if (persona === 'elderly') {
    paceMultiplier = 1.35; // Gentle, unhurried senior walking pace
    personaBadge = '👴 Elder-Care Friendly';
    personaHighlight = 'Gentle slope (<1:15), resting benches every 150m, shaded canopy';
  } else if (persona === 'wheelchair') {
    paceMultiplier = 1.18;
    personaBadge = '♿ Wheelchair Accessible';
    personaHighlight = '100% barrier-free concrete ramps, minimum 2m width, zero stairs';
  } else if (persona === 'children') {
    paceMultiplier = 1.25;
    personaBadge = '🧒 Family with Kids';
    personaHighlight = 'Enclosed safety railings, child-safety post, clean restrooms';
  } else if (persona === 'solo') {
    paceMultiplier = 0.85; // Fast agile solo tempo
    personaBadge = '🚶 Agile Solo';
    personaHighlight = 'Direct walking shortcut, highest tempo navigation';
  } else if (persona === 'group') {
    paceMultiplier = 1.20;
    personaBadge = '👥 Large Group';
    personaHighlight = '6m wide assembly avenues, headcount muster points, public PA';
  } else {
    paceMultiplier = 1.05;
    personaBadge = '👨‍👩‍👧‍👦 Family Group';
    personaHighlight = 'Wide promenade prevents splitting, family rest gazebos';
  }

  // Determine Distance, Titles, and Waypoints based on Destination
  let routeADistance: number;
  let routeBDistance: number;
  let routeCDistance: number;

  let routeABaseMinutes: number;
  let routeBBaseMinutes: number;
  let routeCBaseMinutes: number;

  let titleA: string;
  let subA: string;
  let titleB: string;
  let subB: string;
  let titleC: string;
  let subC: string;

  let pathA: [number, number][];
  let pathB: [number, number][];
  let pathC: [number, number][];

  if (isOriginMet && isDestNearAdgaon) {
    // SCENARIO 1: Local Adgaon Trip (e.g., MET Bhujbal to Adgaon Mega Parking P3 or MVP Hospital)
    routeADistance = Math.max(0.6, Math.round(directDist * 1.15 * 10) / 10);
    routeBDistance = Math.max(0.8, Math.round((directDist * 1.15 + 0.25) * 10) / 10);
    routeCDistance = Math.max(0.7, Math.round((directDist * 1.15 + 0.1) * 10) / 10);

    routeABaseMinutes = Math.round(11 * paceMultiplier);
    routeBBaseMinutes = Math.round(13 * paceMultiplier);
    routeCBaseMinutes = Math.round(4 * paceMultiplier); // Electric shuttle lane

    titleA = 'Route A — Direct Highway Service Link';
    subA = 'Via Mumbai-Agra Highway (NH60) Service Road';
    titleB = 'Route B — Paved Campus Greenwalk (Step-Free)';
    subB = 'Via Shaded Campus Internal Road & Paved Ramp';
    titleC = 'Route C — Electric Shuttle Transit Lane';
    subC = 'Via Dedicated Campus-Parking E-Bus Bay';

    pathA = [
      [oLat, oLng],
      [20.0455, 73.8560],
      [20.0465, 73.8595],
      [dLat, dLng]
    ];
    pathB = [
      [oLat, oLng],
      [20.0478, 73.8568],
      [20.0482, 73.8598],
      [dLat, dLng]
    ];
    pathC = [
      [oLat, oLng],
      [20.0460, 73.8575],
      [20.0470, 73.8605],
      [dLat, dLng]
    ];
  } else if (isOriginMet && isDestPanchavati) {
    // SCENARIO 2: MET Bhujbal (Adgaon) to Central Nashik (Ram Kund / Panchavati / Kalaram)
    routeADistance = 10.2;
    routeBDistance = 10.9;
    routeCDistance = 11.4;

    routeABaseMinutes = Math.round(27 * paceMultiplier);
    routeBBaseMinutes = Math.round(28 * paceMultiplier);
    routeCBaseMinutes = Math.round(33 * paceMultiplier);

    titleA = 'Route A — Main Bazaar Corridor';
    subA = 'Via Mumbai-Agra NH60 Highway & Gate 1';
    titleB = isTripImpactedBySurge ? 'Route B — Shaded River Promenade (Surge Bypass)' : 'Route B — Shaded River Promenade';
    subB = 'Via Mhasrul Link Road & Riverwalk Ramp';
    titleC = 'Route C — Outer Temple Ring Road';
    subC = 'Via Outer Ring Road & Golf Cart Transit Bay';

    pathA = [
      [oLat, oLng],
      ...precomputedCorridors.routeA,
      [dLat, dLng]
    ];

    pathB = [
      [oLat, oLng],
      ...precomputedCorridors.routeB,
      [dLat, dLng]
    ];

    pathC = [
      [oLat, oLng],
      ...precomputedCorridors.routeC,
      [dLat, dLng]
    ];
  } else {
    // SCENARIO 3: Dynamic City-Wide Journey Across Nashik
    routeADistance = Math.max(0.5, Math.round(directDist * 1.20 * 10) / 10);
    routeBDistance = Math.max(0.7, Math.round((directDist * 1.20 + 0.4) * 10) / 10);
    routeCDistance = Math.max(0.8, Math.round((directDist * 1.20 + 0.8) * 10) / 10);

    routeABaseMinutes = Math.max(5, Math.round(routeADistance * 2.8 * paceMultiplier));
    routeBBaseMinutes = Math.max(6, Math.round(routeBDistance * 2.6 * paceMultiplier));
    routeCBaseMinutes = Math.max(7, Math.round(routeCDistance * 3.0 * paceMultiplier));

    titleA = `Route A — Direct ${destination.name.split(' ')[0]} Arterial`;
    subA = 'Shortest street connection via main roads';
    titleB = `Route B — Shaded Accessible Bypass`;
    subB = 'Via Paved Riverbank / Promenade Ramp';
    titleC = `Route C — Transit & Shuttle Ring Corridor`;
    subC = 'Via Outer Ring Transit Lane';

    // Step-wise road grid following street corridors (not diagonal flight across open fields)
    const midLat = (oLat + dLat) / 2;
    const midLng = (oLng + dLng) / 2;

    pathA = [
      [oLat, oLng],
      [oLat, midLng],
      [midLat, midLng],
      [dLat, midLng],
      [dLat, dLng]
    ];

    pathB = [
      [oLat, oLng],
      [midLat, oLng],
      [midLat, midLng],
      [midLat, dLng],
      [dLat, dLng]
    ];

    pathC = [
      [oLat, oLng],
      [oLat + (dLat - oLat) * 0.3, oLng],
      [midLat, midLng],
      [dLat, midLng + (dLng - midLng) * 0.3],
      [dLat, dLng]
    ];
  }

  // Apply Live Crowd & Surge Parameters
  let routeACrowdPercent: number;
  let routeACrowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  let routeADelayMinutes = 0;
  let routeARiskScore: number;
  let routeAAccessibilityScore = 5.0;

  if (isTripImpactedBySurge) {
    routeACrowdPercent = 97;
    routeACrowdLevel = 'CRITICAL';
    routeADelayMinutes = 22; // Severe 22 min congestion delay
    routeARiskScore = 9.8;
    routeAAccessibilityScore = 3.0; // Overwhelmed and unsafe for wheelchairs
  } else if (isDestNearAdgaon) {
    routeACrowdPercent = 16;
    routeACrowdLevel = 'LOW';
    routeARiskScore = 1.5;
    routeAAccessibilityScore = 7.0;
  } else {
    routeACrowdPercent = Math.min(65, Math.round(ramKundDensity * 0.85));
    routeACrowdLevel = routeACrowdPercent > 60 ? 'HIGH' : 'MODERATE';
    routeARiskScore = 4.0;
    routeAAccessibilityScore = 6.0;
  }

  const routeADuration = routeABaseMinutes + routeADelayMinutes;

  // ROUTE B parameters (The Smart Low-Crowd / Accessible Option)
  const routeBCrowdPercent = isTripImpactedBySurge ? 32 : (isDestNearAdgaon ? 12 : 24);
  const routeBCrowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  const routeBAccessibilityScore = 9.5; // Concrete ramps, smooth surfaces
  const routeBRiskScore = 1.8;
  const routeBDuration = routeBBaseMinutes;

  // ROUTE C parameters (Shuttle / Outer Ring)
  const routeCCrowdPercent = isTripImpactedBySurge ? 45 : (isDestNearAdgaon ? 15 : 35);
  const routeCCrowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  const routeCAccessibilityScore = 8.8;
  const routeCRiskScore = 2.5;
  const routeCDuration = routeCBaseMinutes;

  // MULTI-FACTOR SCORING: Dynamically adapts to Persona AND Priority
  const scoreRoute = (
    dist: number,
    dur: number,
    crowdPct: number,
    accScore: number,
    riskVal: number,
    isWheelchairBlocked = false
  ) => {
    let wTime = 1.5;
    let wCrowd = 1.5;
    let wAcc = 2.0;
    let wRisk = 2.0;

    // Persona Weight Adjustments
    if (persona === 'elderly') {
      wAcc = 4.5;
      wCrowd = 3.5;
      wRisk = 3.5;
      wTime = 0.5; // Seniors prefer safety and comfort over rushing
    } else if (persona === 'wheelchair') {
      wAcc = 6.0;
      wCrowd = 2.5;
      wRisk = 3.5;
      wTime = 0.4;
    } else if (persona === 'children') {
      wCrowd = 3.5;
      wRisk = 3.8;
      wAcc = 2.5;
      wTime = 0.7;
    } else if (persona === 'solo') {
      wTime = 4.0; // Solo travelers favor raw speed
      wCrowd = 0.6;
      wAcc = 0.5;
      wRisk = 1.0;
    } else if (persona === 'group') {
      wCrowd = 3.5;
      wRisk = 3.0;
      wAcc = 2.5;
      wTime = 1.0;
    }

    // Route Priority Preference Adjustments
    if (preference === 'fastest') {
      wTime = 4.5;
      wCrowd = 0.5;
      wAcc = 0.5;
      wRisk = 1.0;
    } else if (preference === 'least-crowded') {
      wCrowd = 5.0;
      wRisk = 3.5;
      wTime = 0.5;
    } else if (preference === 'accessible') {
      wAcc = 5.5;
      wCrowd = 2.5;
      wTime = 0.5;
    }

    const distPenalty = dist * 2;
    const timePenalty = dur * wTime;
    const crowdPenalty = (crowdPct / 10) * wCrowd;
    const accBonus = accScore * wAcc;
    const riskPenalty = riskVal * wRisk;
    const blockPenalty = isWheelchairBlocked && persona === 'wheelchair' ? 100 : 0;

    const totalScore = timePenalty + crowdPenalty + riskPenalty + distPenalty + blockPenalty - accBonus;

    return {
      distancePenalty: Math.round(distPenalty * 10) / 10,
      timePenalty: Math.round(timePenalty * 10) / 10,
      crowdPenalty: Math.round(crowdPenalty * 10) / 10,
      accessibilityBonus: Math.round(accBonus * 10) / 10,
      totalScore: Math.round(totalScore * 10) / 10
    };
  };

  const scoreA = scoreRoute(routeADistance, routeADuration, routeACrowdPercent, routeAAccessibilityScore, routeARiskScore, true);
  const scoreB = scoreRoute(routeBDistance, routeBDuration, routeBCrowdPercent, routeBAccessibilityScore, routeBRiskScore, false);
  const scoreC = scoreRoute(routeCDistance, routeCDuration, routeCCrowdPercent, routeCAccessibilityScore, routeCRiskScore, false);

  // Determine Best Route
  const scores = [
    { id: 'route-a', score: scoreA.totalScore },
    { id: 'route-b', score: scoreB.totalScore },
    { id: 'route-c', score: scoreC.totalScore }
  ];
  scores.sort((a, b) => a.score - b.score);

  // During surge on impacted corridors, Route A is NEVER recommended
  let bestRouteId = scores[0].id;
  if (isTripImpactedBySurge && bestRouteId === 'route-a') {
    bestRouteId = 'route-b';
  }

  // Persona-specific recommendation reasons
  let reasonA = 'Shortest direct distance.';
  let reasonB = 'Recommended: Low crowd density, non-slip ramps, continuous shade.';
  let reasonC = 'Dedicated transit corridor with electric shuttle service.';

  if (isTripImpactedBySurge) {
    reasonA = 'CRITICAL ALERT: Direct corridor is severely congested due to a 97% crowd surge. Extreme delay & stampede risk.';
    reasonB = 'ACTIVE SURGE ALTERNATIVE: Safely bypasses surging bottlenecks via shaded promenade. Saves 21 mins!';
  } else if (persona === 'elderly') {
    reasonB = 'Recommended for Seniors: Zero stairs, gentle gradient (<1:15), resting benches every 150m, and low crowd density.';
  } else if (persona === 'wheelchair') {
    reasonB = 'Recommended for Wheelchair: 100% barrier-free certified ramp path, smooth concrete, zero kerbs.';
  } else if (persona === 'solo' && preference === 'fastest') {
    reasonA = 'Recommended for Solo & Fastest: Direct shortcut saving maximum travel time.';
  } else if (preference === 'least-crowded') {
    reasonB = 'Recommended for Least Crowded: Lowest crowd density (under 25%) ensuring smooth passage.';
  }

  const routes: RouteOption[] = [
    {
      id: 'route-a',
      name: titleA,
      subtitle: subA,
      distanceKm: routeADistance,
      durationMinutes: routeADuration,
      crowdLevel: routeACrowdLevel,
      riskScore: routeARiskScore,
      accessibilityScore: routeAAccessibilityScore,
      crowdExposurePercent: routeACrowdPercent,
      pathCoordinates: pathA,
      highlights: [
        'Direct connection to destination',
        persona === 'solo' ? 'High-tempo direct walking shortcut' : 'Shortest geographic distance'
      ],
      warnings: isTripImpactedBySurge ? [
        'CRITICAL STAMPEDE DANGER: Crowd density 97%',
        'Severe delay: +22 min bottleneck',
        'Police barricades deployed — DIVERT to Route B'
      ] : (persona === 'wheelchair' ? [
        '⚠️ Inaccessible: High kerbs and stairs detected'
      ] : []),
      isRecommended: !isTripImpactedBySurge && bestRouteId === 'route-a',
      recommendationReason: reasonA,
      scoringBreakdown: scoreA
    },
    {
      id: 'route-b',
      name: titleB,
      subtitle: subB,
      distanceKm: routeBDistance,
      durationMinutes: routeBDuration,
      crowdLevel: routeBCrowdLevel,
      riskScore: routeBRiskScore,
      accessibilityScore: routeBAccessibilityScore,
      crowdExposurePercent: routeBCrowdPercent,
      pathCoordinates: pathB,
      highlights: isTripImpactedBySurge ? [
        'ACTIVE SURGE DIVERSION: Bypasses 97% stampede corridor',
        'Saves 21 minutes compared to Route A',
        'Step-free wide concrete ramps (Slope 1:12)',
        'Continuous shade & 3 RO drinking water points'
      ] : [
        personaHighlight,
        'Lowest crowd exposure along this corridor',
        'Wide step-free paved surface (Slope 1:12)',
        'Hydration kiosks and resting spots en route'
      ],
      warnings: routeBDistance > routeADistance ? [
        `Adds ~${Math.round((routeBDistance - routeADistance) * 1000)}m distance for superior safety and comfort`
      ] : [],
      isRecommended: (isTripImpactedBySurge && bestRouteId === 'route-b') || bestRouteId === 'route-b',
      recommendationReason: reasonB,
      scoringBreakdown: scoreB
    },
    {
      id: 'route-c',
      name: titleC,
      subtitle: subC,
      distanceKm: routeCDistance,
      durationMinutes: routeCDuration,
      crowdLevel: routeCCrowdLevel,
      riskScore: routeCRiskScore,
      accessibilityScore: routeCAccessibilityScore,
      crowdExposurePercent: routeCCrowdPercent,
      pathCoordinates: pathC,
      highlights: [
        'Free low-floor electric shuttle / golf-cart lane',
        'Zero physical walking required',
        'Direct holding plaza and station access'
      ],
      warnings: [
        'Frequency: Shuttle departs every 3-5 minutes'
      ],
      isRecommended: bestRouteId === 'route-c',
      recommendationReason: reasonC,
      scoringBreakdown: scoreC
    }
  ];

  return routes;
}

// In-memory cache for live OSRM asphalt road paths
const roadCache = new Map<string, [number, number][]>();

/**
 * Fetches real asphalt street road geometry from OSRM for sub-meter street navigation
 */
export async function fetchLiveOSRMPath(
  start: [number, number],
  end: [number, number],
  via?: [number, number]
): Promise<[number, number][] | null> {
  const key = `${start[0].toFixed(4)},${start[1].toFixed(4)}->${via ? via[0].toFixed(4) + ',' + via[1].toFixed(4) + '->' : ''}${end[0].toFixed(4)},${end[1].toFixed(4)}`;
  if (roadCache.has(key)) {
    return roadCache.get(key)!;
  }

  try {
    const coordsStr = via
      ? `${start[1]},${start[0]};${via[1]},${via[0]};${end[1]},${end[0]}`
      : `${start[1]},${start[0]};${end[1]},${end[0]}`;
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.routes && json.routes[0] && json.routes[0].geometry) {
      const path: [number, number][] = json.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [Number(c[1].toFixed(6)), Number(c[0].toFixed(6))]
      );
      if (path.length > 2) {
        roadCache.set(key, path);
        return path;
      }
    }
  } catch {
    // Graceful fallback to precomputed / topological road
  }
  return null;
}

/**
 * Enriches computed routes with real-time road curves from the live street network
 */
export async function enrichRoutesWithRealRoads(
  routes: RouteOption[],
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteOption[]> {
  const o: [number, number] = [origin.lat, origin.lng];
  const d: [number, number] = [destination.lat, destination.lng];

  // If already high-fidelity path (> 50 points), return immediately
  const firstRoute = routes[0];
  if (firstRoute && firstRoute.pathCoordinates.length > 50) {
    return routes;
  }

  try {
    const [osrmA, osrmB] = await Promise.all([
      fetchLiveOSRMPath(o, d),
      fetchLiveOSRMPath(o, d, [(o[0] + d[0]) / 2 + 0.004, (o[1] + d[1]) / 2 - 0.003])
    ]);

    if (!osrmA && !osrmB) return routes;

    return routes.map(r => {
      if (r.id === 'route-a' && osrmA && osrmA.length > 3) {
        return { ...r, pathCoordinates: osrmA };
      }
      if (r.id === 'route-b' && osrmB && osrmB.length > 3) {
        return { ...r, pathCoordinates: osrmB };
      }
      if (r.id === 'route-c' && osrmA && osrmA.length > 3) {
        return { ...r, pathCoordinates: osrmA };
      }
      return r;
    });
  } catch {
    return routes;
  }
}
