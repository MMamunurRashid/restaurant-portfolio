import { BiSolidPencil } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import Swal from "sweetalert2";
import {
  useAllBrandsQuery,
  useDeleteBrandMutation,
} from "../../../Redux/brand/brandApi";

export default function AllBrands() {
  const { data, isLoading, isError, error } = useAllBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();

  // Delete Brand
  const handleDeleteBrand = async (id) => {
    const isConfirm = window.confirm("Are you sure delete this Brand");
    if (isConfirm) {
      const result = await deleteBrand(id);
      if (result?.data?.success) {
        Swal.fire("", "Brand Delete Success", "success");
      } else {
        Swal.fire("", "Somethin went worng", "error");
      }
    }
  };

  let content = null;
  if (isLoading) {
    return (content = <Spinner />);
  }

  if (!isLoading && isError) {
    content = <p>{error?.data?.error}</p>;
  }
  if (!isLoading && !isError && data?.data?.length > 0) {
    content = data?.data?.map((brand, i) => (
      <tr key={brand?._id}>
        <td>{i + 1}</td>
        <td>
          <div className="flex items-center gap-2 ">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/brands/${brand?.icon}`}
              alt=""
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </td>
        <td>{brand?.name}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/edit-brand/${brand?._id}`}
              className="hover:text-green-700 duration-200"
            >
              <BiSolidPencil />
            </Link>
            <button
              onClick={() => handleDeleteBrand(brand?._id)}
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
      <div className="flex justify-end mb-3">
        <Link to="/admin/add-brand" className="primary_btn text-sm">
          Add New Brand
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg">
        <table className="dashboard_table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Brand Icon</th>
              <th>Brand Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  );
}
