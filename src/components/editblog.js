import React, { useState, useEffect } from 'react';
import { auth, db, storage } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Dropdown, Button, Modal } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import '../App';

const EditBlog = () => {
  const { id } = useParams();
const [blog, setBlog] = useState({ title: '', category: '', details: '', imageUrl: '' });

  const [newImage, setNewImage] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  const [imageUrl, setImageUrl] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const blogDoc = await getDoc(doc(db, 'blogs', id));
      const blogData = blogDoc.data();

      setBlog(blogData);
      if (blogData.imageUrl) {
        setPreviewImage(blogData.imageUrl);
      }
    };
    fetchBlog();
  }, [id]);


//   const handleEditBlog = async (e) => {
//     e.preventDefault();

//     if (newImage) {
//         const imageRef = ref(storage, `blogImages/${blog.userId}_${Date.now()}`);
//         await uploadBytes(imageRef, newImage);
//         const newImageUrl = await getDownloadURL(imageRef);
//         blog.imageUrl = newImageUrl;
//         setNewImage(newImageUrl);
//       }

//     await updateDoc(doc(db, 'blogs', id), blog);
//     navigate(`/blog/${id}`);
//   };

const [imageName, setImageName] = useState('');
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleEditBlog = async (e) => {
    e.preventDefault();

    if (newImage) {
      const imageRef = ref(storage, `blogImages/${id}_${Date.now()}`);
      await uploadBytes(imageRef, newImage);
      const newImageUrl = await getDownloadURL(imageRef);
      blog.imageUrl = newImageUrl;
    }

    await updateDoc(doc(db, 'blogs', id), blog);
    navigate(`/blog/${id}`);
  };


//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageRef = ref(storage, `products/${file.name}`);
//       await uploadBytes(imageRef, file);
//       const downloadURL = await getDownloadURL(imageRef);
//       setExistingImageURL(downloadURL);
//       setNewImage(file);
//     }
//   };


const [user, setUser] = useState(null);

useEffect(() => {
  
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setUser(user);

  });
  return () => unsubscribe();

}, []);



const [show, setShow] = useState(false);

const [shows, setShows] = useState(false);




const [isAdmin, setIsAdmin] = useState(false);

const [loading, setLoading] = useState(true); // State for managing loading


useEffect(() => {
  if (user) {
    const adminEmail = "husbanahmad9371@gmail.com";
    const adminName = "husban ahmad";

    setIsAdmin(user.email === adminEmail);
  } else {
    setIsAdmin(false);
  }

}, [user]);

const handleLogout = async () => {
  await signOut(auth);
  setUser(null);
  // setProfile(null);
  navigate("/login");
};

const handleClose = () => setShow(false);





  return (
   <>

<Navbar className='navbar' expand={true}>
        <Container fluid>
          <Navbar.Brand><Link to={'/'} className='nav__brand'>Blogs</Link></Navbar.Brand>
          <Navbar.Toggle className='nav__menu' onClick={() => setShow(!show)} />
          <Navbar.Collapse className="justify-content-center">
            <Nav className="nav__nav">
              <Nav.Link className='nav-links'><Link to={'/'} className='nav__link'>Home</Link></Nav.Link>
              <Nav.Link className='nav-links'><Link to={'/add-blog'} className='nav__link'>Create</Link></Nav.Link>
              <Nav.Link className='nav-links'><Link to={'/feedback'} className='nav__link'>Feedback</Link></Nav.Link>
              <Nav.Link className='nav-links'><Link to={'/profile'} className='nav__link'>Profile</Link></Nav.Link>

            {
              isAdmin &&
              <Nav.Link className='nav-links' id='panel__link'><Link to={'/panel'} className='nav__link' style={{color:"#000"}}>Panel</Link></Nav.Link>
            }


              <Nav.Link className='nav-links'>
                {
                  !user ?
                    <Nav.Link onClick={() => setShows(!shows)}>
          <Link className='nav__link nav-link logout-button' style={{ textDecoration: "none", color: "#000" }} onClick={handleLogout}>Login</Link>
                    </Nav.Link>
                    :
                    <Nav.Link><Link to={'/'} className='nav__link nav-link logout-button' style={{ textDecoration: "none", color: "#000" }} onClick={handleLogout}>Logout</Link></Nav.Link>
                }

              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="start" className="nav__sidebars">
        <Offcanvas.Header closeButton className='navsidebar__close'>
          <Offcanvas.Title className='navsidebar__name'><Link to={'/'} style={{textDecoration:"none", color:"#000"}}>Blogs</Link></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="navside__links">
            <Link className='navside__link' to={'/'}>Home</Link>
            <Link className='navside__link' to={'/add-blog'}>Create</Link>
            <Link className='navside__link' to={'/feedback'}>Feedback</Link>
            <Link className='navside__link' to={'/profile'}>Profile</Link>

           {
            isAdmin &&
            <Link className='navside__link' to={'/panel'}>Panel</Link>
           }



            <Link className='navside__link'>
              {
                !user ?
                  <Link style={{ textDecoration: 'none', color: "#000" }} to={'/'} onClick={() => setShows(!shows)}>Login</Link>
                  :
                  <Link style={{ textDecoration: 'none', color: "red" }} to={'/'} onClick={handleLogout}>Logout</Link>
              }

            </Link>


          </Nav>
        </Offcanvas.Body>
      </Offcanvas>






      <form onSubmit={handleEditBlog} className='login__cont addblogs__cont'>


      <h1 className="login__head" style={{ textAlign: "center" }}>Edit and update blog</h1>
       
   
       <div className='inputbox'>
       <input type="text" value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} required />

       </div>



      <div className='inputbox'>
      <input type="text" value={blog.category} onChange={(e) => setBlog({ ...blog, category: e.target.value })} required />

      </div>



   <div className='inputboxes'>
   <textarea rows={10} cols={10} className='addblog__txt' value={blog.details} placeholder='Blog details'  onChange={(e) => setBlog({ ...blog, details: e.target.value })} required/>
   </div>
      
     
     <div className='inputbox'>
     <input type="file" onChange={handleImageChange} required/>
     </div>


        <div style={{textAlign:"center"}}>
        {previewImage && <img src={previewImage} alt="Uploaded" style={{width:"60%", marginRight:"auto", marginLeft:"auto"}}/>}
        </div>

      <div className='login__button' style={{marginTop:"1.5rem", textAlign:"center"}}>
       <button type="submit" className="custom-btn btn-5">Update Blog</button>
       </div>
      

    </form>




   </>
  );
};

export default EditBlog;

