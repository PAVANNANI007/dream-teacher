'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import logo from '../images/logo.jpg'

export default function LoginForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const url = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;

     const body = isLogin
      ? { email, password }
      : { email, password, confirmPassword };
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.message || 'Something went wrong');
        return;
      }
  
      if (isLogin) {
        if (data.jwtToken) {
          Cookies.set('jwt_token', data.jwtToken, { expires: 30, path: '/' });
          router.push('/');
        } else {
          alert('Login failed: No token received');
        }
      } else {
        alert('Signup successful. Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Failed to connect to server');
    }
  };
  

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col justify-center items-center w-1/2 bg-gray-100 rounded-l-2xl">
        <h1 className="text-4xl font-bold text-blue-800 tracking-widest">Teach.Learn.Earn</h1>
        <h2 className="text-xl text-gray-800 mt-4 tracking-wide">Make success a habit</h2>
      </div>
      <div className="flex items-center justify-center w-1/2 p-8 bg-white rounded-r-2xl shadow-xl">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image src={logo} alt="Logo" className="w-40" />
          </div>
          <div className="relative mb-6">
            <div className="flex border border-gray-300 rounded-full overflow-hidden relative z-0">
              <button
                className={`w-1/2 py-2 transition-all duration-300 font-medium text-center ${
                  isLogin && !isForgotPassword ? 'bg-gradient-to-r from-blue-800 to-blue-400 text-white' : 'text-black'
                }`}
                onClick={() => {
                  setIsLogin(true);
                  setIsForgotPassword(false);
                }}
              >
                Login
              </button>
              <button
                className={`w-1/2 py-2 transition-all duration-300 font-medium text-center ${
                  !isLogin && !isForgotPassword ? 'bg-gradient-to-r from-blue-800 to-blue-400 text-white' : 'text-black'
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setIsForgotPassword(false);
                }}
              >
                Signup
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isForgotPassword ? (
              <>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-12 px-4 rounded-full border border-gray-300 text-black placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-400 text-white py-2 rounded-full font-semibold hover:opacity-90"
                >
                  Send Reset Link
                </button>
              </>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-12 px-4 rounded-full border border-gray-300 text-black placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-12 px-4 rounded-full border border-gray-300 text-black placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {!isLogin && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full h-12 px-4 rounded-full border border-gray-300 text-black placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                )}
                <div className="text-sm text-right">
                  <a
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-400 text-white py-2 rounded-full font-semibold hover:opacity-90"
                >
                  {isLogin ? 'Login' : 'Signup'}
                </button>
                <div className="text-center mt-2">
                  Not a member?{' '}
                  <a className="text-blue-600 hover:underline cursor-pointer" onClick={() => setIsLogin(false)}>
                    Signup now
                  </a>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
