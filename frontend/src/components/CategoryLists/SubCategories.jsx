import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export default function SubCategories({ category, subCategory }) {
  if (subCategory?.subSubCategories?.length > 0) {
    return (
      <li className="relative">
        <Link
          to={`/shops/${category?.slug}/${subCategory?.slug}`}
          className="p-2 flex items-center justify-between hover:bg-gray-100 duration-300"
        >
          <div className="flex items-center gap-2">{subCategory?.name}</div>

          <i className="text-neutral-content">
            <IoIosArrowForward />
          </i>
        </Link>

        <ol className="category_sub_dropdown">
          {subCategory?.subSubCategories?.map((subSubCategory) => (
            <li key={subSubCategory?._id}>
              <Link
                to={`/shops/${category?.slug}/${subCategory?.slug}/${subSubCategory?.slug}`}
                className="flex p-2 hover:bg-gray-100 duration-300"
              >
                {subSubCategory?.name}
              </Link>
            </li>
          ))}
        </ol>
      </li>
    );
  } else {
    return (
      <li>
        <Link
          to={`/shops/${category?.slug}/${subCategory?.slug}`}
          className="flex p-2 hover:bg-gray-100 duration-300"
        >
          {subCategory?.name}
        </Link>
      </li>
    );
  }
}
