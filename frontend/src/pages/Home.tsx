import ELDTable from "../components/ELDTable";
import Form from "../components/Form";
import { useMyStore } from "../store/useMyStore";

export default function Home() {
  const formStep = useMyStore((s) => s.formStep);
  return <>{formStep === 0 ? <Form /> : <ELDTable />}</>;
}
