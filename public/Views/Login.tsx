import React from 'react'

const Login = () => {


  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <div>
            <form action="" className="space-y-4">
                <div>
                    <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                    <input 
                        type="text" 
                        id="usuario"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input 
                        type="password" 
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Login
                </button>
            </form>
        </div>
    </div>
  )
}

export default Login
