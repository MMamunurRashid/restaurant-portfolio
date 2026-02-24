import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCreateGalleryMutation } from "../../../Redux/gallery/galleryApi";

export default function AddGallery() {
  const navigate = useNavigate();

  const [createGallery, { isLoading }] = useCreateGalleryMutation();

  const [image, setImage] = useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();

    const img = image[0]?.file;

    const formData = new FormData();
    formData.append("image", img);

    try {
      const res = await createGallery(formData).unwrap();

      if (res?.success) {
        setImage([]);
        Swal.fire("", "Gallery added successfully", "success");
        navigate("/admin/gallery");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("", error.message || "Something went wrong!", "error");
    }
  };

  return (
    <section className="rounded bg-base-100 shadow">
      <div className="border-b p-4">
        <h3 className="font-medium text-neutral">Gallery</h3>
      </div>

      <form onSubmit={handleAdd} className="p-4">
        <div className="flex flex-col gap-3">
          <div>
            <div>
              <p className="mb-1">Image</p>
              <div>
                <ImageUploading
                  value={image}
                  onChange={(icn) => setImage(icn)}
                  dataURLKey="data_url"
                >
                  {({ onImageUpload, onImageRemove, dragProps }) => (
                    <div
                      className="rounded border border-dashed p-4"
                      {...dragProps}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          onClick={onImageUpload}
                          className="w-max cursor-pointer rounded-2xl bg-primary px-4 py-1.5 text-sm text-base-100"
                        >
                          Choose Image
                        </span>

                        <p className="text-neutral-content">or Drop here</p>
                      </div>

                      <div className={`${image?.length > 0 && "mt-4"} `}>
                        {image?.map((img, index) => (
                          <div key={index} className="image-item relative">
                            <img
                              src={img["data_url"]}
                              alt=""
                              className="h-20 w-20"
                            />
                            <div
                              onClick={() => onImageRemove(index)}
                              className="absolute right-0 top-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-base-100"
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
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={isLoading}
            className="bg-primary py-2 px-3 rounded text-white text-sm"
          >
            {isLoading ? "Loading.." : "Add"}
          </button>
        </div>
      </form>
    </section>
  );
}
