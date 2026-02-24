import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "../../../components/Spinner/Spinner";
import {
  useDeleteAdminMutation,
  useGetAllAdminsQuery,
} from "../../../Redux/admin/adminApi";
import { useSelector } from "react-redux";

export default function Administrator() {
  const { data, isLoading, isError, error } = useGetAllAdminsQuery();
  const { loggedUser } = useSelector((state) => state.user);
  const role = loggedUser?.data?.role;

  const [
    deleteAdmin,
    { isSuccess, isError: deleteIsError, error: deleteError },
  ] = useDeleteAdminMutation();

  const handleDlete = async (id) => {
    const isConfirm = window.confirm("Are you sure delete Administrator");
    if (isConfirm) {
      const res = await deleteAdmin(id);
      console.log(res);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire("", "Delete Success", "success");
    }
    if (deleteIsError) {
      Swal.fire("", deleteError?.data?.message, "error");
    }
  }, [isSuccess, deleteIsError]);

  let content = null;
  if (isLoading) {
    return (content = <Spinner />);
  }
  if (!isLoading && isError) {
    content = <p>{error.error}</p>;
  }
  if (!isLoading && !isError && data?.data?.length > 0) {
    content = data?.data?.map((user) => (
      <tr key={user?._id}>
        <td>
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/user/${user?.image}`}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            {user?.firstName} {user?.lastName}
          </div>
        </td>
        <td>{user?.email}</td>
        <td>{user?.phone}</td>
        <td>{user?.role}</td>
        <td>
          <div className="flex items-center gap-2">
            {role === "superAdmin" && (
              <Link to={`/admin/administrator/edit-administrator/${user?._id}`}>
                <FaEdit className="text-[17px] text-gray-700 hover:text-green-500 duration-200" />
              </Link>
            )}
            <button onClick={() => handleDlete(user?._id)}>
              <AiOutlineDelete className="text-lg hover:text-red-500" />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <section>
      <div className="flex justify-end mb-2">
        <Link
          to="/admin/administrator/add-administrator"
          className="primary_btn"
        >
          Add Administrator
        </Link>
      </div>
      <div className="relative overflow-x-auto shadow-lg">
        <table className="dashboard_table">
          <thead>
            <tr>
              <th>User name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </section>
  );
}
