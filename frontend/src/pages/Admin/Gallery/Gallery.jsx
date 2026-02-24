import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import Spinner from "../../../components/Spinner/Spinner";
import { useDeleteGalleryByIdMutation, useGetGalleryQuery } from "../../../Redux/gallery/galleryApi";

export default function Gallery() {
  const { data, isLoading, isError, isSuccess } = useGetGalleryQuery();
  const gallery = data?.data?.result;

  const [deleteGallery] = useDeleteGalleryByIdMutation();
  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure delete this product?");
    if (isConfirm) {
      try {
        const res = await deleteGallery(id).unwrap();
        if (res?.success) {
          Swal.fire({
            title: "",
            text: "Gallery Deleted Successfully",
            icon: "success",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "",
          text: "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  let content = null;
  if (isLoading) return (content = <Spinner />);

  if (isError) {
    content = (
      <p className="text-red-500 mt-5">Something went wrong to get data!</p>
    );
  }

  if (!isError && isSuccess) {
    content = (
      <tbody>
        {gallery?.map((gallery, i) => (
          <tr key={gallery?._id}>
            <td>{i + 1}</td>
            <td>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/gallery/${
                  gallery?.image
                }`}
                alt={gallery?.image}
                className="w-14 h-14 object-cover rounded"
              />
            </td>
            <td>
              <div className="flex gap-3 items-center">
                <button onClick={() => handleDelete(gallery?._id)}>
                  <AiOutlineDelete className="text-lg hover:text-red-500" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <section>
      <div className="p-4 border-b bg-base-100 rounded">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-neutral">Gallery</h1>
          <Link
            to="/admin/gallery/add"
            className="bg-primary py-2 px-3 rounded text-white text-sm"
          >
            Add Gallery
          </Link>
        </div>
      </div>

      <div className="relative overflow-x-auto mt-2">
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          {content}
        </table>
      </div>
    </section>
  );
}
