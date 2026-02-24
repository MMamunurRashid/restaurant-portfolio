import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetContactMsgByIdQuery } from "../../../Redux/contactMsg/contactMsgApi";

export default function ContactMsgDetail() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useGetContactMsgByIdQuery(id);
  const message = data?.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let content = null;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = (
      <p className="text-red-500">
        Failed to fetch the message: {error?.message}
      </p>
    );
  } else if (message) {
    content = (
      <div className="rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Contact Message Details</h2>
        <p>
          <strong>Name:</strong> {message?.name}
        </p>
        <p>
          <strong>Email:</strong> {message?.email}
        </p>
        <p>
          <strong>Phone:</strong> {message?.phone}
        </p>
        <p>
          <strong>Message:</strong> {message?.message}
        </p>
      </div>
    );
  } else {
    content = <p>No message found!</p>;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto">
        <h1 className="mb-6 text-2xl font-medium">View Client Message</h1>
        {content}
      </div>
    </section>
  );
}
