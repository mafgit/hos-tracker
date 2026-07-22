export type SimulationDataType = {
  routes: {
    legs: {
      steps: never[];
      weight: number;
      summary: string;
      duration: number;
      distance: number;
    }[];
    weight_name: string;
    geometry: {
      coordinates: number[][];
      type: string;
    };
    weight: number;
    duration: number;
    distance: number;
  }[];
  waypoints: {
    hint: string;
    location: number[];
    name: string;
    distance: number;
  }[];
  days: DayLog[][];
};

export interface DayLog {
  state: "DRIVING" | "ON_DUTY_NOT_DRIVING" | "SLEEPER_BERTH" | "OFF_DUTY";
  from: number;
  to: number;
}
