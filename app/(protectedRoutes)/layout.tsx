import { onAuthenticateUser } from "@/actions/auth";
import Header from "@/components/ReusableComponents/LayoutComponents/Header";
import Sidebar from "@/components/ReusableComponents/LayoutComponents/Sidebar";

import { redirect } from "next/navigation";

import React from "react";

type props = {
  children: React.ReactNode;
};

const Layout = async (props: props) => {
  const { children } = props;
  const userExists = await onAuthenticateUser();
  if (!userExists.user) {
    redirect("/sign-in");
  }
  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto">
        {/* Header */}
        <Header user={userExists.user} />
        <div className="flex-1 py-10">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
