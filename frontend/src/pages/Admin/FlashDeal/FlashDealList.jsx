import { BiSolidPencil } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import Swal from "sweetalert2";
import {
  useDeleteFlashDealMutation,
  useGetFlashDealQuery,
  useToggleFlashDealStatusMutation,
} from "../../../Redux/flashDeal/flashDeal";

export default function FlashDealList() {
  const { data, isLoading, isError, error } = useGetFlashDealQuery();
  const [toggleFlashDealStatus] = useToggleFlashDealStatusMutation();
  const [deleteFlasgDeal] = useDeleteFlashDealMutation();

  const handleUpdateStatus = async (id) => {
    const isConfirm = window.confirm("Are you sure update status?");
    if (isConfirm) {
      const res = await toggleFlashDealStatus(id);
      console.log(res);
    }
  };

  // Delete FlasgDeal
  const handleDeleteFlashDeal = async (id) => {
    const isConfirm = window.confirm("Are you sure delete this FlasgDeal");
    if (isConfirm) {
      const result = await deleteFlasgDeal(id);
      if (result?.data?.success) {
        Swal.fire("", "FlasgDeal Delete Success", "success");
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
    content = data?.data?.map((flashDeal, i) => (
      <tr key={flashDeal?._id}>
        <td>{i + 1}</td>
        <td>{flashDeal?.title}</td>
        <td>{flashDeal?.flashProducts?.length}</td>
        <td>{flashDeal?.startDate}</td>
        <td>{flashDeal?.endDate}</td>
        <td>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              defaultChecked={flashDeal?.status}
              type="checkbox"
              value={flashDeal?.status}
              className="sr-only peer"
              onClick={() => handleUpdateStatus(flashDeal?._id)}
            />
            <div className="w-11 h-[23px] bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.5px] after:start-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </td>

        <td>
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/flash-deal/edit/${flashDeal?._id}`}
              className="hover:text-green-700 duration-200"
            >
              <BiSolidPencil />
            </Link>
            <button
              onClick={() => handleDeleteFlashDeal(flashDeal?._id)}
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
      <div className="flex justify-between items-end mb-3">
        <h1 className="text-lg text-neutral-content">Offers</h1>
        <Link to="/admin/flash-deal/add" className="primary_btn text-sm">
          Add New Offer
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg">
        <table className="dashboard_table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Title</th>
              <th>Total Services</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  );
}
