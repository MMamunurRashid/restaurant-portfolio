import { useNavigate } from "react-router-dom";
import { useAddCouponMutation } from "../../../../Redux/coupon/couponApi";
import Swal from "sweetalert2";

export default function AddCoupon() {
  const navigate = useNavigate();
  const [addCoupon, { isLoading }] = useAddCouponMutation();

  const handleAddCoupon = async (e) => {
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
      status: true,
    };

    const res = await addCoupon(coupon);
    console.log(res);

    if (res?.data?.success) {
      Swal.fire("", "Coupon add success", "success");
      form.reset();
      navigate("/admin/ecommerce-setting/coupons");
    } else {
      Swal.fire("", "something went wrong", "error");
    }
  };

  return (
    <section className="md:w-[600px] bg-base-100 shadow rounded">
      <div className="p-4 border-b text-neutral font-medium">
        <h3>Add New Coupon</h3>
      </div>
      <form onSubmit={handleAddCoupon} className="p-4">
        <div className="flex flex-col gap-1">
          <p className="text-neutral-content">Coupon code</p>
          <input
            type="text"
            name="code"
            placeholder="Enter Code"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
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
            />
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <p className="text-neutral-content">Start Time</p>
            <input
              type="time"
              name="startTime"
              className="w-full px-3 py-2 border rounded outline-none text-sm"
              required
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
            />
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <p className="text-neutral-content">End Time</p>
            <input
              type="time"
              name="endTime"
              className="w-full px-3 py-2 border rounded outline-none text-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 border-t p-4">
          <button disabled={isLoading && "disabled"} className="primary_btn">
            {isLoading ? "Loading..." : "Add Coupon"}
          </button>
        </div>
      </form>
    </section>
  );
}
