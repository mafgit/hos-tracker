import { useMyStore } from "../store/useMyStore";

const arr = Array.from({ length: 25 });
const arr2 = Array.from({ length: 4 }).fill(Array.from({ length: 24 }));

const events = [{}];

export default function ELDTable() {
  const pickup = useMyStore((s) => s.pickup);
  const dropoff = useMyStore((s) => s.dropoff);

  function eventsToPathString(events) {
    return "";
  }

  return (
    <div className="flex gap-1">
      {/*  */}
      <div className="bg-gray-300 w-full p-2 rounded-md">
        <svg viewBox="0 0 1040 200" className="w-full h-[200px]">
          <g className="stroke-amber-600">
            {/* horizontal lines */}
            <line x1={40} y1={40} x2={1000} y2={40} />
            <line x1={40} y1={80} x2={1000} y2={80} />
            <line x1={40} y1={120} x2={1000} y2={120} />
            <line x1={40} y1={160} x2={1000} y2={160} />
            <line x1={40} y1={200} x2={1000} y2={200} />

            <text x={0} y={60} fontSize="12" fill="#000000" fontWeight={"100"}>
              1. OD
            </text>

            <text x={0} y={100} fontSize="12" fill="#000000" fontWeight={"100"}>
              2. SB
            </text>

            <text x={0} y={140} fontSize="12" fill="#000000" fontWeight={"100"}>
              3. D
            </text>

            <text x={0} y={180} fontSize="12" fill="#000000" fontWeight={"100"}>
              4. OD
            </text>

            {/* vertical lines */}
            {arr.map((_, i) => (
              <>
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
              </>
            ))}

            {/* inner 15 minute interval lines */}
            {arr2.map((row, y) =>
              row.map((_, x) => {
                const thisX = (x + 1) * 40;
                const thisY = (y + 1) * 40;
                return (
                  <>
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
                  </>
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
