import React, { useState } from 'react';
import { auth, db, storage } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import '../App';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload profile image to Firebase Storage
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Update user's profile with name and image
      await updateProfile(user, {
        displayName: name,
        password: password,
        photoURL: imageUrl,
      });

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        password,
        imageUrl,
        createdAt: serverTimestamp(),
        role: 'user', // Default role
      });

      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageRef = ref(storage, `users/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      setImageUrls(downloadURL);
      setImage(file);
    }
  };

  return (
    <form onSubmit={handleSignup} className='login__cont' style={{marginBottom:"8rem"}}>
            <h2 className="login__head" style={{textAlign:"center"}}>Signup</h2>

      <div className='inputbox'>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />    
      <span>Name</span>
      <i></i>     
      </div>

      <div className='inputbox'>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <span>Email</span>
      <i></i> 
      </div>

      <div className='inputbox'>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <span>Password</span>
      <i></i> 
      </div>

      <div className='inputbox'>
      <input type="file" className='form__control' onChange={handleImageUpload} required />
      </div>

      <div style={{ textAlign: 'center', marginBottom:"2rem"}} >
      {imageUrls && <img src={imageUrls} alt="Uploaded" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight:"auto", marginLeft:"auto" }} />}
      </div>

      <div className='login__button' style={{ textAlign: 'center' }}>
      <button className="custom-btn btn-5" type="submit">Sign Up</button>
      </div>

      <p className="login__last">
        Already have account <Link to={'/login'} style={{ color: 'white',  textDecoration: 'underline'}}>Sign in</Link>
      </p>

    </form>
  );
};

export default Signup;