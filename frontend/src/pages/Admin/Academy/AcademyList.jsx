import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteAcademyMutation,
  useGetAllAcademiesQuery,
  useUpdateAcademyMutation,
} from "../../../Redux/academy/academyApi";
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Pagination/Pagination";

export default function AcademyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useGetAllAcademiesQuery({
    page: currentPage,
    limit,
  });

  const [updateAcademy, { isLoading: updateLoading }] = useUpdateAcademyMutation();

  const [deleteAcademy, { isSuccess, isError: deleteIsError, error: deleteError }] = useDeleteAcademyMutation();

  const handleDeleteAcademy = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete this academy?");
    if (isConfirm) {
      await deleteAcademy(id);
    }
  };

  const handleToggleFeatured = async (academy) => {
    await updateAcademy({
      id: academy._id,
      formData: { featured: !academy.featured },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire("", "Academy deleted successfully", "success");
    }
    if (deleteIsError) {
      Swal.fire(
        "",
        deleteError?.message || "Something went wrong, please try again",
        "error"
      );
    }
  }, [isSuccess, deleteIsError, deleteError]);

  let content = null;
  if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = <p>{error?.message}</p>;
  } else if (data?.data?.length > 0) {
    content = data.data.map((academy) => (
      <tr key={academy?._id}>
        <td>
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/academies/${academy?.images}`}
              alt=""
              className="w-9 h-9 rounded-lg"
            />
            {academy?.title?.length > 30
              ? academy?.title.slice(0, 30) + "..."
              : academy?.title}
          </div>
        </td>
        <td>{academy?.instructor}</td>
        <td>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={academy?.featured}
              onChange={() => handleToggleFeatured(academy)}
              className="sr-only peer"
            />
            <div className="w-11 h-[23px] bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.5px] after:start-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </td>
        <td>
          ${academy?.price}
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/academy/edit-academy/${academy?._id}`}
              className="hover:text-green-700 duration-300"
            >
              <BiSolidPencil />
            </Link>
            <button
              onClick={() => handleDeleteAcademy(academy?._id)}
              className="text-red-500"
            >
              <AiOutlineDelete />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Link
          to="/admin/academy/add-academy"
          className="text-sm bg-primary text-base-100 px-6 py-2 rounded"
        >
          Add New Academy
        </Link>
      </div>

      <div className="pb-4 bg-base-100 shadow-lg min-h-[80vh] flex flex-col justify-between">
        <div className="relative overflow-x-auto">
          <table className="dashboard_table">
            <thead>
              <tr>
                <th>Academy Name</th>
                <th>Instructor</th>
                <th>Featured</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta?.total > limit && (
          <Pagination
            pages={data?.meta?.pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
