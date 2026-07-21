import { useMyStore } from "../store/useMyStore";

const arr: number[][] = Array.from({ length: 4 }, () => new Array(24));

export default function ELDTable() {
  const pickup = useMyStore((s) => s.pickup);
  const dropoff = useMyStore((s) => s.dropoff);
  
  return (
    <svg>
    </svg>
  );
}
