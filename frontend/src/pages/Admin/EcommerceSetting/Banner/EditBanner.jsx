import { useState } from "react";
import ImageUploading from "react-images-uploading";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useEditBannerMutation,
  useGetBannerByIdQuery,
} from "../../../../Redux/banner/bannerApi";

export default function EditBanner() {
  const [images, setImages] = useState([]);
  const { id } = useParams();
  const { data } = useGetBannerByIdQuery(id);
  const [editCampaignBanner] = useEditBannerMutation();

  const navigate = useNavigate();

  const handleEditCampaign = async (e) => {
    e.preventDefault();
    const image = images[0]?.file;
    const link = e.target.link.value;
    const order = e.target.order.value;

    const formData = new FormData();
    if (images?.length > 0) formData.append("image", image);
    formData.append("link", link);
    formData.append("order", order);

    const res = await editCampaignBanner({ formData, id });
    if (res?.data?.success) {
      Swal.fire("", "Banner update success", "success");
      navigate("/admin/ecommerce-setting/banner");
    }
  };

  return (
    <section className="md:w-[600px] bg-base-100 shadow rounded">
      <div className="p-4 border-b text-neutral font-medium">
        <h3>Edit Campaign Banner</h3>
      </div>
      <form onSubmit={handleEditCampaign} className="p-4 flex flex-col gap-4">
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

          {data?.data?.image && (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/banner/${
                data?.data?.image
              }`}
              alt=""
              className="w-40 rounded mt-4"
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-neutral-content">Link</p>
          <input
            type="text"
            name="link"
            placeholder="Enter Link"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
            defaultValue={data?.data?.link}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-neutral-content">Order</p>
          <input
            type="text"
            name="order"
            placeholder="Enter Link"
            className="w-full px-3 py-2 border rounded outline-none text-sm"
            required
            defaultValue={data?.data?.order}
          />
        </div>

        <div className="flex justify-end mt-6 border-t p-4">
          <button className="primary_btn">Edit Campaign Banner</button>
        </div>
      </form>
    </section>
  );
}
