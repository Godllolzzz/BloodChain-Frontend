import React from "react";
import ResponsiveLayout from "../layout/ResponsiveLayout";
import "react-toastify/dist/ReactToastify.css";

const LoginLoading = () => {
  return (
    <ResponsiveLayout>
      <div className="flex justify-center items-center h-[100vh]">
        <div className="flex w-[45rem] h-[25rem]">
          <div className="w-[55%] bg-[#ffc3c360] rounded-l-md flex flex-col gap-4 justify-center items-center shadow-md shadow-red-100">
            <div className="w-32"></div>
            <div className="text-3xl merri font-semibold text-center text-[#ac2828]"></div>
            <div className="w-[70%] flex justify-around text-[#cc191996] text-xs"></div>{" "}
            */
          </div>
          <div className="flex flex-col gap-4 justify-center items-center"></div>

          <div className="flex flex-col gap-2"></div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default LoginLoading;
