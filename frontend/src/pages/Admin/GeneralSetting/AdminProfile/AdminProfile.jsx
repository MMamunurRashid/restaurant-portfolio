import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useUpdateAdminProfileMutation } from "../../../../Redux/admin/adminApi";
import EditAdminPassword from "../../../../components/AdminComponents/EditAdminPassword/EditAdminPassword";

export default function AdminProfile() {
  const { loggedUser } = useSelector((state) => state.user);
  const admin = loggedUser?.data;
  const id = admin?._id;

  const [updateAdminProfile, { isLoading }] = useUpdateAdminProfileMutation();

  const handleEdit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const role = admin?.role;
    const info = {
      name,
      email,
      phone,
      role,
    };

    try {
      const res = await updateAdminProfile({ id, info }).unwrap();

      if (res?.success) {
        Swal.fire("", "Profile update success", "success");
        setTimeout(() => {
          location.reload();
        }, 1000);
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

  return (
    <>
      <section className="bg-base-100 shadow rounded pb-4">
        <div className="p-4 border-b text-neutral font-medium flex justify-between items-center">
          <h3>My Profile</h3>
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
                <input type="text" value={admin?.role} disabled />
              </div>
            </div>

            <div>
              <button
                disabled={isLoading && "disabled"}
                className="primary_btn my-4"
              >
                {isLoading ? "Loading..." : "Update Profile"}
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
