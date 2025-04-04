// src/auth/Login.js
import * as React from 'react';
import { redirectToOAuthLogin } from '../oauth';

function Login({ setAuthState }) {
  // You might want to keep these for UI consistency
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    redirectToOAuthLogin();
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className=' w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100'>
          <h3 className='text-5xl font-semibold'>Welcome Back</h3>
          <div className='mt-8'>
            <div className='mt-8 flex flex-col gap-y-4'>
              <button 
                onClick={handleLogin}
                className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg'>
                  Sign in with NUM
              </button>
            </div>
            <div className='mt-8 flex justify-center items-center'>
              <p className='font-medium text-base'>Don't have an account?</p>
              <button 
                onClick={() => setAuthState('register')}
                className='ml-2 font-medium text-base text-violet-500'>
                  Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden relative w-1/2 h-full lg:flex items-center justify-center bg-gray-200">
        <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 animate-spin"/> 
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
      </div>
    </div>
  );
}

export default Login;