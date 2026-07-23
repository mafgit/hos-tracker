import type { CoordType } from "../types/CoordType";

export async function simulate(
  current: CoordType,
  pickup: CoordType,
  dropoff: CoordType,
  currentCycleUsedHrs: number,
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/simulate/`, {
    method: "POST",
    body: JSON.stringify({
      lat1: current.lat,
      lng1: current.lng,
      lat2: pickup.lat,
      lng2: pickup.lng,
      lat3: dropoff.lat,
      lng3: dropoff.lng,
      current_cycle_used_hrs: currentCycleUsedHrs,
    }),
    headers: { "Content-Type": "application/json" },
  });

  console.log('RESPONSE', res);
  const data = await res.json();

  console.log('DATA', data);
  
  return data;
}
