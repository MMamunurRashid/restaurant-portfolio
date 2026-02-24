import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddCategoryMutation,
  useGetCategoriesQuery,
} from "../../../../Redux/category/categoryApi";

export default function AddCategory() {
  const navigate = useNavigate();
  const [addCategory, { isLoading, isSuccess, isError }] =
    useAddCategoryMutation();
  const { data } = useGetCategoriesQuery({});

  const orderNum = data?.data?.length + 1;

  const [icons, seticons] = useState([]);
  const [name, setName] = useState("");
  const [order, setOrder] = useState(orderNum);

  const handleAddCategory = () => {
    let icon = icons[0]?.file;
    if (!icon) {
      return Swal.fire("", "Icon is required", "error");
    }
    if (name === "") {
      return Swal.fire("", "category name is required", "error");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("icon", icon);
    formData.append("order", order);

    addCategory(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire("", "add success", "success");
      seticons([]);
      setName("");
      navigate("/admin/services");
    }
    if (isError) {
      Swal.fire("", "Add category fail, please try again", "error");
    }
  }, [isSuccess, isError, navigate]);

  return (
    <div className="p-4 bg-base-100 shadhow rounded sm:w-1/2">
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
      </div>

      <div className="form_group mt-2">
        <p className="text-neutral-content">Category name</p>
        <input type="text" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form_group mt-2">
        <p className="text-neutral-content">Category Order</p>
        <input
          type="number"
          defaultValue={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleAddCategory}
          className="primary_btn text-sm"
          disabled={isLoading && "disabled"}
        >
          {isLoading ? "Loading.." : "Add category"}
        </button>
      </div>
    </div>
  );
}
