import { useGetCategoriesQuery } from "../../../Redux/category/categoryApi";
import { useGetAllProductsQuery } from "../../../Redux/product/productApi";
import { useAllUsersQuery } from "../../../Redux/user/userApi";
import { useGetAllAdminsQuery } from "../../../Redux/admin/adminApi";
import { FaBoxOpen, FaUsers, FaUserShield } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineCategory } from "react-icons/md";
import ContactMsgList from "../ContactMsg/ContactMsgList";
import { useGetAllContactMsgsQuery } from "../../../Redux/contactMsg/contactMsgApi";

export default function Dashboard() {
  const { data: products } = useGetAllProductsQuery();
  const { data: users } = useAllUsersQuery();
  const { data: admin } = useGetAllAdminsQuery();
  const { data: category } = useGetCategoriesQuery();
  const { data: contactMsg } = useGetAllContactMsgsQuery();

  return (
    <section>
      {/* card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="flex justify-between items-center rounded-lg shadow p-4 bg-base-100">
          <div>
            <p className="text-neutral font-dinMedium">Total Products</p>
            <h3 className="text-primary font-bold">{products?.data?.length}</h3>
          </div>
          <div className="bg-primary text-base-100 w-11 h-11 rounded-lg flex justify-center items-center">
            <FaBoxOpen className="text-xl" />
          </div>
        </div>

        <div className="flex justify-between items-center rounded-lg shadow p-4 bg-base-100">
          <div>
            <p className="text-neutral font-dinMedium">Total Users</p>
            <h3 className="text-green-600 font-bold">{users?.data?.length}</h3>
          </div>

          <div className="bg-green-600 text-base-100 w-11 h-11 rounded-lg flex justify-center items-center">
            <FaUsers className="text-xl" />
          </div>
        </div>

        <div className="flex justify-between items-center rounded-lg shadow p-4 bg-base-100">
          <div>
            <p className="text-neutral font-dinMedium">Total Administrators</p>
            <h3 className="text-green-600 font-bold">{admin?.data?.length}</h3>
          </div>

          <div className="bg-primary text-base-100 w-11 h-11 rounded-lg flex justify-center items-center">
            <FaUserShield className="text-xl" />
          </div>
        </div>

        <div className="flex justify-between items-center rounded-lg shadow p-4 bg-base-100">
          <div>
            <p className="text-neutral font-dinMedium">Client Message</p>
            <h3 className="text-green-600 font-bold">
              {contactMsg?.data?.length}
            </h3>
          </div>

          <div className="bg-primary text-base-100 w-11 h-11 rounded-lg flex justify-center items-center">
            <FaRegMessage className="text-xl" />
          </div>
        </div>

        <div className="flex justify-between items-center rounded-lg shadow p-4 bg-base-100">
          <div>
            <p className="text-neutral font-dinMedium">Total Services</p>
            <h3 className="text-green-600 font-bold">
              {category?.data?.length}
            </h3>
          </div>

          <div className="bg-primary text-base-100 w-11 h-11 rounded-lg flex justify-center items-center">
            <MdOutlineCategory className="text-xl" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        {" "}
        <ContactMsgList />{" "}
      </div>
    </section>
  );
}
