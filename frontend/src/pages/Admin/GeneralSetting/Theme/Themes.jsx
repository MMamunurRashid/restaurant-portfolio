import { useEffect, useState } from "react";
import swal from "sweetalert2";
import {
  useAddThemeMutation,
  useGetThemesQuery,
  useUpdateThemeMutation,
} from "../../../../Redux/theme/themeApi";

export default function Themes() {
  const { data } = useGetThemesQuery();
  const theme = data?.data[0];
  const id = theme?._id;

  const [pColor, setPColor] = useState("");
  const [sColor, setSColor] = useState("");
  const [aColor, setAColor] = useState("");

  const [
    addTheme,
    {
      isLoading: addIsLoading,
      isError: addIsError,
      error: addError,
      isSuccess: addIsSuccess,
    },
  ] = useAddThemeMutation();

  const [
    updateTheme,
    {
      isLoading: updateIsLoading,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateThemeMutation();

  const hanldeAddUpdate = async (e) => {
    e.preventDefault();

    const primary = e.target.primary.value;
    const secondary = e.target.secondary.value;
    const accent = e.target.accent.value;

    const data = {
      primary,
      secondary,
      accent,
    };

    if (id) {
      await updateTheme({ id, data });
    } else {
      await addTheme(data);
    }
  };

  useEffect(() => {
    if (addIsError) {
      swal.fire(
        "",
        addError?.data?.error ? addError?.data?.error : "Something went wrong",
        "error"
      );
      return;
    }
    if (addIsSuccess && !id) {
      swal.fire("", "Theme Added Successfully", "success");

      return;
    }
    if (updateIsError) {
      swal.fire(
        "",
        updateError?.data?.error
          ? updateError?.data?.error
          : "Something went wrong",
        "error"
      );
      return;
    }
    if (updateIsSuccess && id) {
      swal.fire("", "Theme Updated Successfully", "success");

      return;
    }
  }, [
    addIsError,
    addIsSuccess,
    updateIsError,
    updateIsSuccess,
    addError,
    updateError,
    id,
  ]);

  return (
    <section className="bg-base-100 rounded shadow">
      <div className="p-4 border-b">
        <h3 className="font-medium text-neutral">Theme</h3>
      </div>

      <form className="p-4 form_group" onSubmit={hanldeAddUpdate}>
        <div className="text-neutral-content flex flex-col gap-3 sm:w-1/3">
          <div>
            <p className="mb-1 flex items-center gap-2">
              Primary Color{" "}
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: theme?.primary }}
              ></span>
            </p>
            <div className="flex">
              <input
                type="text"
                name="primary"
                required
                defaultValue={pColor ? pColor : theme?.primary}
              />
              <input
                type="color"
                className="w-6 h-9 rounded"
                onChange={(e) => setPColor(e.target.value)}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-2">
              Secondary Color{" "}
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: theme?.secondary }}
              ></span>
            </p>
            <div className="flex">
              <input
                type="text"
                name="secondary"
                required
                defaultValue={sColor ? sColor : theme?.secondary}
              />
              <input
                type="color"
                className="w-6 h-9 rounded"
                onChange={(e) => setSColor(e.target.value)}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-2">
              Accent Color{" "}
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: theme?.accent }}
              ></span>
            </p>
            <div className="flex">
              <input
                type="text"
                name="accent"
                required
                defaultValue={aColor ? aColor : theme?.accent}
              />
              <input
                type="color"
                className="w-6 h-9 rounded"
                onChange={(e) => setAColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex gap-2">
            <button
              disabled={addIsLoading || (updateIsLoading && "disabled")}
              className="primary_btn"
            >
              {addIsLoading || updateIsLoading
                ? "Loading..."
                : theme?._id
                ? "Update"
                : "Add"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
