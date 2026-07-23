import type { DayLog } from "../types/SimulationDataType";

const arr25 = Array.from({ length: 25 });
const arr2d = Array.from({ length: 4 }).fill(Array.from({ length: 24 }));

const startX = 60;
const boxWidth = 40;
const startY = 40;
const endX = startX + boxWidth * 24;

function timeToPixels(time: number): number {
  return Math.floor((time / 25) * 1000) + startX;
}

function processDayLogs(oneDayLogs: DayLog[]) {
  const path: string[] = ["M"];
  const sums: Record<string, any> = {
    ON_DUTY_NOT_DRIVING: 0,
    SLEEPER_BERTH: 0,
    DRIVING: 0,
    OFF_DUTY: 0,
  };

  oneDayLogs.forEach((log) => {
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

    // sum
    sums[log.state as keyof typeof sums] += log.to - log.from;
  });

  const pathString = oneDayLogs.length > 1 ? path.join(" ") : "";

  for (const key in sums) {
    const a = sums[key as keyof typeof sums] as number;
    const hrs = Math.floor(a);
    const mins = Math.round((a - hrs) * 60);
    const hrsStr = hrs < 10 ? `0${hrs}` : `${hrs}`;
    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    sums[key as keyof typeof sums] = `${hrsStr} ${minsStr}`;
  }

  return {
    pathString,
    sums,
  };
}

export default function OneDayELDTable({
  oneDayLogs,
}: {
  oneDayLogs: DayLog[];
}) {
  const { pathString, sums } = processDayLogs(oneDayLogs);
  return (
    <div className="flex gap-1">
      {/*  */}
      <div className="bg-linear-30 from-[#ffe75e] to-[#a0ffff] w-full p-2 rounded-lg">
        <svg viewBox="0 0 1080 200" className="w-full h-[200px]">
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

            <text x={startX - 50} y={65} fontSize="10" fill="#000000" fontWeight={"100"}>
              On Duty
            </text>
            <text
              x={endX + 10}
              y={65}
              fontSize="12"
              fill="#000000"
              fontWeight={"100"}
            >
              {sums.ON_DUTY_NOT_DRIVING}
            </text>

            <text x={startX - 50} y={105} fontSize="10" fill="#000000" fontWeight={"100"}>
              S. Berth
            </text>
            <text
              x={endX + 10}
              y={105}
              fontSize="12"
              fill="#000000"
              fontWeight={"100"}
            >
              {sums.SLEEPER_BERTH}
            </text>

            <text x={startX - 50} y={145} fontSize="10" fill="#000000" fontWeight={"100"}>
              Driving
            </text>
            <text
              x={endX + 10}
              y={145}
              fontSize="12"
              fill="#000000"
              fontWeight={"100"}
            >
              {sums.DRIVING}
            </text>

            <text x={startX - 50} y={185} fontSize="10" fill="#000000" fontWeight={"100"}>
              Off Duty
            </text>
            <text
              x={endX + 10}
              y={185}
              fontSize="12"
              fill="#000000"
              fontWeight={"100"}
            >
              {sums.OFF_DUTY}
            </text>

            {/* times at top */}
            {arr25.map((_, i) => (
              <g key={"v-" + i}>
                <text
                  x={startX + i * 40}
                  y={20}
                  fontSize="12"
                  fill="#000000"
                  fontWeight={"100"}
                >
                  {i === 0 || i === 24 ? "M" : i === 12 ? "N" : i}
                </text>
                {/* vertical lines */}
                <line
                  x1={startX + i * 40}
                  y1={40}
                  x2={startX + i * 40}
                  y2={200}
                />
              </g>
            ))}

            {/* inner 15 minute interval lines */}
            {arr2d.map((row, y) =>
              (row as number[][]).map((_, x) => {
                const thisX = startX + x * 40;
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
                d={pathString}
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
