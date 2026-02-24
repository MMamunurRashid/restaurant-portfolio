import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  useDeleteCampaignBannerMutation,
  useGetCampaignBannersQuery,
} from "../../../../Redux/campaignBanner/campaignBannerApi";
import Spinner from "../../../../components/Spinner/Spinner";
import Swal from "sweetalert2";

export default function CampaignBanners() {
  const { data, isLoading } = useGetCampaignBannersQuery();
  const [deleteCampaignBanner] = useDeleteCampaignBannerMutation();

  const handleDeleteBanner = async (id) => {
    const isConfirm = window.confirm("are you sure delete this banner?");
    if (isConfirm) {
      await deleteCampaignBanner(id);
      Swal.fire("", "Delete success", "success");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="bg-base-100 shadow rounded">
      <div className="p-4 border-b text-neutral font-medium flex justify-between items-center">
        <h3>Campaign Banner Lists</h3>
        <Link
          to="/admin/ecommerce-setting/add-campaign-banner"
          className="primary_btn"
        >
          Add Campaign Banner
        </Link>
      </div>
      <div className="p-4">
        <div className="relative overflow-x-auto shadow-lg">
          <table className="dashboard_table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Banner Image</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length > 0 ? (
                data?.data?.map((banner) => (
                  <tr key={banner?._id}>
                    <td>{banner?.order}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/campaignBanner/${banner?.image}`}
                          alt=""
                          className="w-16 h-10"
                        />
                      </div>
                    </td>
                    <td>{banner?.link}</td>
                    <td>
                      <div className="flex items-center gap-2 text-lg">
                        <Link
                          to={`/admin/ecommerce-setting/edit-campaign-banner/${banner?._id}`}
                          className="hover:text-red-500 duration-200"
                        >
                          <MdEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteBanner(banner?._id)}
                          className="hover:text-red-500 duration-200"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <p className="text-neutral-content p-4">No Banner Available</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
