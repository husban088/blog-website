import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../App';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };

  return (
    <>

        <form onSubmit={handleSignin} className='login__cont' style={{marginTop:"8rem"}}> 

          <div className='login__sections'>
            <h2 className="login__head">Login</h2>
          </div>

          <div className='login__details'>

            <div className='inputbox'>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <span>Email</span>
              <i></i>
            </div>

            <div className='inputbox'>
              <input type="password" className='form__control' value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span>Password</span>
              <i></i>
            </div>

            <div className='login__button' style={{ textAlign: 'center' }}>
              <button className="custom-btn btn-3" type="submit"><span>Login</span></button>
            </div>

          </div>

          <div className='login__last'>
          New user <Link to={'/register'} style={{ color: 'white',  textDecoration: 'underline'}}>Register Here</Link>
        </div>

        </form>


    </>
  );
};

export default Signin;