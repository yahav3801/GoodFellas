import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Spinner = () => (
  <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
);

const SignupComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phoneNumber, address }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Signup successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.error || 'An error occurred during signup');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {['name', 'email', 'password', 'phoneNumber', 'address'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="mt-1">
                  <input
                    id={field}
                    name={field}
                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                    required
                    value={eval(field)}
                    onChange={(e) => eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`)(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}

            <div>
              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? <Spinner /> : 'Sign Up'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`mt-6 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              <p className="text-center text-sm">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;