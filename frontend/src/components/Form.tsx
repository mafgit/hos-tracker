import { useRef, useState } from "react";
import Autocompletions from "./Autocompletions";
import type { AutocompleteItemType } from "../types/AutocompleteItemType";
import { useMyStore } from "../store/useMyStore";
import { fetchSuggestions } from "../services/autocomplete";

export default function Form() {
  const setPickup = useMyStore((s) => s.setPickup);
  const setDropoff = useMyStore((s) => s.setDropoff);
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
    const { name, value } = e.target;
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
        console.log(suggestions);

        setAutocompletions(suggestions);
      }, 500);
    }
  }

  return (
    <form
      // onBlur={() => setFocus(null)}
      className="flex flex-col bg-green-400/70 rounded-lg min-w-[300px] max-w-[500px] p-5 gap-5"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-gray-900 font-semibold text-sm" htmlFor="current">Current Location</label>
          <div className="relative">
            <input
              // required todo:
              className="text-sm w-full bg-white/50 rounded-md px-2 py-2 text-black"
              type="text"
              placeholder="Chicago, IL"
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
          <label className="text-gray-900 font-semibold text-sm" htmlFor="pickup">Pickup Location</label>
          <div className="relative">
            <input
              // required todo:
              className="text-sm w-full bg-white/50 rounded-md px-2 py-2 text-black"
              type="text"
              placeholder="Chicago, IL"
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
          <label className="text-gray-900 font-semibold text-sm" htmlFor="dropoff">Dropoff Location</label>
          <div className="relative">
            <input
              // required todo:
              className="text-sm w-full bg-white/50 rounded-md px-2 py-2 text-black"
              type="text"
              placeholder="Washington, DC"
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
          <label className="text-gray-900 font-semibold text-sm" htmlFor="currentCycleUsedHrs">
            Current Cycle Used (Hours)
          </label>
          <input
            // required todo:
            className="text-sm w-full bg-white/50 rounded-md px-2 py-2 text-black"
            type="number"
            max={70}
            min={0}
            placeholder="30"
            onChange={handleChange}
            name="currentCycleUsedHrs"
            id="currentCycleUsedHrs"
            value={inputData.currentCycleUsedHrs}
          />
        </div>
      </div>

      <button
        className="w-full text-sm font-semibold px-2 py-2 bg-bg text-white rounded-md cursor-pointer hover:bg-primary transition-colors duration-200"
        type="submit"
      >
        Submit
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
