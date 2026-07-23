import Form from "../components/Form";
import Header from "../components/Header";
import LeafletMap from "../components/LeafletMap";
import { useMyStore } from "../store/useMyStore";
import ELDTables from "../components/ELDTables";
import BackgroundVideo from "../components/BackgroundVideo";

export default function Home() {
  const formStep = useMyStore((s) => s.formStep);
  const loading = useMyStore((s) => s.loading);

  return (
    <>
      {formStep === 0 && <BackgroundVideo />}

      <div className="relative flex flex-col justify-center items-center min-h-screen gap-4 z-40">
        {formStep === 0 ? (
          <>
            <Header />

            <Form />
          </>
        ) : formStep === 1 && !loading ? (
          <>
            <ELDTables />

            <LeafletMap />
          </>
        ) : null}
      </div>
    </>
  );
}
