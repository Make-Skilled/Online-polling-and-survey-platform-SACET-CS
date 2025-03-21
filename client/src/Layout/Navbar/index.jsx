import { useState, useContext, useRef } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import styles from '../../styles'
import { navLinks } from '../../constants'
import { menu, close, logo } from '../../assets'
import { UserContext } from '../../contexts/UserContext'
import LogoutBtn from '../../components/Button/LogoutBtn'
import useOutsideClick from '../../Hooks/useOutsideClick'

function Navbar() {
    const { userInfo } = useContext(UserContext);
    const mobileNavContainer = useRef(null);
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);
    useOutsideClick(mobileNavContainer, () => setToggle(false));
    return (
        <nav className={`${styles.paddingX} md:py-5 py-3 px-3 sticky top-0 bg-gray-900 z-[1000]`}>
            <div className="flex items-center justify-between">
                <NavLink to="/" className="flex items-center">
                    <img
                        src={logo}
                        className="overflow-hidden transition-all w-28"
                        alt=""
                    />
                </NavLink>
                {/* mapping all the navigation links for the desktop/ tablets screen */}
                <div className="items-center hidden md:flex">
                    <ul className="flex font-medium">
                        {
                            navLinks.map(
                                (links, index) => (
                                    <li key={links.id}>
                                        <NavLink to={links.linkTo} className={(({ isActive }) => {
                                            const color = isActive ? 'text-sky-600' : 'text-white';
                                            const margin = index === 0 ? 'ml-0' : 'ml-6'
                                            return color + " hover:text-sky-400 " + margin;
                                        })}>{links.name}</NavLink>
                                    </li>
                                )
                            )
                        }
                    </ul>
                </div>
                {/* div for login signup button  */}

                { //showing the user information and logout if user is logged in
                    userInfo && (<div className={`flex justify-center items-center ${styles.heading6} `}>
                        <Link to='profile'>
                            <p className='text-white'>Hi {userInfo.name} !</p>
                        </Link>
                        <LogoutBtn />
                    </div>)
                }
                {/* login/signup button */}
                <div className={`hidden ${userInfo ? null : 'md:block'} `}>
                    <button type="button" className=" bg-green-500 text-black hover:bg-blue-400  font-semibold py-2 px-5 rounded text-base" onClick={() => { navigate('/login') }}>LogIn/SignUp</button>
                </div>
                {/* div for the mobile menu*/}
                <div ref={mobileNavContainer} className="flex md:hidden items-center z-50">
                    {/* div for the mobile menu icon */}
                    <div className="text-3xl md:hidden cursor-pointer" onClick={() => setToggle((open) => !open)} aria-expanded={toggle}>
                        <img src={toggle ? close : menu} alt="menu" className="" />
                    </div>
                    {/* mobile nav items div */}
                    <div className={` ${!toggle ? "hidden" : "flex"} items-center flex absolute top-16 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar bg-slate-900 p-6`}>
                        <ul className="flex justify-end items-start flex-1 flex-col gap-2">
                            { //mapping navigation links for the mobile screen
                                navLinks.map(
                                    (links) => (
                                        <li key={links.id} onClick={() => setToggle(!toggle)} >
                                            <NavLink to={links.linkTo} className={(({ isActive }) => `${isActive ? 'text-sky-600' : 'text-white'} px-2 py-1 hover:bg-slate-800 rounded-sm hover:text-sky-400`)}>{links.name}</NavLink>
                                        </li>
                                    )
                                )
                            }
                            <li className={`${userInfo ? 'hidden' : 'mt-4'}`}>
                                <button type="button" className=" bg-green-500 text-black hover:bg-blue-400  font-semibold py-2 px-5 rounded text-base" onClick={() => { navigate('/login'); setToggle(!toggle) }}>LogIn/SignUp</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar