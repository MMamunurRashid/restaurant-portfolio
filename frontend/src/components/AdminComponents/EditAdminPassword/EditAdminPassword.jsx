import Swal from "sweetalert2";
import { useUpdateAdminPasswordMutation } from "../../../Redux/admin/adminApi";

export default function EditAdminPassword({ id, admin }) {
  const [updateAdminPassword, { isLoading: passIsLoading }] =
    useUpdateAdminPasswordMutation();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const info = {
      password,
    };

    const res = await updateAdminPassword({ id, info });

    if (res?.data?.success) {
      Swal.fire("", "Administrator password update success", "success");
      navigate("/admin/administrator/all-administrator");
    } else {
      Swal.fire(
        "",
        res?.error?.data?.error
          ? res?.error?.data?.error
          : "Something went wrong",
        "error"
      );
    }
  };

  return (
    <section className="bg-base-100 shadow rounded pb-4">
      <div className="p-4 border-b text-neutral font-medium flex justify-between items-center">
        <h3>Update Password</h3>
      </div>

      <div className="p-4 border md:w-1/2 mx-auto m-4 rounded">
        <form
          onSubmit={handleUpdatePassword}
          className="form_group flex flex-col gap-4"
        >
          <div>
            <p className="text-neutral-content text-sm">Current Password</p>
            <input type="password" disabled defaultValue={admin?.password} />
          </div>
          <div>
            <p className="text-neutral-content text-sm">New Password</p>
            <input type="password" name="password" required />
          </div>

          <div>
            <button
              disabled={passIsLoading && "disabled"}
              className="primary_btn"
            >
              {passIsLoading ? "Loading..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
