import { Link , useLocation } from 'react-router-dom';

export const Navbar = () => {

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "btn-active bg-primary" : "";
    };
    
    return (
        <div className="navbar bg-gray-800 rounded-xl">
            <div className="navbar-start">
                { isActive("/") ?
                <Link to="/" className="btn btn-primary text-xl text-white">
                    UA Insights
                </Link>
                :
                <Link to="/" className="btn btn-ghost text-xl text-white">
                    UA Insights
                </Link>
                }
            </div>
            
            <div className="navbar-center">
                <div className="flex gap-4">

                    { isActive("/universidade") ?
                    <Link to="/universidade" className="btn btn-primary text-white">
                        Universidade
                    </Link>
                    :
                    <Link to="/universidade" className="btn btn-ghost text-white ">
                        Universidade
                    </Link>
                    }

                    { isActive("/departamento") ?
                    <Link to="/departamento" className="btn btn-primary text-white">
                        Departamento
                    </Link>
                    :
                    <Link to="/departamento" className="btn btn-ghost text-white">
                        Departamento
                    </Link>
                    }

                    { isActive("/curso") ?
                    <Link to="/curso" className="btn btn-primary text-white">
                        Curso
                    </Link>
                    :
                    <Link to="/curso" className="btn btn-ghost text-white">
                        Curso
                    </Link>
                    }

                    { isActive("/cadeira") ?
                    <Link to="/cadeira" className="btn btn-primary text-white">
                        Cadeira
                    </Link>
                    :
                    <Link to="/cadeira" className="btn btn-ghost text-white">
                        Cadeira
                    </Link>
                    }              
                </div>
            </div>
            
            <div className="navbar-end">
            </div>
        </div>
    );
}