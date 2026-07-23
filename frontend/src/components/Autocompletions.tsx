import { useMyStore } from "../store/useMyStore";
import type { AutocompleteItemType } from "../types/AutocompleteItemType";
import type { CoordType } from "../types/CoordType";

export default function Autocompletions({
  autocompletions,
  name,
  setCoord,
  setFocus,
}: {
  autocompletions: AutocompleteItemType[];
  name: string;
  setCoord: (coord: CoordType) => void;
  setFocus: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const setInputData = useMyStore((s) => s.setInputData);
  const inputData = useMyStore((s) => s.inputData);

  return (
    <div
      className={
        "absolute bg-gray-200 rounded-md p-2 flex flex-col gap-1 z-20 top-[110%] w-full overflow-auto max-h-[300px] opacity-0 scale-y-0 transform origin-top transition-all duration-200 " +
        (autocompletions.length > 0 ? "scale-y-100 opacity-100" : "")
      }
    >
      {autocompletions.map((item, i) => (
        <div
          key={item.osm_id + '-' + i}
          onClick={() => {
            setInputData({
              ...inputData,
              [name]: item.text,
            });
            setFocus(null);
            setCoord({ lat: item.lat, lng: item.lng });
          }}
          className="cursor-pointer flex gap-2 text-sm bg-gray-100 text-black items-start justify-start hover:bg-white p-1 rounded-md"
        >
          <p>📍</p>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
