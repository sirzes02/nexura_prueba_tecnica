import { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { FC, ReactNode, useEffect } from "react";
import NavBar from "./navbar/Navbar";

interface Props {
  alternativeHeader?: boolean;
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => NProgress.start();

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", () => NProgress.done());

    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
