import { useEffect, useState } from "react";
import {
  useAddBusinessInfoMutation,
  useGetBusinessInfoQuery,
  useUpdateBusinessInfoMutation,
} from "../../../Redux/businessInfoApi/businessInfoApi";
import Swal from "sweetalert2";
import { BsX } from "react-icons/bs";
import {
  useAddSEOMutation,
  useGetSEOQuery,
  useUpdateSEOMutation,
} from "../../../Redux/seoApi";

export default function SEOSetting() {
  const { data, isLoading } = useGetSEOQuery();
  const seo = data?.data[0];
  const id = seo?._id;

  const [addSEO, { isLoading: addIsLoading }] = useAddSEOMutation();
  const [updateSEO, { isLoading: upIsLoading }] = useUpdateSEOMutation();

  const [keywords, setKeywords] = useState(seo?.keywords || []);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setKeywords(seo?.keywords);
    }
  }, [seo?.keywords, isLoading]);

  const handleAddKeyword = () => {
    setKeywords([...keywords, keyword]);
    setKeyword("");
  };

  const handleRemoveKeyword = (index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  const handleSEOSetting = async (e) => {
    e.preventDefault();
    const form = e.target;
    const author = form.author.value;
    const sitemapLink = form.sitemapLink.value;
    const metaContent = form.metaContent.value;
    const description = form.description.value;

    const data = {
      keywords,
      author,
      sitemapLink,
      metaContent,
      description,
    };

    if (id) {
      const res = await updateSEO({ id, data });
      if (res?.data?.success) {
        Swal.fire("", "SEO Setting Update Success", "success");
        setImages([]);
      } else {
        Swal.fire("", "Somethin wrong, please try again letter", "error");
      }
    } else {
      const res = await addSEO(data);
      if (res?.data?.success) {
        Swal.fire("", "SEO Setting Add Success", "success");
        setImages([]);
      } else {
        Swal.fire("", "Somethin wrong, please try again letter", "error");
      }
    }
  };

  return (
    <section className="bg-base-100 rounded shadow md:w-3/4 mx-auto">
      <div className="p-4 border-b">
        <h3 className="font-medium text-neutral">SEO Setting</h3>
      </div>

      <form
        onSubmit={handleSEOSetting}
        className="p-4 text-neutral-content form_group"
      >
        {/*  */}
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="mb-1">Keywords</p>
            <div className="flex items-center">
              <input
                type="text"
                name="size"
                placeholder="Press Enter and add Keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <div
                onClick={handleAddKeyword}
                className="w-10 h-[34px] rounded bg-primary text-base-100 flex justify-center items-center cursor-pointer mt-px"
              >
                +
              </div>
            </div>
            <div className="mt-2">
              {keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="mr-2 relative bg-gray-100 py-1 px-3 rounded whitespace-nowrap mb-2"
                >
                  {keyword}
                  <span
                    onClick={() => handleRemoveKeyword(index)}
                    className="absolute -top-1 -right-1 text-red-500 text-lg cursor-pointer"
                  >
                    <BsX />
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1">Author</p>
            <input type="text" name="author" defaultValue={seo?.author} />
          </div>

          <div>
            <p className="mb-1">Sitemap Link</p>
            <input
              type="text"
              name="sitemapLink"
              defaultValue={seo?.sitemapLink}
            />
          </div>

          <div>
            <p className="mb-1">Meta Content</p>
            <input
              type="text"
              name="metaContent"
              defaultValue={seo?.metaContent}
            />
          </div>

          <div className="col-span-2">
            <p className="mb-1">Description</p>
            <textarea
              name="description"
              rows="2"
              defaultValue={seo?.description}
            ></textarea>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex gap-2">
            <button
              disabled={(addIsLoading || upIsLoading) && "disabled"}
              className="primary_btn"
            >
              {addIsLoading || upIsLoading
                ? "Loading..."
                : id
                ? "Update SEO Setting"
                : "Add SEO Setting"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
