import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
} from "../../../Redux/review/reviewApi";
import Pagination from "../../../components/Pagination/Pagination";

export default function AllReview() {
  const [currentPage, setCurrentPage] = useState(1);
  const [description, setDescription] = useState("");

  const { loggedUser } = useSelector((state) => state.user);
  const user = loggedUser?.data;

  const query = {};
  query["limit"] = 5;
  query["page"] = currentPage;
  query["description"] = description;
  const { data } = useGetAllReviewsQuery({ ...query });
  const [deleteReview] = useDeleteReviewMutation();
  // console.log(data?.data);

  const pages = Math.ceil(
    parseInt(data?.meta?.total) / parseInt(data?.meta?.limit),
  );

  const handleReviewDelete = async (reviewId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?",
    );
    if (!confirm) return;

    const data = {
      user: user?._id,
    };
    await deleteReview({ reviewId, data }).unwrap();
    Swal.fire("", "Review deleted successfully", "success");
  };

  return (
    <div>
      <div className=" bg-base-100 shadow-lg p-3 rounded-md mb-1 flex items-center justify-between">
        <h1 className="text-2xl">AllReview</h1>
        <input
          type="text"
          name=""
          id=""
          className="border-2 border-gray-800 rounded-md p-2 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary"
          placeholder="Search by description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="bg-base-100 shadow-lg min-h-[80vh] p-3">
        {data?.data && data?.data?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data?.data?.map((review) => (
              <div key={review?._id} className="border-b p-3 relative">
                <div className="flex items-center gap-5">
                  <img
                    src={
                      user?.image === "" || user?.image === null
                        ? "/images/demo_user.jpg"
                        : `${import.meta.env.VITE_BACKEND_URL}/user/${
                            user?.image
                          }`
                    }
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p>{review?.user?.name}</p>
                      <p className="text-neutral-content text-sm">
                        {review?.createdAt?.split("T")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-2.5 text-sm text-neutral-content">
                  {review?.description}
                </p>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleReviewDelete(review?._id)}
                    className="text-lg text-neutral-content hover:text-primary duration-200 "
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}

            {/* pagination */}
            <div className="p-3">
              <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pages={pages}
              />
            </div>
          </div>
        ) : (
          <p className="text-center py-4 text-neutral-content">
            There have been no reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
