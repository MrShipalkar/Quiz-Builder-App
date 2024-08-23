import React from 'react'
import SignUp from '../../components/signUp/signUp.jsx'
import Login from '../../components/login/login.jsx'
import './auth.css'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function auth() {
    const [change, setChange] = useState(false)
    // const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('')) {
            // navigate('/Dashboard')
        }
    }, [])
  return (
    <div>
      <div className="login_container">
            <div className="login_box">
                <h1 className='heading'>QUIZZIE</h1>
                <div className='btn_set'>
                    <div className={`btn ${change ? null : "active"}`} onClick={() => setChange(false)} >Sign Up</div>
                    <div className={`btn ${change ? "active" : null}`} onClick={() => setChange(true)} >Log In</div>
                </div>
                {
                    change ? (
                        <Login />
                    ) :
                        (
                            <SignUp setChange={setChange} />
                        )
                }
            </div>
        </div>
    </div>
  )
}

export default auth
