import type { DayLog } from "../types/SimulationDataType";

const arr25 = Array.from({ length: 25 });
const arr2d = Array.from({ length: 4 }).fill(Array.from({ length: 24 }));

const startX = 40;
const boxWidth = 40;
const startY = 40;
const endX = 1000;
const endY = 200;

function timeToPixels(time: number): number {
  return Math.floor((time / 25) * 1000) + startX;
}

function logsToPathString(oneDayLogs: DayLog[]): string {
  console.log("oneDayLogs", oneDayLogs);
  const path: string[] = ["M"];
  oneDayLogs.forEach((log, i) => {
    const y =
      log.state === "OFF_DUTY"
        ? startY + boxWidth * 3.5
        : log.state === "SLEEPER_BERTH"
          ? startY + boxWidth * 1.5
          : log.state === "DRIVING"
            ? startY + boxWidth * 2.5
            : startY + boxWidth * 0.5; // ON_DUTY_NOT_DRIVING

    const x1 = timeToPixels(log.from);
    const x2 = timeToPixels(log.to);
    const from = `${x1} ${y}`;
    const to = `${x2} ${y}`;
    path.push(from, to);
  });

  if (oneDayLogs.length === 1) return "";
  const str = path.join(" ");
  console.log(str);
  return str;
}

export default function OneDayELDTable({
  oneDayLogs,
}: {
  oneDayLogs: DayLog[];
}) {
  return (
    <div className="flex gap-1">
      {/*  */}
      <div className="bg-linear-30 from-[#ffe75e] to-[#a0ffff] w-full p-2 rounded-lg">
        <svg viewBox="0 0 1040 200" className="w-full h-[200px]">
          <g className="stroke-bg">
            {/* horizontal lines */}
            <line x1={startX} y1={startY} x2={endX} y2={startY} />
            <line
              x1={startX}
              y1={startY + boxWidth}
              x2={endX}
              y2={startY + boxWidth}
            />
            <line
              x1={startX}
              y1={startY + boxWidth * 2}
              x2={endX}
              y2={startY + boxWidth * 2}
            />
            <line
              x1={startX}
              y1={startY + boxWidth * 3}
              x2={endX}
              y2={startY + boxWidth * 3}
            />
            <line
              x1={startX}
              y1={startY + boxWidth * 4}
              x2={endX}
              y2={startY + boxWidth * 4}
            />

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
            {arr25.map((_, i) => (
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
            {arr2d.map((row, y) =>
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

            {oneDayLogs.length > 0 && (
              <path
                d={logsToPathString(oneDayLogs)}
                fill="none"
                stroke="red"
                strokeWidth="3"
                strokeLinejoin="miter"
                strokeLinecap="square"
              />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
