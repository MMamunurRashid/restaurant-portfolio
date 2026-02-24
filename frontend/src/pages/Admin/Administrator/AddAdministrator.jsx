import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAddAdminMutation } from "../../../Redux/admin/adminApi";

export default function AddAdministrator() {
  const [addAdmin, { isLoading, isError, error, isSuccess }] =
    useAddAdminMutation();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const password = form.password.value;
    const role = form.role.value;
    const info = {
      name,
      role,
      email,
      phone,
      password,
    };

    const res = await addAdmin(info);
    console.log(res);
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire("", "add success", "success");
      navigate("/admin/administrator/all-administrator");
    }
  }, [isSuccess, navigate]);

  return (
    <section className="bg-base-100 shadow rounded pb-4">
      <div className="border-b p-3 font-medium">
        <h3>Add New Administrator</h3>
      </div>
      <div className="p-4 border md:w-2/3 mx-auto mt-4 rounded">
        <form onSubmit={handleAdd} className="form_group flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-neutral-content text-sm">Full Name</p>
              <input type="text" name="name" required />
            </div>
            <div>
              <p className="text-neutral-content text-sm">Email</p>
              <input type="email" name="email" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-neutral-content text-sm">Password</p>
              <input type="password" name="password" required />
            </div>
            <div>
              <p className="text-neutral-content text-sm">Phone</p>
              <input type="text" name="phone" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-neutral-content text-sm">Role</p>
              <select name="role">
                <option value="user">User</option>
                <option value="admin" selected>
                  Admin
                </option>
                <option value="superAdmin">Super Admin</option>
              </select>
            </div>
          </div>

          {isError && (
            <p className="text-sm text-red-500">{error?.data?.message}</p>
          )}

          <div>
            <button disabled={isLoading && "disabled"} className="primary_btn">
              {isLoading ? "Loading..." : "Add Administrator"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
