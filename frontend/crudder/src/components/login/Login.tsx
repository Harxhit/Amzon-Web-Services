import React, { useState } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import {toast} from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  
  const [formData , setFormData] = useState({
    username : "", 
    password: "", 

  })

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name , value} = e.target
    setFormData(prev => ({...prev,[name]:value}))
  }

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post('/users/sign-in/' , formData , {withCredentials : true})
      console.log('User logged in successfully' , response.data)
    } catch (errors :any) {
      console.log(errors)
      const errorMessage = errors.reponse?.data?.message
      if(errorMessage){
        toast.error(errorMessage)
      }
    }
  }

  const goToSignUp = (e:React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigate('/sign-up')

  }
  return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit} >
          <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
       
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Do not have a account?{" "}
          <a 
          href="/sign-up" 
          className="text-blue-600 hover:underline"
          onClick={goToSignUp}
          >
            Sign-Up
          </a>
        </p>
      </section>
    </main>
  )
}

export default Login