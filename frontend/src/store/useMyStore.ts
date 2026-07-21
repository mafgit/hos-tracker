import { create } from "zustand";
import type { MyStoreType } from "../types/MyStoreType";
import type { FormInputDataType } from "../types/FormInputDataType";

export const useMyStore = create<MyStoreType>((set, get) => ({
  pickup: null,
  dropoff: null,
  current: null,
  error: "",
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
  formStep: 0,

  //
  handleSubmit(e: React.SubmitEvent) {
    const {
      pickup,
      dropoff,
      current,
      inputData: { currentCycleUsedHrs },
    } = get();
    e.preventDefault();

    if (!dropoff || !pickup || !current || currentCycleUsedHrs) {
      set({
        error:
          "Please select locations from autocomplete suggestions and fill all fields.",
      });
      return;
    }

    //

    set({ formStep: 1 });
  },
}));
