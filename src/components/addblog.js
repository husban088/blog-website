import React, { useEffect, useState } from 'react';
import { db, auth, storage } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Dropdown, Button, Modal } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const [user, setUser] = useState(null);

  const [shows, setShows] = useState(false);

  useEffect(() => {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";
      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }
  }, [user])

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    // setProfile(null);
    navigate("/login");
  };

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });
    return () => unsubscribe();

  }, []);


  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;


      // Upload the image to Firebase Storage
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `blogImages/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }


      await addDoc(collection(db, 'blogs'), {
        title,
        category,
        details,
        imageUrl,
        userId: user.uid,
        userName: user.displayName,
        createdAt: serverTimestamp(),
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const [imageUrl, setImageUrl] = useState("");
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      setImageUrl(downloadURL);
      setImage(file);
    }
  };

  const [value, setValue] = useState('');

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
                <Nav.Link className='nav-links' id='panel__link'><Link to={'/panel'} className='nav__link' style={{ color: "#000" }}>Panel</Link></Nav.Link>
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






      <form onSubmit={handleAddBlog} className='login__cont addblogs__cont' style={{marginTop:"14rem"}}>

        <h2 className="login__head" style={{ textAlign: "center" }}>Add Blog</h2>


        <div>

          <div className='inputbox'>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <span>Title</span>
            <i></i>
          </div>

          <div className='inputbox'>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <span>Category</span>
            <i></i>
          </div>

          <div className='inputboxes'>

            {/* <textarea  cols={60} rows={10} className='text__inpt' placeholder='Details'  required>
              </textarea> */}
              <textarea rows={10} cols={10} className='addblog__txt' placeholder='Blog details' type="text" value={details} onChange={(e) => setDetails(e.target.value)} required />
          </div>




          {/* <ReactQuill theme="snow" value={value} onChange={()=> setValue(value)}  className='quill__input' style={{ height: '300px' }}/> */}

          <div className='inputbox' style={{ paddingBottom:"1.5rem"}}> 
          <input type="file" onChange={handleImageUpload} style={{marginBottom:"-6rem"}}/>
          </div>

          <div style={{ textAlign: "center" }}>
            {imageUrl && <img src={imageUrl} alt="Uploaded" width="300" style={{marginBottom:"1.5rem"}} />}
          </div>


          <div className='login__button' style={{textAlign:"center"}}>
            <button className="custom-btn btn-5" type="submit">Add Blog</button>
          </div>

        </div>

      </form>
    </>
  );
};

export default AddBlog;