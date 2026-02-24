import { BiSolidPencil } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../../../Redux/category/categoryApi";
import Spinner from "../../../../components/Spinner/Spinner";
import Swal from "sweetalert2";

export default function AllCategories() {
  const { data, isLoading, isError, error } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();

  // Delete Category
  const handleDeleteCategory = async (id) => {
    const isConfirm = window.confirm(
      "Are you sure delete this Category? If you delete this Category, all the sub-caregory, sub-sub-categories and products are deleted."
    );
    if (isConfirm) {
      const result = await deleteCategory(id);
      if (result?.data?.success) {
        Swal.fire("", "Category Delete Success", "success");
      } else {
        Swal.fire("", "Somethin went worng", "error");
      }
    }
  };

  let content = null;
  if (isLoading) {
    return (content = <Spinner />);
  }
  // console.log(error.data.error);
  if (!isLoading && isError) {
    content = <p>{error?.data?.error}</p>;
  }
  if (!isLoading && !isError && data?.data?.length > 0) {
    content = data?.data?.map((category, i) => (
      <tr key={category?._id}>
        <td>{i + 1}</td>
        <td>
          <div className="flex items-center gap-2 ">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/categories/${
                category?.icon
              }`}
              alt=""
              className="w-10 h-10 rounded-full border"
            />
            {category?.name}
          </div>
        </td>
        <td>{category?.order}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/category/edit/${category?._id}`}
              className="hover:text-green-700 duration-200"
            >
              <BiSolidPencil />
            </Link>
            <button
              onClick={() => handleDeleteCategory(category?._id)}
              className="hover:text-red-600 duration-200 text-lg"
            >
              <MdDeleteOutline />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Link to="/admin/category/add-category" className="primary_btn text-sm">
          Add New Category
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg">
        <table className="dashboard_table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Category</th>
              <th>Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  );
}
