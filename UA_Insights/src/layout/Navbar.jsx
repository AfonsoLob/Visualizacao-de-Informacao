import { Link , useLocation } from 'react-router-dom';

export const Navbar = () => {

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "btn-active bg-primary" : "";
    };
    
    return (
        <div className="navbar bg-gray-800 rounded-xl mb-2">
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl text-white">
                    UA Insights
                </Link>
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

                    { isActive("/students") ?
                    <Link to="/students" className="btn btn-primary text-white">
                        Departamento
                    </Link>
                    :
                    <Link to="/students" className="btn btn-ghost text-white">
                        Departamento
                    </Link>
                    }

                    { isActive("/courses") ?
                    <Link to="/courses" className="btn btn-primary text-white">
                        Curso
                    </Link>
                    :
                    <Link to="/courses" className="btn btn-ghost text-white">
                        Curso
                    </Link>
                    }

                    { isActive("/departments") ?
                    <Link to="/departments" className="btn btn-primary text-white">
                        Cadeira
                    </Link>
                    :
                    <Link to="/departments" className="btn btn-ghost text-white">
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