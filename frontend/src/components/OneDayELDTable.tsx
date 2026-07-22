import { useMyStore } from "../store/useMyStore";
import type { DayLogDataType } from "../types/DayLogDataType";
import type { EventType } from "../types/EventType";

const arr = Array.from({ length: 25 });
const arr2 = Array.from({ length: 4 }).fill(Array.from({ length: 24 }));

const events: EventType[] = [
  {
    name: "O",
    time: 0,
  },
  {
    name: "OD",
    time: 0,
  },
];

export default function OneDayELDTable({ day }: { day: DayLogDataType }) {
  const pickup = useMyStore((s) => s.pickup);
  const dropoff = useMyStore((s) => s.dropoff);

  function eventsToPathString(events: EventType[]) {
    const path: string[] = [];
    const startX = 40;
    const startY = 40;
    const endX = 1000;
    const endY = 200;

    let lastTime = 0;
    let str = "";
    events.forEach((event, i) => {
      // const time = event.time;
      // const y = event.type === 1 ? 40 : event.type === 2 ? 80 : event.type === 3 ? 120 : 160;
      // const x =
      // if (i === 0) {
      //   str = `M ${x} ${y}`;
      //   lastTime = time;
      // }
      // path.push(str);
    });
    return "M 2 2 L 5 5";
  }

  return (
    <div className="flex gap-1">
      {/*  */}
      <div className="bg-linear-30 from-[#ffe75e] to-[#a0ffff] w-full p-2 rounded-lg">
        <svg viewBox="0 0 1040 200" className="w-full h-[200px]">
          <g className="stroke-bg">
            {/* horizontal lines */}
            <line x1={40} y1={40} x2={1000} y2={40} />
            <line x1={40} y1={80} x2={1000} y2={80} />
            <line x1={40} y1={120} x2={1000} y2={120} />
            <line x1={40} y1={160} x2={1000} y2={160} />
            <line x1={40} y1={200} x2={1000} y2={200} />

            <text x={0} y={60} fontSize="10" fill="#000000" fontWeight={"100"}>
              On Duty
            </text>

            <text x={0} y={100} fontSize="10" fill="#000000" fontWeight={"100"}>
              S. Berth
            </text>

            <text x={0} y={140} fontSize="10" fill="#000000" fontWeight={"100"}>
              Driving
            </text>

            <text x={0} y={180} fontSize="10" fill="#000000" fontWeight={"100"}>
              Off Duty
            </text>

            {/* vertical lines */}
            {arr.map((_, i) => (
              <g key={"v-" + i}>
                <text
                  x={(i + 1) * 40}
                  y={20}
                  fontSize="12"
                  fill="#000000"
                  fontWeight={"100"}
                >
                  {i === 0 || i === 24 ? "M" : i === 12 ? "N" : i}
                </text>
                <line x1={(i + 1) * 40} y1={40} x2={(i + 1) * 40} y2={200} />
              </g>
            ))}

            {/* inner 15 minute interval lines */}
            {arr2.map((row, y) =>
              row.map((_, x) => {
                const thisX = (x + 1) * 40;
                const thisY = (y + 1) * 40;
                return (
                  <g key={"inner-" + x + "-" + y}>
                    <line
                      x1={thisX + 10}
                      y1={thisY}
                      x2={thisX + 10}
                      y2={thisY + 10}
                    />
                    <line
                      x1={thisX + 20}
                      y1={thisY}
                      x2={thisX + 20}
                      y2={thisY + 20}
                    />
                    <line
                      x1={thisX + 30}
                      y1={thisY}
                      x2={thisX + 30}
                      y2={thisY + 10}
                    />
                  </g>
                );
              }),
            )}

            <path
              d={eventsToPathString(events)}
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="miter"
              strokeLinecap="square"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
