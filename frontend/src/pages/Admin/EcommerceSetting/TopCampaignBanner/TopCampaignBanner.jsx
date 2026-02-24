import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import Swal from "sweetalert2";
import Spinner from "../../../../components/Spinner/Spinner";

import {
  useAddTopCampaignBannerMutation,
  useGetTopCampaignBannersQuery,
  useUpdateTopCampaignBannerMutation,
} from "../../../../Redux/topCampaignBanner";

export default function TopCampaignBanner() {
  const [images, setImages] = useState([]);
  const { data, isLoading } = useGetTopCampaignBannersQuery();
  const [addBanner, { isLoading: addLoading }] =
    useAddTopCampaignBannerMutation();

  const [updateBanner, { isLoading: updateLoading }] =
    useUpdateTopCampaignBannerMutation();

  const id = data?.data[0]?._id;

  const handleUpdateAddMainBanner = async () => {
    const image = images[0]?.file;
    if (!image) {
      return Swal.fire("", "image is required", "error");
    }

    let formData = new FormData();
    formData.append("image", image);

    if (data?.data?.length > 0) {
      const res = await updateBanner({ id, formData });
      if (res?.data?.success) {
        Swal.fire("", "Banner Update success", "success");
        setImages([]);
      } else {
        Swal.fire("", "Somethin wrong, please try again letter", "error");
      }
    } else {
      const res = await addBanner(formData);
      if (res?.data?.success) {
        Swal.fire("", "Banner Add success", "success");
        setImages([]);
      } else {
        Swal.fire("", "Somethin wrong, please try again letter", "error");
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <div className="p-4 border-b bg-base-100 rounded">
        <h1 className="font-medium text-neutral">Top Campaign Banner</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="bg-base-100 rounded shadow">
          <div className="p-4">
            <div>
              <p className="text-neutral-content border-b">Banner</p>
              <div className="p-4 flex flex-col">
                <ImageUploading
                  value={images}
                  onChange={(file) => setImages(file)}
                  dataURLKey="data_url"
                >
                  {({ onImageUpload, onImageRemove, dragProps }) => (
                    <div
                      className="border rounded border-dashed p-4 w-max"
                      {...dragProps}
                    >
                      <div className="flex items-center gap-2">
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
                            <img
                              src={img["data_url"]}
                              alt=""
                              className="w-full h-28 rounded"
                            />
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

                {data?.data[0]?.image && images?.length >= 0 && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/banner/${
                      data?.data[0]?.image
                    }`}
                    alt=""
                    className="w-full h-28 mt-4 rounded"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 border-t p-4">
            <button
              disabled={(updateLoading || addLoading) && "disabled"}
              onClick={handleUpdateAddMainBanner}
              className="primary_btn"
            >
              {updateLoading || addLoading
                ? "Loading"
                : id
                ? "Update Banner"
                : "Add Banner"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
