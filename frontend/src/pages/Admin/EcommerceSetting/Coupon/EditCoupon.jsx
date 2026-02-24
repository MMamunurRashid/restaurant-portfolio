import { useNavigate, useParams } from "react-router-dom";
import {
  useEditCouponMutation,
  useGetCouponByIdQuery,
} from "../../../../Redux/coupon/couponApi";
import Swal from "sweetalert2";

export default function EditCoupon() {
  const { id } = useParams();
  const { data } = useGetCouponByIdQuery(id);
  const [editCoupon, { isLoading }] = useEditCouponMutation();
  const navigate = useNavigate();

  const handleEditCoupon = async (e) => {
    e.preventDefault();
    const form = e.target;
    const code = form.code.value;
    const minimumShopping = form.minimumShopping.value;
    const discount = form.discount.value;
    const startDate = form.startDate.value;
    const startTime = form.startTime.value;
    const endDate = form.endDate.value;
    const endTime = form.endTime.value;

    const coupon = {
      code,
      minimumShopping,
      discount,
      startDate,
      startTime,
      endDate,
      endTime,
      status: data?.data?.status,
    };

    const res = await editCoupon({ id, coupon });

    if (res?.data?.success) {
      Swal.fire("", "Update Success", "success");
      navigate("/admin/ecommerce-setting/coupons");
    } else {
      Swal.fire("", "Something went wrong", "error");
    }
  };

  return (
    <section className="md:w-[600px] bg-base-100 shadow rounded">
      <div className="p-4 border-b text-neutral font-medium">
        <h3>Add New Coupon</h3>
      </div>
      <form onSubmit={handleEditCoupon} className="p-4">
        <div className="flex flex-col gap-1">
          <p className="text-neutral-content">Coupon code</p>
          <input
            type="text"
            name="code"
            placeholder="Enter Code"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
            defaultValue={data?.data?.code}
          />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="text-neutral-content">Minimum Shopping</p>
          <input
            type="number"
            name="minimumShopping"
            placeholder="Enter Minimum Shopping Ammount"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
            defaultValue={data?.data?.minimumShopping}
          />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="text-neutral-content">Discount (%)</p>
          <input
            type="number"
            name="discount"
            placeholder="Enter Discount %"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
            defaultValue={data?.data?.discount}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-neutral-content">Start Date</p>
            <input
              type="date"
              name="startDate"
              className="w-full px-3 py-2 border rounded outline-none text-sm"
              required
              defaultValue={data?.data?.startDate}
            />
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <p className="text-neutral-content">Start Time</p>
            <input
              type="time"
              name="startTime"
              className="w-full px-3 py-2 border rounded outline-none text-sm"
              required
              defaultValue={data?.data?.startTime}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-neutral-content">End Date</p>
            <input
              type="date"
              name="endDate"
              className="w-full px-3 py-2 border rounded outline-none text-sm"
              required
              defaultValue={data?.data?.endDate}
            />
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <p className="text-neutral-content">End Time</p>
            <input
              type="time"
              name="endTime"
              className="w-full px-3 py-2 border rounded outline-none text-sm"
              required
              defaultValue={data?.data?.endTime}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 border-t p-4">
          <button disabled={isLoading && "disabled"} className="primary_btn">
            {isLoading ? "Loading..." : "Edit Coupon"}
          </button>
        </div>
      </form>
    </section>
  );
}
