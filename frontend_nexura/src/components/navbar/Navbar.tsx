import Link from "next/link";
import { FC } from "react";

const NavBar: FC = () => {
  return (
    <Link href={"/"}>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Nexura - Prueba técnica
          </a>
        </div>
      </nav>
    </Link>
  );
};

export default NavBar;
