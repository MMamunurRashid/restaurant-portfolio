import { useState } from "react";
import ImageUploading from "react-images-uploading";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { useAddCampaignBannerMutation } from "../../../../Redux/campaignBanner/campaignBannerApi";
import { useNavigate } from "react-router-dom";

export default function AddCampaignBanner() {
  const [images, setImages] = useState([]);

  const [addBanner, { isLoading, isError, error }] =
    useAddCampaignBannerMutation();

  const navigate = useNavigate();

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    const image = images[0]?.file;
    if (!image) {
      return Swal.fire("", "Image is required", "error");
    }

    const form = e.target;
    const link = form.link.value;
    const order = form.order.value;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("link", link);
    formData.append("order", order);

    const res = await addBanner(formData);
    if (res?.data?.success) {
      Swal.fire("", "Banner add success", "success");
      navigate("/admin/ecommerce-setting/campaign-banner");
      setImages([]);
      form.reset();
    }
  };

  return (
    <section className="md:w-[600px] bg-base-100 shadow rounded">
      <div className="p-4 border-b text-neutral font-medium">
        <h3>Add New Campaign Banner</h3>
      </div>
      <form onSubmit={handleAddCampaign} className="p-4 flex flex-col gap-4">
        <div>
          <ImageUploading
            value={images}
            onChange={(icn) => setImages(icn)}
            dataURLKey="data_url"
          >
            {({ onImageUpload, onImageRemove, dragProps }) => (
              <div
                className="border rounded border-dashed p-4 w-max"
                {...dragProps}
              >
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span
                    onClick={onImageUpload}
                    className="px-4 py-1.5 rounded-2xl text-base-100 bg-primary cursor-pointer text-sm"
                  >
                    Choose Image
                  </span>

                  <p className="text-neutral-content">or Drop here</p>
                </div>

                <div className={`${images?.length > 0 && "mt-4"} `}>
                  {images?.map((img, index) => (
                    <div key={index} className="image-item relative">
                      <img src={img["data_url"]} alt="" className="w-40" />
                      <div
                        onClick={() => onImageRemove(index)}
                        className="w-7 h-7 bg-primary rounded-full flex justify-center items-center text-base-100 absolute top-0 right-0 cursor-pointer"
                      >
                        <AiFillDelete />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-neutral-content">Link</p>
          <input
            type="text"
            name="link"
            placeholder="Enter Link"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-neutral-content">Order</p>
          <input
            type="number"
            name="order"
            placeholder="Enter Link"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
          />
        </div>

        {isError && (
          <p className="text-xs text-red-500">
            {error?.data?.error ? error?.data?.error : "Something went wrong"}
          </p>
        )}

        <div className="flex justify-end mt-6 border-t p-4">
          <button disabled={isLoading && "disabled"} className="primary_btn">
            {isLoading ? "Loading..." : "Add Campaign Banner"}
          </button>
        </div>
      </form>
    </section>
  );
}
