import React from "react";

type props = {
  children: React.ReactNode;
};

const Layout = (props: props) => {
  const { children } = props;
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
