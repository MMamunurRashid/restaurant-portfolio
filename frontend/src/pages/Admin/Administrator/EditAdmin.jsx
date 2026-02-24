import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useGetAdminByIdQuery,
  useUpdateAdminProfileMutation,
} from "../../../Redux/admin/adminApi";
import EditAdminPassword from "../../../components/AdminComponents/EditAdminPassword/EditAdminPassword";

export default function EditAdministrator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useGetAdminByIdQuery(id);
  const admin = data?.data;

  const [updateAdminById, { isLoading }] = useUpdateAdminProfileMutation();

  const handleEdit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const role = form.role.value;
    const info = {
      name,
      email,
      phone,
      role,
    };

    try {
      const res = await updateAdminById({ id, info }).unwrap();

      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "",
          text: "Administrator update success",
        });
        form.reset();
        navigate("/admin/administrator/all-administrator");
      }
    } catch (error) {
      console.log(error);
      Swal.fire(
        "",
        error?.data?.error ? error?.data?.error : "Something went wrong",
        "error"
      );
    }
  };

  const roles = [
    {
      role: "user",
      text: "User",
    },
    {
      role: "admin",
      text: "Admin",
    },
    {
      role: "superAdmin",
      text: "Super Admin",
    },
  ];

  return (
    <>
      <section className="bg-base-100 shadow rounded pb-4">
        <div className="p-4 border-b text-neutral font-medium flex justify-between items-center">
          <h3>Edit Admin</h3>
        </div>

        <div className="p-4 border md:w-2/3 mx-auto mt-4 rounded">
          <form
            onSubmit={handleEdit}
            className="form_group flex flex-col gap-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-content text-sm">Full Name</p>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={admin?.name}
                />
              </div>
              <div>
                <p className="text-neutral-content text-sm">Email</p>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={admin?.email}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-content text-sm">Phone</p>
                <input
                  type="text"
                  name="phone"
                  required
                  defaultValue={admin?.phone}
                />
              </div>

              <div>
                <p className="text-neutral-content text-sm">Role</p>
                <select name="role" defaultValue={admin?.role}>
                  {roles?.map((role, i) => (
                    <option
                      key={i}
                      value={role?.role}
                      selected={admin?.role === role?.role && "selected"}
                    >
                      {role?.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                disabled={isLoading && "disabled"}
                className="primary_btn my-4"
              >
                {isLoading ? "Loading..." : "Update Administrator"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <br />

      <EditAdminPassword id={id} admin={admin} />
    </>
  );
}
