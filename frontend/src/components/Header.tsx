import { FaTruck } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="flex gap-2 items-center justify-center flex-col text-xl ml-2 text-black mt-2 from-secondary/70 to-primary/70 bg-linear-30 rounded-md p-4">
      <div className="bg-bg flex gap-2 items-center text-white justify-center text-xl px-4 py-1 rounded-md">
        <FaTruck />
        <h1 className="font-semibold text-white">Driver Tracker</h1>
      </div>

      <div>
        <p className="text-lg">Enter trip details to get ELD logs!</p>
      </div>
    </header>
  );
}
