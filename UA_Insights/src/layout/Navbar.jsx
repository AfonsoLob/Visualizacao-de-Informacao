import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'btn-active bg-primary' : '';
  };

  return (
    <div className="navbar bg-gray-800 rounded-xl flex justify-between">
      {/* Navbar Start */}
      <div className="navbar-start">
        <Link to="/" className={`btn text-xl text-white ${isActive("/") ? "btn-primary" : "btn-ghost"}`}>
          UA Insights
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <div className="flex gap-4">
          <Link to="/universidade" className={`btn text-white ${isActive("/universidade") ? "btn-primary" : "btn-ghost"}`}>
            Universidade
          </Link>
          <Link to="/departamento" className={`btn text-white ${isActive("/departamento") ? "btn-primary" : "btn-ghost"}`}>
            Departamento
          </Link>
          <Link to="/curso" className={`btn text-white ${isActive("/curso") ? "btn-primary" : "btn-ghost"}`}>
            Curso
          </Link>
          <Link to="/cadeira" className={`btn text-white ${isActive("/cadeira") ? "btn-primary" : "btn-ghost"}`}>
            Cadeira
          </Link>
        </div>
      </div>

     
      {/* Dropdown Menu for Smaller Screens */}
      <div className="dropdown dropdown-end lg:hidden">
        <label tabIndex={0} className="btn btn-ghost text-white lg:hidden">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
            />
            </svg>
        </label>
        <ul
            tabIndex={0}
            className="z-10 dropdown-content menu p-2 shadow bg-gray-800 rounded-box w-48 mt-2"
        >
            <li>
            <Link
                to="/universidade"
                className={`text-white ${isActive("/universidade") ? "btn-primary" : "btn-ghost"}`}
            >
                Universidade
            </Link>
            </li>
            <li>
            <Link
                to="/departamento"
                className={`text-white ${isActive("/departamento") ? "btn-primary" : "btn-ghost"}`}
            >
                Departamento
            </Link>
            </li>
            <li>
            <Link
                to="/curso"
                className={`text-white ${isActive("/curso") ? "btn-primary" : "btn-ghost"}`}
            >
                Curso
            </Link>
            </li>
            <li>
            <Link
                to="/cadeira"
                className={`text-white ${isActive("/cadeira") ? "btn-primary" : "btn-ghost"}`}
            >
                Cadeira
            </Link>
            </li>
        </ul>
        </div>

      <div className='navbar-end sm:hidden lg:block'>

      </div>
    </div>
  );
};
