import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useGetCategoriesQuery } from "../../../Redux/category/categoryApi";
import { useAddProductMutation } from "../../../Redux/product/productApi";

import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const editor = useRef(null);
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const { data: categories } = useGetCategoriesQuery();

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [details, setDetails] = useState("");
  const [duration, setDuration] = useState("");

  const [addProduct, { isLoading }] = useAddProductMutation();

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (images?.length <= 0)
      return Swal.fire("", "Image is required", "warning");
    if (!title) return Swal.fire("", "Title is required", "warning");
    if (!categoryId) return Swal.fire("", "Category is required", "warning");
    if (!details) return Swal.fire("", "Details is required", "warning");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("discount", discount);
    formData.append("featured", featured);
    formData.append("description", details);
    formData.append("sellingPrice", sellingPrice);
    formData.append("duration", duration);
    images?.map((image) => {
      formData.append("images", image?.file);
    });

    const res = await addProduct(formData);

    if (res?.error) {
      Swal.fire("", "Service add Fail, please try again", "error");
    }

    if (res?.data?.success) {
      Swal.fire("", "Service add success", "success");
      setImages([]);
      setTitle("");
      setCategoryId("");
      setDiscount("");
      setSellingPrice("");
      setDuration("");
      setFeatured(false);
      setDetails("");
      navigate("/admin/service/all-services");
    }
  };

  return (
    <div className="add_product  bg-base-100 rounded shadow p-4">
      <h3 className="text-lg text-neutral font-medium mb-4">Add Service</h3>
      <div className="text-neutral-content">
        <div className="mb-5 border rounded p-4">
          <p className="text-sm mb-2">Add Images (max 5 images select)</p>
          <ImageUploading
            value={images}
            onChange={(img) => setImages(img)}
            dataURLKey="data_url"
            multiple={true}
            maxNumber={5}
          >
            {({ onImageUpload, onImageRemove, dragProps }) => (
              <div className="grid sm:grid-cols-2 gap-4" {...dragProps}>
                <div className="flex flex-col items-center justify-center gap-2 border rounded border-dashed p-3">
                  <span
                    onClick={onImageUpload}
                    className="px-4 py-1.5 rounded-2xl text-base-100 bg-primary cursor-pointer text-sm"
                  >
                    Choose Image
                  </span>

                  <p className="text-neutral-content">or Drop here</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border rounded border-dashed p-3">
                  {images?.map((img, index) => (
                    <div key={index} className="image-item relative">
                      <img
                        src={img["data_url"]}
                        alt=""
                        className="w-full h-20"
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
        </div>

        <div className="form_group">
          <div className="border rounded p-4  flex flex-col gap-3 mb-5">
            <div>
              <p className="text-sm">Service Title</p>
              <input
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm">Category *</p>
                <select
                  name="category"
                  required
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories?.data?.map((category) => (
                    <option key={category?._id} value={category?._id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Discount %</p>
                <input
                  type="number"
                  name="discount"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="mt-4 border rounded p-4">
            <div className="mt-2 border rounded p-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm">Selling Price</p>
                  <input
                    type="number"
                    name="selling_price"
                    required
                    onChange={(e) => setSellingPrice(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm">Duration</p>
                  <input
                    type="number"
                    name="duration"
                    required
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/*  Featured */}
          <div className="mt-6 border rounded p-4">
            <p className="text-sm">Featured Service</p>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <p>Status:</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    onChange={() => setFeatured(!featured)}
                    type="checkbox"
                    value={featured}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-[23px] bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.5px] after:start-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 add_product_details border rounded p-4">
            <p className="text-sm">Description</p>

            <div className="mt-2">
              <JoditEditor
                ref={editor}
                value={details}
                onBlur={(text) => setDetails(text)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddProduct}
              type="submit"
              disabled={isLoading && "disabled"}
              className="bg-primary text-base-100 px-10 py-2 rounded"
            >
              {isLoading ? "Loading..." : "Add Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
