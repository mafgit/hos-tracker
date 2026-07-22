import Form from "../components/Form";
import Header from "../components/Header";
import LeafletMap from "../components/LeafletMap";
import { useMyStore } from "../store/useMyStore";
import ELDTables from "../components/ELDTables";

export default function Home() {
  const formStep = useMyStore((s) => s.formStep);
  // return <>{formStep === 0 ? <Form /> : <ELDTable />}</>;
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-2">
      {formStep === 0 ? (
        <>
          <Header />

          <Form />
        </>
      ) : (
        <>
          <ELDTables />

          <LeafletMap />
        </>
      )}
    </div>
  );
}
