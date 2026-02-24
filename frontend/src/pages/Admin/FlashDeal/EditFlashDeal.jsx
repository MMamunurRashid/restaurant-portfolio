import { useNavigate, useParams } from "react-router-dom";
import Select from "react-dropdown-select";
import { useGetAllProductsQuery } from "../../../Redux/product/productApi";
import { useEffect, useState } from "react";
import {
  useAddFlashDealMutation,
  useGetFlashDealByIdQuery,
} from "../../../Redux/flashDeal/flashDeal";
import Swal from "sweetalert2";

export default function EditFlashDeal() {
  const { id } = useParams();
  const { data: deal, isLoading: dealIslOading } = useGetFlashDealByIdQuery(id);

  const [selectedProducts, setSelectedProducts] = useState([]);

  console.log(deal?.data?.flashProducts);

  const { data: productData } = useGetAllProductsQuery();
  const products = productData?.data;
  const [flashProducts, setFlashProducts] = useState([]);

  const [addFlashDeal, { isLoading }] = useAddFlashDealMutation();

  // Function to handle changes in input fields
  const handleInputChange = (productIndex, field, value) => {
    setFlashProducts((prevFlashProducts) => {
      const updatedFlashProducts = [...prevFlashProducts];

      if (!updatedFlashProducts[productIndex]) {
        updatedFlashProducts[productIndex] = [];
      }

      // Store all information (color, size, quantity, price) in each entry
      updatedFlashProducts[productIndex] = {
        ...updatedFlashProducts[productIndex],
        product: selectedProducts[productIndex]?._id,
        [field]: value,
      };

      return updatedFlashProducts;
    });
  };

  const handleAddFlashDeal = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;

    const flashProductsInfo = {
      title,
      startDate,
      endDate,
      flashProducts,
    };

    const res = await addFlashDeal(flashProductsInfo);

    if (res?.data?.success) {
      Swal.fire("", "Flash deal add success", "success");
      setSelectedProducts([]);
      form.reset();
      setFlashProducts([]);
    } else {
      Swal.fire("", "Something went wrong", "error");
    }
  };

  if (dealIslOading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="bg-base-100 rounded p-3 text-neutral">
      <p>Offer Information</p>

      <form
        onSubmit={handleAddFlashDeal}
        className="mt-6 xl:w-2/3 mx-auto flex flex-col gap-4 text-sm"
      >
        <div className="flex flex-col gap-1">
          <p>Title</p>
          <input
            type="text"
            className="border rounded outline-none px-4 py-1"
            name="title"
            defaultValue={deal?.data?.title}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p>Start Date</p>
            <input
              type="date"
              className="border rounded outline-none px-4 py-1"
              name="startDate"
              defaultValue={deal?.data?.startDate}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>End Date</p>
            <input
              type="date"
              className="border rounded outline-none px-4 py-1"
              name="endDate"
              defaultValue={deal?.data?.endDate}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p>Services</p>
          <Select
            multi
            options={products}
            labelField="title"
            valueField="title"
            onChange={(product) => setSelectedProducts(product)}
            values={selectedProducts}
          />
        </div>

        {selectedProducts?.length > 0 && (
          <div className="flex flex-col gap-1">
            <p>Discounts</p>
            <div className="relative overflow-x-auto shadow-lg">
              <table className="dashboard_table">
                <thead>
                  <tr>
                    <th className="border-r border-b bg-gray-100">Product</th>
                    <th className="border-r border-b bg-gray-100">
                      Base Price
                    </th>
                    <th className="bg-gray-100 border-r border-b">Discount</th>
                    <th className="bg-gray-100 border-b">Discount Type</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts?.map((product, productIndex) => (
                    <tr key={product?._id}>
                      <td className="border-r">
                        <div className="flex items-center gap-2">
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/products/${product?.images[0]}`}
                            alt=""
                            className="w-8 h-8 rounded"
                          />
                          <p>{product?.title}</p>
                        </div>
                      </td>
                      <td className="border-r">
                        <p>
                          {product?.variants?.length > 0
                            ? product?.variants[0]?.sellingPrice
                            : product?.sellingPrice}
                        </p>
                      </td>
                      <td className="border-r">
                        <input
                          type="number"
                          name=""
                          className="w-28 border rounded outline-none px-4 py-1"
                          onChange={(e) =>
                            handleInputChange(
                              productIndex,
                              "discount",
                              e.target.value
                            )
                          }
                          required
                        />
                      </td>
                      <td>
                        <select
                          className="border rounded outline-none px-4 py-1"
                          onChange={(e) =>
                            handleInputChange(
                              productIndex,
                              "discountType",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="1">%</option>
                          <option value="2">$</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <button disabled={isLoading && "disabled"} className="primary_btn">
            {isLoading ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}
