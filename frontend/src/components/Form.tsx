import { useRef, useState } from "react";
import Autocompletions from "./Autocompletions";
import type { AutocompleteItemType } from "../types/AutocompleteItemType";
import { type FormInputDataType } from "../types/FormInputDataType";
import { useMyStore } from "../store/useMyStore";
import { fetchSuggestions } from "../services/autocomplete";

export default function Form() {
  const pickup = useMyStore((s) => s.pickup);
  const setPickup = useMyStore((s) => s.setPickup);
  const dropoff = useMyStore((s) => s.dropoff);
  const setDropoff = useMyStore((s) => s.setDropoff);
  const current = useMyStore((s) => s.current);
  const setCurrent = useMyStore((s) => s.setCurrent);
  const handleSubmit = useMyStore((s) => s.handleSubmit);
  const inputData = useMyStore((s) => s.inputData);
  const setInputData = useMyStore((s) => s.setInputData);
  const error = useMyStore((s) => s.error);

  const [autocompletions, setAutocompletions] = useState<
    AutocompleteItemType[]
  >([]);

  const [focus, setFocus] = useState<string | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { name, value } = e.target;
    setFocus(name);

    if (name === "current") {
      setCurrent(null);
    } else if (name === "pickup") {
      setPickup(null);
    } else if (name === "dropoff") {
      setDropoff(null);
    }

    setInputData({
      ...inputData,
      [name]: value,
    });

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    const trimmedValue = value.trim();
    if (trimmedValue) {
      timeout.current = setTimeout(async () => {
        const suggestions = await fetchSuggestions(trimmedValue);
        setAutocompletions(suggestions);
      }, 500);
    }
  }

  return (
    <form
      className="flex flex-col bg-green-400 rounded-md w-[300px] p-4 gap-2"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="current">Current Location</label>
        <div className="relative">
          <input
            required
            className="w-full bg-white rounded-md px-2 py-1"
            type="text"
            placeholder="Enter current location"
            onChange={handleChange}
            name="current"
            id="current"
            value={inputData.current}
            // onBlur={() => setFocus(null)}
          />

          {focus === "current" && (
            <Autocompletions
              autocompletions={autocompletions}
              name="current"
              setCoord={setCurrent}
              setFocus={setFocus}
            />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="pickup">Pickup Location</label>
        <div className="relative">
          <input
            required
            className="w-full bg-white rounded-md px-2 py-1"
            type="text"
            placeholder="Enter pickup location"
            onChange={handleChange}
            name="pickup"
            id="pickup"
            value={inputData.pickup}
            // onBlur={() => setFocus(null)}
          />

          {focus === "pickup" && (
            <Autocompletions
              autocompletions={autocompletions}
              name="pickup"
              setCoord={setPickup}
              setFocus={setFocus}
            />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="dropoff">Dropoff Location</label>
        <div className="relative">
          <input
            required
            className="w-full bg-white rounded-md px-2 py-1"
            type="text"
            placeholder="Enter dropoff location"
            onChange={handleChange}
            name="dropoff"
            id="dropoff"
            value={inputData.dropoff}
            // onBlur={() => setFocus(null)}
          />

          {focus === "dropoff" && (
            <Autocompletions
              autocompletions={autocompletions}
              name="dropoff"
              setCoord={setDropoff}
              setFocus={setFocus}
            />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="currentCycleUsedHrs">Current Cycle Used (Hours)</label>
        <input
          required
          className="w-full bg-white rounded-md px-2 py-1"
          type="number"
          max={70}
          min={0}
          placeholder="Enter current cycle used hours"
          onChange={handleChange}
          name="currentCycleUsedHrs"
          id="currentCycleUsedHrs"
          value={inputData.currentCycleUsedHrs}
        />
      </div>

      <button className="w-full px-2 py-1 bg-blue-400" type="submit">
        Submit
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
