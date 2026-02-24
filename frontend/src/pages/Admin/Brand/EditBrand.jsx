import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useBrandByIdQuery,
  useEditBrandMutation,
} from "../../../Redux/brand/brandApi";

export default function EditBrand() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [icons, seticons] = useState([]);
  const { data } = useBrandByIdQuery(id);
  const [editBrand, { isLoading: editLoading }] = useEditBrandMutation();

  const handleAEditBrand = async (e) => {
    e.preventDefault();
    let icon = icons[0]?.file;
    const name = e.target.name.value;

    const formData = new FormData();
    formData.append("name", name);
    if (icon?.length > 0) formData.append("icon", icon);

    const res = await editBrand({ formData, id });
    if (res?.data?.success) {
      Swal.fire("", "Brand update success", "success");
      navigate("/admin/brands");
    }
  };

  return (
    <form
      onSubmit={handleAEditBrand}
      className="p-4 bg-base-100 shadhow rounded sm:w-1/2"
    >
      <div>
        <p className="text-neutral-content">Icon</p>
        <ImageUploading
          value={icons}
          onChange={(icn) => seticons(icn)}
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

              <div className={`${icons?.length > 0 && "mt-4"} `}>
                {icons?.map((img, index) => (
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

        {data?.data?.icon && (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/brands/${
              data?.data?.icon
            }`}
            alt=""
            className="w-40 rounded mt-4"
          />
        )}
      </div>

      <div className="form_group mt-2">
        <p className="text-neutral-content">Brand name</p>
        <input type="text" name="name" defaultValue={data?.data?.name} />
      </div>

      <div className="mt-4">
        <button
          className="primary_btn text-sm"
          disabled={editLoading && "disabled"}
        >
          {editLoading ? "Loading" : "Edit Brand"}
        </button>
      </div>
    </form>
  );
}
