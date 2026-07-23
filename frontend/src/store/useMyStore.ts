import { create } from "zustand";
import type { MyStoreType } from "../types/MyStoreType";
import type { FormInputDataType } from "../types/FormInputDataType";
import { simulate } from "../services/simulate";
import type { SimulationDataType } from "../types/SimulationDataType";

export const useMyStore = create<MyStoreType>((set, get) => ({
  pickup: null,
  dropoff: null,
  current: null,
  // todo: change back to null
  // pickup: { lat: 24.844854, lng: 67.211273 },
  // dropoff: { lat: 24.902476, lng: 67.038652 },
  // current: { lat: 24.860735, lng: 67.001137 },
  error: "",
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error) => set({ error }),
  setPickup: (pickup) => set({ pickup }),
  setDropoff: (dropoff) => set({ dropoff }),
  setCurrent: (current) => set({ current }),
  inputData: {
    current: "",
    pickup: "",
    dropoff: "",
    currentCycleUsedHrs: 0,
  },
  setInputData: (inputData: FormInputDataType) =>
    set((state) => ({
      inputData: {
        ...state.inputData,
        ...inputData,
      },
    })),
  //
  formStep: 0, // todo: change back to 0
  setFormStep: (formStep) => set({ formStep }),
  maximized: false,
  setMaximized: (maximized) => set({ maximized }),

  //
  simulationData: null,
  setSimulationData: (simulationData: SimulationDataType | null) =>
    set({ simulationData }),

  //
  async handleSubmit(e: React.SubmitEvent) {
    const {
      pickup,
      dropoff,
      current,
      inputData: { currentCycleUsedHrs },
    } = get();
    e.preventDefault();
    set({ loading: true, error: "" });

    if (!dropoff || !pickup || !current) {
      set({
        error:
          "Please select locations from autocomplete suggestions and fill all fields.",
        loading: false,
      });
      return;
    }

    try {
      const data = await simulate(
        current,
        pickup,
        dropoff,
        currentCycleUsedHrs,
      );

      set({ loading: false });

      if (data.code !== "Ok") {
        set({ error: data.message });
      } else {
        set({ formStep: 1, simulationData: data });
      }
    } catch (err) {
      console.error(err);
      set({
        error: "An error occurred. Please try again.",
        loading: false,
      });
    }
  },
}));
