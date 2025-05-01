import React, {useContext, useState} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
 
const Login = () => {
    //useNavigate
    const navigate = useNavigate()

    //useContext
    const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContent)

    //useState for sign up or login
    const [state, setState] = useState('Sign Up')
    //useState for name
    const [name, setName] = useState('')
    //useState for email
    const [email, setEmail] = useState('')
    //useState for password
    const [password, setPassword] = useState('')

    //onSubmitHandler
    const onSubmitHandler = async (e) => {
        
        try {
            //prevent default
            e.preventDefault()

            //set with credentials
            axios.defaults.withCredentials = true

            //if state is sign up
            if(state === 'Sign Up') {
               //send data to backend
               const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password},
                { withCredentials: true }
               );

               //if success
               if(data.success) {
                //set is logged in
                setIsLoggedIn(true)
                //set user data
                getUserData()
                //navigate to home
                navigate('/')
               }else{
                //toast error
                toast.error(data.message)
               }
            }else{
                //if state is login send data to backend    
               const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password},
                { withCredentials: true }
               );

               //if success
               if(data.success) {
                //set is logged in
                setIsLoggedIn(true)
                //set user data
                getUserData()
                //navigate to home
                navigate('/')
               }else{
                //toast error
                toast.error(data.message)
               }
            }
        //catch error
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen px-6 
                    sm:px-0 bg-white">
        <div className="absolute top-5 left-5 sm:left-20 text-3xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate('/')}>
            Mental Health Journal
        </div>

        {/* Container of the form */}
        <div className="bg-black/20 backdrop-blur-md p-10 rounded-lg shadow-lg w-full sm:w-96 text-gray-800 text-sm">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-3">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
            <p className="text-center text-gray-600 text-sm mb-6">{state === 'Sign Up' ? 'Create your account!' : 'Login to your account!'}</p>

            {/* Form */}
            <form onSubmit={onSubmitHandler}>

                {state === 'Sign Up' && (
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full
                                    bg-gray-100">
                    <img src={assets.person_icon}
                         alt="person_icon"
                    />
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className='bg-transparent outline-none' 
                        type="text" 
                        id='name'
                        name='name'
                        placeholder='Full Name' 
                        required />
                </div>
                )}

                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full
                bg-gray-100">
                    <img src={assets.mail_icon}
                         alt="mail_icon"
                    />
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='bg-transparent outline-none' 
                        type="email" 
                        id='email'
                        name='email'
                        placeholder='Email' 
                        required />
                </div>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full
                bg-gray-100">
                    <img src={assets.lock_icon}
                         alt="lock_icon"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='bg-transparent outline-none' 
                        type="password" 
                        id='password'
                        name='password'
                        placeholder='Password' 
                        required 
                    />
                </div>

                <p 
                    className="mb-4 cursor-pointer hover:text-blue-400"
                    onClick={() => navigate('/reset-password')}
                >
                    Forgot password?
                </p>

                <button className='cursor-pointer w-full py-2.5 rounded-full bg-gray-800 text-white font-medium'>
                    {state}
                </button>
            </form>

            {state === 'Sign Up' ? (            
            <p className="mt-4 text-gray-400 text-center text-xs">Already have an account?{'  '} 
                <span onClick={() => setState('Login')} className="cursor-pointer text-blue-400 underline">Login here</span>
            </p>
            ) 
            : (    
            <p className="mt-4 text-gray-400 text-center text-xs">Don't have an account?{'  '} 
                <span onClick={() => setState('Sign Up')} className="cursor-pointer text-blue-400 underline">Sign up</span>
            </p>)}

        </div>
    </div>
  )
}

export default Login