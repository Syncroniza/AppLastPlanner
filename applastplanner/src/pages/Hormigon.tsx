import FormularioControlHormigones from "../components/FormularioControlHormigones";
import TablaHormigones from "../components/TablaHormigones";

function Hormigon() {
  return (
    <div className="flex flex-col w-full p-4 space-y-4 bg-gray-50">
      <FormularioControlHormigones />
      <TablaHormigones />
    </div>
  );
}

export default Hormigon;
