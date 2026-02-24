import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useGetAcademyByIdQuery,
  useUpdateAcademyMutation,
} from "../../../Redux/academy/academyApi";
import Spinner from "../../../components/Spinner/Spinner";

export default function EditAcademy() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editor = useRef(null);

  const { data, isLoading } = useGetAcademyByIdQuery(id);
  const academy = data?.data;

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  const [updateAcademy, { isLoading: updateLoading }] = useUpdateAcademyMutation();

  useEffect(() => {
    if (academy) {
      setTitle(academy.title);
      setInstructor(academy.instructor);
      setDiscount(academy.discount);
      setPrice(academy.price);
      setDuration(academy.duration);
      setLocation(academy.location);
      setDetails(academy.description);
    }
  }, [academy]);

  const handleUpdateAcademy = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("instructor", instructor);
    formData.append("discount", discount);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("description", details);
    if (images.length > 0) formData.append("image", images[0]?.file);

    const res = await updateAcademy({ id, formData });

    if (res?.error) {
      Swal.fire("", "Academy update failed, please try again", "error");
    }

    if (res?.data?.success) {
      Swal.fire("", "Academy updated successfully", "success");
      navigate("/admin/academy/all-academies");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="edit_academy bg-base-100 rounded shadow p-4">
      <h3 className="text-lg text-neutral font-medium mb-4">Edit Academy</h3>
      <form onSubmit={handleUpdateAcademy} className="text-neutral-content">
        {/* Image upload */}
        <div className="mb-5 border rounded p-4">
          <p className="text-sm mb-2">Change Image</p>
          <ImageUploading value={images} onChange={(img) => setImages(img)} dataURLKey="data_url">
            {({ onImageUpload, onImageRemove, dragProps }) => (
              <div className="flex gap-4" {...dragProps}>
                <div onClick={onImageUpload} className="border-dashed border rounded p-3 cursor-pointer text-center">
                  <span className="text-primary">Choose Image</span>
                </div>
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img.data_url} alt="" className="w-20 h-20" />
                    <AiFillDelete onClick={() => onImageRemove(index)} className="absolute top-0 right-0 cursor-pointer text-red-600" />
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>
        </div>

        {/* Form fields */}
        <div className="mb-4">
          <p className="text-sm">Academy Title</p>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <p className="text-sm">Instructor</p>
          <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} required />
        </div>
        <div className="mb-4">
          <p className="text-sm">Location</p>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm">Discount (%)</p>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
          <div>
            <p className="text-sm">Price</p>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <p className="text-sm">Duration</p>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm">Description</p>
          <JoditEditor ref={editor} value={details} onBlur={(text) => setDetails(text)} />
        </div>

        {/* Update button */}
        <button type="submit" disabled={updateLoading} className="bg-primary text-white px-4 py-2 rounded">
          {updateLoading ? "Updating..." : "Update Academy"}
        </button>
      </form>
    </div>
  );
}
