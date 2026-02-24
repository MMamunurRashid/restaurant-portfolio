import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  useDeleteContactMsgMutation,
  useGetAllContactMsgsQuery,
} from "../../../Redux/contactMsg/contactMsgApi";

export default function ContactMsgList() {
  const { data, isLoading, isError, isSuccess } = useGetAllContactMsgsQuery();
  const contactMessages = data?.data;

  const [deleteContactMsg] = useDeleteContactMsgMutation();

  const deleteContactMsgHandler = async (id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (isConfirm) {
      try {
        const res = await deleteContactMsg(id).unwrap();
        if (res?.success) {
          Swal.fire({
            title: "",
            text: "Contact message deleted successfully",
            icon: "success",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "",
          text: "Something went wrong",
          icon: "error",
        });
        console.log(error);
      }
    }
  };

  let content = null;
  if (isLoading) return (content = <p>Loading...</p>);

  if (isError) {
    content = <p className="mt-5 text-red-500">Failed to load messages</p>;
  }

  if (!isError && isSuccess) {
    content = (
      <tbody>
        {contactMessages?.map((msg) => (
          <tr key={msg?._id}>
            <td>{new Date(msg?.createdAt).toLocaleDateString()}</td>
            <td>{msg?.name}</td>
            <td>{msg?.email}</td>
            <td>
              <div className="flex gap-2">
                <Link to={`/admin/contact-msg/${msg?._id}`}>
                  <IoEye className="text-lg hover:text-red-500" />
                </Link>
                <button onClick={() => deleteContactMsgHandler(msg?._id)}>
                  <AiOutlineDelete className="text-lg hover:text-red-500" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <section>
      <div className="rounded border-b bg-base-100 p-4">
        <h1 className="font-medium text-neutral">Client Messages</h1>
      </div>

      <div className="relative mt-2 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          {content}
        </table>
      </div>
    </section>
  );
}
