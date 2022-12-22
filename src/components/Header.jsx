import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AUTH_TOKEN } from '../constants'

const Header = () => {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const navigate = useNavigate()

    return (
        <div className='flex pa1 justify-between nowrap orange'>
            <div className='flex flex-fixed black'>
                <Link to="/" className='no-underline black' >
                    <div className='fw7 mr1'>
                        Hacker news
                    </div>
                </Link>

                <Link to="/" className='ml1 no-underline black' >
                    news
                </Link>

                <div className='ml1'>|</div>
                {authToken && (
                    <Link to={"/create"} className="ml1 no-underline black" >submit</Link>
                )}

                {authToken ?
                    (<div
                        className="ml1 pointer black"
                        onClick={() => {
                            localStorage.removeItem(AUTH_TOKEN);
                            navigate(`/`);
                        }}
                    >
                        logout
                    </div>) :
                    <Link
                        to="/login"
                        className="ml1 no-underline black"
                    >
                        login
                    </Link>
                }

            </div>
        </div>
    )
}

export default Header