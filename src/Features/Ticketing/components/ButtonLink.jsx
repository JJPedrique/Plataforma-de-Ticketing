import { Link } from 'react-router-dom';

function ButtonLink({Path,Text}) {
    return ( <Link className="text-2xl bg-amber-500 font-semibold px-3 py-1 m-3 text-white" to={Path}>{Text}</Link> );
}

export default ButtonLink;