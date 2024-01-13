import {Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navigation() {
    const loggedIn = useSelector((state) => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    return (
        <nav className="flex items-center justify-between w-f h-16 py-2 
        text-white border-b px-28 mb-36 border-cyan-400">
           <Link to="/" className="text-2xl font-medium text-white">
            <span className="text-cyan-400 ">M</span>usic
            <span className="text-cyan-400 ">T</span>alk
           </Link> 
           { loggedIn ? 
           <ul className="flex items-center h-16 text-xl">
              <li><Link to='/profile'>Profile</Link></li>
              <li><Link className="pl-20" to='/find-friends'>Friends</Link></li>
              <li className="pl-20"><Link to='/' 
              onClick={() => dispatch(logout())}>Logout</Link></li>
           </ul> : 
           <ul className="flex items-center h-16 text-xl">
              <li><Link to='/signup'>Sign Up</Link></li>
              <li className="pl-20"><Link to='/signin'>Sign In</Link></li>
           </ul>
           }
        </nav>

    )
}

