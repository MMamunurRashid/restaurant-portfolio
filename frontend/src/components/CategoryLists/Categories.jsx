import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import SubCategories from "./SubCategories";

export default function Categories({ category }) {
  if (category?.subCategories?.length > 0) {
    return (
      <li className="relative">
        <Link
          to={`/shops/${category?.slug}`}
          className="p-2 flex items-center justify-between hover:bg-gray-100 duration-300"
        >
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/categories/${
                category?.icon
              }`}
              alt=""
              className="w-6 h-6"
            />
            {category?.name}
          </div>

          <i className="text-neutral-content">
            <IoIosArrowForward />
          </i>
        </Link>

        <ol className="category_dropdown">
          {category?.subCategories?.map((subCategory) => (
            <SubCategories
              key={subCategory?._id}
              category={category}
              subCategory={subCategory}
            />
          ))}
        </ol>
      </li>
    );
  } else {
    return (
      <li>
        <Link
          to={`/shops/${category?.slug}`}
          className="p-2 flex items-center gap-2 hover:bg-gray-100 duration-300"
        >
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/categories/${
              category?.icon
            }`}
            alt=""
            className="w-6 h-6"
          />
          {category?.name}
        </Link>
      </li>
    );
  }
}
