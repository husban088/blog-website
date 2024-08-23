
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './components/home';
import Signup from './components/register';
import { useEffect, useState } from 'react';
import { auth } from './components/firebase';
import Feedback from './components/feedback';
// import Profile from './components/profile';
import Panel from './components/panel';
import { SkeletonTheme } from 'react-loading-skeleton';
import AddProduct from './components/addblog';
import ProductDetail from './components/blogdetails';
import EditProduct from './components/editblog';
import Signin from './components/login';
import Profile from './components/profile';
import UserBlogsPage from './components/userblog';
// import UserBlogDetail from './components/userblogdetails';



function App() {

  const [user, setUser] = useState();


  useEffect(()=> {
    auth.onAuthStateChanged((user)=> {
      setUser(user)
    })
  },[])

  // const adminEmail = "husbansheikh088@gmail.com";
  // const currentUserEmail = "husbansheikh088@gmail.com"; // This should be dynamically set based on the logged-in user
  

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=> {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";
      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }
  },[user])

  return (
    <>
    <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Signin/> }/>
        {/* <Route path='/addblog' element={user ? <AddBlog/> : <Login/> }/> */}
        <Route path='/add-blog' element={user ? <AddProduct/> : <Signin/> }/>
        <Route path='/blog/:id' element={user ? <ProductDetail/> : <Signin/> }/>
        {/* <Route path='/blog/:id' element={user ? <UserBlogDetail/> : <Signin/> }/> */}
        <Route path="/edit-blog/:id" element={user ? <EditProduct/> : <Signin/> }/>
        <Route path="/user-blogs/:userId"  element={user ? <UserBlogsPage/> : <Signin/> }/>
        <Route path='/login' element={<Signin setUser={setUser} />}/>
        <Route path='/register' element={<Signup />}/>
        <Route path='/feedback' element={user ? <Feedback /> : <Signin/> }/>
        <Route path='/profile' element={user ? <Profile /> : <Signin/> }/>
        {/* <Route path='/panel' element={user ?  <Panel role='admin'/> : <Login/> }/> */}
        {/* <Route path="/panel" element={user ? <Panel /> : <Login/> }/> */}
        {isAdmin && <Route path="/panel" element={<Panel/>} />}
      </Routes>
      </SkeletonTheme>
    </>
  );
}

export default App;
