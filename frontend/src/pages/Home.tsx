import ELDTable from "../components/ELDTable";
import Form from "../components/Form";
import Header from "../components/Header";
import LeafletMap from "../components/LeafletMap";
import { useMyStore } from "../store/useMyStore";

export default function Home() {
  const formStep = useMyStore((s) => s.formStep);
  // return <>{formStep === 0 ? <Form /> : <ELDTable />}</>;
  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center gap-2 p-2">
        <Form />
        
        <ELDTable />

        <LeafletMap />
      </main>
    </>
  );
}
