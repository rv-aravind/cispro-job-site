// theme code
// const FormContent2 = () => {
//   return (
//     <form method="post" action="add-parcel.html">
//       <div className="form-group">
//         <label>Email Address</label>
//         <input type="email" name="email" placeholder="email" required />
//       </div>
//       {/* name */}

//       <div className="form-group">
//         <label>Password</label>
//         <input
//           id="password-field"
//           type="password"
//           name="password"
//           placeholder="Password"
//         />
//       </div>
//       {/* password */}

//       <div className="form-group">
//         <button className="theme-btn btn-style-one" type="submit">
//           Login
//         </button>
//       </div>
//       {/* login */}
//     </form>
//   );
// };

// export default FormContent2;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginWithSocial from './LoginWithSocial';

const FormContent2 = ({ role }) => {
  const [name, setName] = useState('');
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
      const response = await fetch('/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role || 'candidate',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
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
      if (data.user.role === 'employer' || data.user.role === 'admin') {
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
      <h3>{role === 'employer' ? 'Employer Registration' : 'Candidate Registration'}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      {/* <div className="bottom-box">
        <div className="text">
          Already have an account? <Link href="/login">Login</Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div> */}
    </div>
  );
};

export default FormContent2;