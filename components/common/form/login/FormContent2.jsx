// import Link from "next/link";
// import LoginWithSocial from "./LoginWithSocial";

// const FormContent2 = () => {
//   return (
//     <div className="form-inner">
//       <h3>Login to Superio</h3>

//       {/* <!--Login Form--> */}
//       <form method="post">
//         <div className="form-group">
//           <label>name</label>
//           <input type="text" name="username" placeholder="Username" required />
//         </div>
//         {/* name */}

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//         </div>
//         {/* password */}

//         <div className="form-group">
//           <div className="field-outer">
//             <div className="input-group checkboxes square">
//               <input type="checkbox" name="remember-me" id="remember" />
//               <label htmlFor="remember" className="remember">
//                 <span className="custom-checkbox"></span> Remember me
//               </label>
//             </div>
//             <a href="#" className="pwd">
//               Forgot password?
//             </a>
//           </div>
//         </div>
//         {/* forgot password */}

//         <div className="form-group">
//           <button
//             className="theme-btn btn-style-one"
//             type="submit"
//             name="log-in"
//           >
//             Log In
//           </button>
//         </div>
//         {/* login */}
//       </form>
//       {/* End form */}

//       <div className="bottom-box">
//         <div className="text">
//           Don&apos;t have an account? <Link href="/register">Signup</Link>
//         </div>

//         <div className="divider">
//           <span>or</span>
//         </div>

//         <LoginWithSocial />
//       </div>
//       {/* End bottom-box LoginWithSocial */}
//     </div>
//   );
// };

// export default FormContent2;


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import LoginWithSocial from './LoginWithSocial';

// const FormContent2 = ({ role }) => {
//   const [name, setname] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/v1/auth/sign-up', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           role: role || 'candidate', // Default to candidate if role not provided
//         }),
//       });

//       const data = await response.json();

//       // console.log('Registration response:', data);
      

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Redirect based on role
//       if (data.role === 'employer') {
//         router.push('/employers-dashboard/dashboard');
//       } else {
//         router.push('/candidates-dashboard/dashboard');
//       }

//       console.log('API response:', response.status, response.statusText);
//     // const data = await response.json();
//     // console.log('API response data:', data);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-inner">
//       <h3>{role === 'employer' ? 'Employer Registration' : 'Candidate Registration'}</h3>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Username</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Username"
//             value={name}
//             onChange={(e) => setname(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         {error && <div className="form-group error">{error}</div>}

//         <div className="form-group">
//           <button
//             className="theme-btn btn-style-one"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </div>
//       </form>

//       <div className="bottom-box">
//         <div className="text">
//           Already have an account? <Link href="/login">LogIn</Link>
//         </div>
//         <div className="divider">
//           <span>or</span>
//         </div>
//         <LoginWithSocial />
//       </div>
//     </div>
//   );
// };

// export default FormContent2;
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginWithSocial from './LoginWithSocial';

const FormContent2 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/auth/sign-in`, {
      const response = await fetch(`api/v1/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user details in localStorage
      localStorage.setItem('token', data.user.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      }));

      // Redirect based on role
      if (data.user.role === 'superadmin' || data.user.role === 'employer' || data.user.role === 'admin') {
        router.push('/employers-dashboard/dashboard');
      } else {
        router.push('/candidates-dashboard/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to Cispro</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="form-group error">{error}</div>}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div>
    </div>
  );
};

export default FormContent2;