import { useMyStore } from "../store/useMyStore";
import type { AutocompleteItemType } from "../types/AutocompleteItemType";
import type { CoordType } from "../types/CoordType";
import type { FormInputDataType } from "../types/FormInputDataType";

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
    <div className="absolute bg-white rounded-md p-2 flex flex-col gap-1 z-20 top-[110%] w-full">
      {autocompletions.map((item, i) => (
        <div
          key={item.lat + "," + item.lng}
          onClick={() => {
            setInputData({
              ...inputData,
              [name]: item.text,
            });
            setFocus(null);
            setCoord({ lat: item.lat, lng: item.lng });
          }}
          className="cursor-pointer hover:bg-gray-200 p-1 rounded-md"
        >
          <p>
            {item.text} ({item.lat}, {item.lng})
          </p>
        </div>
      ))}
    </div>
  );
}
