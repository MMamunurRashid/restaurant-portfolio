import Swal from "sweetalert2";
import {
  useAddShippingConfigMutation,
  useGetShippingConfigQuery,
  useUpdateShippingConfigMutation,
} from "../../../../Redux/shippingConfigApi";

export default function ShippingConfiguration() {
  const { data, isLoading } = useGetShippingConfigQuery();
  const shippingConfig = data?.data[0];
  const id = data?.data[0]?._id;

  const [addShippingConfig, { isLoading: addIsLoading }] =
    useAddShippingConfigMutation();
  const [updateShippingConfig, { isLoading: updateIsLoading }] =
    useUpdateShippingConfigMutation();

  const handleShippingConfig = async (e) => {
    e.preventDefault();
    const form = e.target;
    const dhakaCityTime = form.dc_time.value;
    const dhakaCityCharge = form.dc_charge.value;
    const dhakaOutCityTime = form.doc_time.value;
    const dhakaOutCityCharge = form.doc_charge.value;
    const OutsideDhakaTime = form.od_time.value;
    const OutsideDhakaCharge = form.od_charge.value;

    const dhakaCity = {
      time: dhakaCityTime,
      charge: dhakaCityCharge,
    };
    const dhakaOutCity = {
      time: dhakaOutCityTime,
      charge: dhakaOutCityCharge,
    };
    const outsideDhaka = {
      time: OutsideDhakaTime,
      charge: OutsideDhakaCharge,
    };

    const data = {
      dhakaCity,
      dhakaOutCity,
      outsideDhaka,
    };

    if (id) {
      const res = await updateShippingConfig({ data, id });
      if (res?.data?.success) {
        Swal.fire("", "Shipping Config update success", "success");
      } else {
        Swal.fire("", "Somethin wrong, please try again letter", "error");
      }
    } else {
      const res = await addShippingConfig(data);
      if (res?.data?.success) {
        Swal.fire("", "Shipping Config add success", "success");
      } else {
        Swal.fire("", "Somethin wrong, please try again letter", "error");
      }
    }
  };

  return (
    <section>
      <div className="p-4 rounded shadow bg-base-100 text-neutral-content">
        <h1>Shipping Configuration</h1>

        <form onSubmit={handleShippingConfig} className="text-sm form_group">
          <div className="mt-4 border rounded p-3">
            <p>Dhaka City</p>
            <div className="flex flex-col gap-3 border rounded p-2 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Delivery Time</p>
                  <input
                    type="text"
                    placeholder="ex: 2-3"
                    className="placeholder:font-light"
                    name="dc_time"
                    defaultValue={shippingConfig?.dhakaCity?.time}
                  />
                </div>
                <div>
                  <p>Delivery Charge</p>
                  <input
                    type="number"
                    placeholder="ex: 70 tk"
                    className="placeholder:font-light"
                    name="dc_charge"
                    defaultValue={shippingConfig?.dhakaCity?.charge}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border rounded p-3">
            <p>Outside Dhaka City</p>
            <div className="flex flex-col gap-3 border rounded p-2 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Delivery Time</p>
                  <input
                    type="text"
                    placeholder="ex: 3-4"
                    className="placeholder:font-light"
                    name="doc_time"
                    defaultValue={shippingConfig?.dhakaOutCity?.time}
                  />
                </div>
                <div>
                  <p>Delivery Charge</p>
                  <input
                    type="number"
                    placeholder="ex: 90 tk"
                    className="placeholder:font-light"
                    name="doc_charge"
                    defaultValue={shippingConfig?.dhakaOutCity?.charge}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border rounded p-3">
            <p>Outside Dhaka</p>
            <div className="flex flex-col gap-3 border rounded p-2 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Delivery Time</p>
                  <input
                    type="text"
                    placeholder="ex: 3-5"
                    className="placeholder:font-light"
                    name="od_time"
                    defaultValue={shippingConfig?.outsideDhaka?.time}
                  />
                </div>
                <div>
                  <p>Delivery Charge</p>
                  <input
                    type="number"
                    placeholder="ex: 150 tk"
                    className="placeholder:font-light"
                    name="od_charge"
                    defaultValue={shippingConfig?.outsideDhaka?.charge}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              disabled={(updateIsLoading || addIsLoading) && "disabled"}
              className="primary_btn"
            >
              {updateIsLoading || addIsLoading
                ? "Loading..."
                : id
                ? "Update Shipping Config"
                : "Add Shipping Config"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
