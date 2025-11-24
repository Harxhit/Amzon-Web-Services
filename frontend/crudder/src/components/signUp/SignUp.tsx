import React, { useState } from "react";
import api from "../../api/axios";
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate()
  
  const {login} = useAuth()

  interface Errors {
    username?:string;
    firstname?:string;
    lastname?:string;
    email?:string;
    password?:string;
  }

  const [formData , setFormData] = useState({
    username: "", 
    firstName : "",
    lastName : "", 
    email : "", 
    password: "", 
  })

  const [errors , setErrors] = useState<Errors>({})

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name , value} = e.target; 
    setFormData(prev => ({...prev, [name]:value}))


    setErrors(prev => ({...prev,[name]:""}))
  }

  const handleSubmit = async(e:React.FormEvent) => {

    e.preventDefault();
    try {
      const response = await api.post(
        "/users/sign-up" 
        , formData 
        , {
          withCredentials: true
        }
      )
      setErrors({})

      const user = response.data?.data?.user;

      login(user)

      toast('User signed up successfully')

      navigate('/home')

    } catch (err: any) {
        const validationError: Errors = {};
        const errs = err.response?.data?.data?.error?.errors || [];

        errs.forEach((errorMessage: string) => {
          const fieldRaw = errorMessage.split(" ")[0]
          const field:string = fieldRaw.toLowerCase()
          validationError[field as keyof Errors] = errorMessage 
        });

        const generalError = err.response?.data?.message
        if(generalError){
          toast.error(generalError)
        }

        setErrors(validationError);
      }
  }

  const goToLogin = (e:React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigate('/login')
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
         {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
          )}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Already have an account?{" "}
          <a  
            href= "/login"
            className="text-blue-600 hover:underline"
            onClick={goToLogin}>
            Log In
          </a>
        </p>
      </section>
    </main>
  );
}

export default SignUp