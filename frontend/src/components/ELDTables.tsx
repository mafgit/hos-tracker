import { useState } from "react";
import OneDayELDTable from "./OneDayELDTable";
import { useMyStore } from "../store/useMyStore";
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";

export default function ELDTables() {
  const [selectedDay, setSelectedDay] = useState(1);
  const maximized = useMyStore((s) => s.maximized);
  const setMaximized = useMyStore((s) => s.setMaximized);
  const simulationData = useMyStore((s) => s.simulationData);

  return (
    <div
      className={
        "select-none z-50 absolute flex items-center justify-center flex-col bottom-[22px] left-[50%] translate-x-[-50%] w-[90%] max-w-[1040px]  transform duration-200 " +
        (maximized ? "translate-y-[0] " : "translate-y-[200px]")
      }
    >
      <button
        className=" bg-primary px-2 py-1 rounded-md font-semibold gap-1 flex items-center justify-center mb-2 cursor-pointer "
        onClick={() => setMaximized(!maximized)}
      >
        {maximized ? (
          <FaAnglesDown style={{ fontSize: 12 }} />
        ) : (
          <>
            <FaAnglesUp style={{ fontSize: 12 }} />
          </>
        )}

        <p>Logsheet</p>
      </button>

      {maximized && (
        <select
          className="bg-text text-bg border-1 border-black outline-none font-semibold text-sm rounded-md p-1 mb-2 ml-auto"
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
        >
          {simulationData.days.map((day, i) => (
            <option
              value={i + 1}
              key={"day-" + i + 1}
              selected={selectedDay === i + 1}
            >
              Day {i + 1}
            </option>
          ))}
        </select>
      )}

      <OneDayELDTable oneDayLogs={simulationData.days[selectedDay - 1]} />
    </div>
  );
}
