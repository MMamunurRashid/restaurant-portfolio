import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useAddAcademyMutation } from "../../../Redux/academy/academyApi";
import { AiFillDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";

export default function AddAcademy() {
  const editor = useRef(null);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  const [addAcademy, { isLoading }] = useAddAcademyMutation();

  // Handle add academy
  const handleAddAcademy = async (e) => {
    e.preventDefault();

    if (images.length <= 0)
      return Swal.fire("", "Image is required", "warning");
    if (!title) return Swal.fire("", "Title is required", "warning");
    if (!instructor) return Swal.fire("", "Instructor is required", "warning");
    if (!location) return Swal.fire("", "Location is required", "warning");
    if (!details) return Swal.fire("", "Description is required", "warning");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("instructor", instructor);
    formData.append("discount", discount);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("description", details);
    formData.append("image", images[0]?.file);

    const res = await addAcademy(formData);

    if (res?.error) {
      Swal.fire("", "Academy addition failed, please try again", "error");
    }

    if (res?.data?.success) {
      Swal.fire("", "Academy added successfully", "success");
      setImages([]);
      setTitle("");
      setInstructor("");
      setDiscount(0);
      setPrice(0);
      setDuration("");
      setLocation("");
      setDetails("");
      navigate("/admin/academy/all-academies");
    }
  };

  return (
    <div className="add_academy bg-base-100 rounded shadow p-4">
      <h3 className="text-lg text-neutral font-medium mb-4">Add Academy</h3>
      <div className="text-neutral-content">
        <div className="mb-5 border rounded p-4">
          <p className="text-sm mb-2">Add Image (1 image required)</p>
          <ImageUploading
            value={images}
            onChange={(img) => setImages(img)}
            dataURLKey="data_url"
            maxNumber={1}
          >
            {({ onImageUpload, onImageRemove, dragProps }) => (
              <div className="flex gap-4" {...dragProps}>
                <div
                  onClick={onImageUpload}
                  className="border-dashed border rounded p-3 cursor-pointer text-center"
                >
                  <span className="text-primary">Choose Image</span>
                </div>
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img.data_url} alt="" className="w-20 h-20" />
                    <AiFillDelete
                      onClick={() => onImageRemove(index)}
                      className="absolute top-0 right-0 cursor-pointer text-red-600"
                    />
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>
        </div>

        <form onSubmit={handleAddAcademy} className="form_group">
          <div className="mb-4">
            <p className="text-sm">Academy Title</p>
            <input type="text" onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-4">
            <p className="text-sm">Instructor</p>
            <input type="text" onChange={(e) => setInstructor(e.target.value)} required />
          </div>
          <div className="mb-4">
            <p className="text-sm">Location</p>
            <input type="text" onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm">Discount (%)</p>
              <input type="number" onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div>
              <p className="text-sm">Price</p>
              <input type="number" onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <p className="text-sm">Duration</p>
              <input type="text" onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm">Description</p>
            <JoditEditor ref={editor} value={details} onBlur={(text) => setDetails(text)} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {isLoading ? "Adding..." : "Add Academy"}
          </button>
        </form>
      </div>
    </div>
  );
}
