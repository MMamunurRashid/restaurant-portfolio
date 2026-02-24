import { useGetCategoriesQuery } from "../../Redux/category/categoryApi";
import SideCategory from "../Skeleton/SideCategory/SideCategory";
import Categories from "./Categories";

export default function CategoryLists() {
  const { data, isLoading, isError, error } = useGetCategoriesQuery();
  const categories = data?.data?.slice(0, 10);

  let content = null;
  if (isLoading) {
    content = <SideCategory />;
  }
  if (!isLoading && isError) {
    content = <p>{error.error}</p>;
  }
  if (!isLoading && !isError && categories?.length > 0) {
    content = categories?.map((category) => (
      <Categories key={category?._id} category={category} />
    ));
  }
  return (
    <ul className="w-[266px] flex flex-col text-[15px] categories bg-base-100">
      {content}
    </ul>
  );
}
