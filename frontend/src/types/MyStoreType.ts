import type { CoordType } from "./CoordType";
import type { FormInputDataType } from "./FormInputDataType";

export interface MyStoreType {
  pickup: CoordType | null;
  dropoff: CoordType | null;
  current: CoordType | null;
  setPickup: (pickup: CoordType | null) => void;
  setDropoff: (dropoff: CoordType | null) => void;
  setCurrent: (current: CoordType | null) => void;
  setInputData: (inputData: FormInputDataType) => void;
  error: string;
  setError: (error: string) => void;
  inputData: {
    current: string;
    pickup: string;
    dropoff: string;
    currentCycleUsedHrs: number;
  };
  handleSubmit: (e: React.SubmitEvent) => Promise<void>;
  formStep: number;
  //
  data: {
    code: string;
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
  };
}
