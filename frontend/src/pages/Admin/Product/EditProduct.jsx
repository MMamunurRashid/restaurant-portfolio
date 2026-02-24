import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetCategoriesQuery } from "../../../Redux/category/categoryApi";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../Redux/product/productApi";
import Spinner from "../../../components/Spinner/Spinner";

export default function EditProduct() {
  const navigate = useNavigate();

  const editor = useRef(null);
  const { id } = useParams();

  const { data, isLoading, isError, error } = useGetProductByIdQuery(id);
  const product = data?.data;

  const [categoryId, setCategoryId] = useState("");
  const { data: categories } = useGetCategoriesQuery();

  const [images, setImages] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [details, setDetails] = useState("");
  useEffect(() => {
    if (product?.featured) setFeatured(product?.featured);
  }, [product]);

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setVariants(product?.variants);
    }
  }, [product]);

  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const discount = form.discount.value;
    const sellingPrice = form.selling_price ? form.selling_price.value : "";
    const duration = form.duration ? form.duration.value : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("discount", discount);
    formData.append("featured", featured);
    formData.append("description", details || product?.description);
    formData.append("sellingPrice", sellingPrice);
    formData.append("duration", duration);

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image.file); // Ensure the images are added as file objects
      });
    }

    formData.append("variants", JSON.stringify(variants));

    const res = await updateProduct({ id, formData });

    if (res?.error) {
      Swal.fire("", "Service update failed, please try again", "error");
    }

    if (res?.data?.success) {
      Swal.fire("", "Service updated successfully", "success");
      form.reset();
      navigate("/admin/service/all-services");
    }
  };

  let content = null;
  if (isLoading) {
    return (content = <Spinner />);
  }
  if (!isLoading && isError) {
    content = <p>{error?.data?.error}</p>;
  }

  if (!isLoading && !isError) {
    content = (
      <>
        <h3 className="text-lg text-neutral font-medium mb-4">Edit Service</h3>
        <form onSubmit={handleUpdateProduct} className="text-neutral-content">
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

                    {product?.images?.length &&
                      !images?.length &&
                      product?.images?.map((img, i) => (
                        <img
                          key={i}
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/products/${img}`}
                          alt=""
                          className="w-full h-20"
                        />
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
                  required
                  defaultValue={product?.title}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm">Category *</p>
                  <select
                    name="category"
                    required
                    onChange={(e) => setCategoryId(e.target.value)}
                    defaultValue={product?.category?._id}
                  >
                    <option value={product?.category?._id}>
                      {product?.category?.name}
                    </option>
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
                    defaultValue={product?.discount}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="mt-4 border rounded p-4">
            <div className="mt-2 border rounded p-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm">Price</p>
                  <input
                    type="number"
                    name="selling_price"
                    required
                    className="border py-1.5 px-2 rounded"
                    defaultValue={product?.sellingPrice}
                  />
                </div>
                <div>
                  <p className="text-sm">Duration</p>
                  <input
                    type="number"
                    name="duration"
                    required
                    className="border py-1.5 px-2 rounded"
                    defaultValue={product?.duration}
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
                    checked={product?.featured && featured}
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
                value={
                  details || product?.description || "Enter Service Description"
                }
                onBlur={(text) => setDetails(text)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={updateLoading && "disabled"}
              className="bg-primary text-base-100 px-10 py-2 rounded"
            >
              {updateLoading ? "Loading..." : "Update Service"}
            </button>
          </div>
        </form>
      </>
    );
  }

  return <div className="add_product text-neutral-content">{content}</div>;
}
