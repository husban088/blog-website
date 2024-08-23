import React, { useContext, useEffect, useRef, useState } from 'react';
import '../App.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { database, firestore, imgDB, txtDB } from './firebase';
import { v4 } from "uuid";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { Navbar, Container, Nav, NavDropdown, Offcanvas, Dropdown, Button, Modal, Row, Col, Card, CardGroup } from 'react-bootstrap';
import { auth, db } from './firebase'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import bgimage from '../components/assets/lapblog.avif'



function Home() {

  const [show, setShow] = useState(false);
  // const [product, setProduct] = useState([]);

  const [shows, setShows] = useState(false);

  const [user, setUser] = useState(null);

  const { blogId } = useParams()

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const productsCollection = collection(db, "products");
  //     const productsSnapshot = await getDocs(productsCollection);
  //     const productsList = productsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setProduct(productsList);
  //   };

  //   fetchProducts();
  // }, []);


  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);



  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });

    return () => unsubscribe();

  }, []);



  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";
      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }
  }, [user])



  const navigate = useNavigate();







  const [profile, setProfile] = useState(null);





  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    navigate("/login");
  };

  const handleClose = () => setShow(false);





  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });
    return () => unsubscribe();

  }, []);




  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //         if (currentUser) {
  //             setUser(currentUser);
  //             try {
  //                 const docRef = doc(db, "users", currentUser.uid);
  //                 const docSnap = await getDoc(docRef);
  //                 if (docSnap.exists()) {
  //                     setProfile(docSnap.data());
  //                 } else {
  //                     console.log("No such document!");
  //                     setProfile({});
  //                 }
  //             } catch (error) {
  //                 console.error("Error fetching profile data: ", error);
  //                 setProfile({});
  //             }
  //         } else {
  //             setUser(null);
  //             navigate("/signin");
  //         }
  //     });

  //     return () => unsubscribe();
  // }, [navigate]);

  // const [blogs, setBlogs] = useState([]);

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     const blogsSnapshot = await getDocs(collection(firestore, "blogs"));
  //     setBlogs(blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //   };

  //   fetchBlogs();
  // }, []);


  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const querySnapshot = await getDocs(collection(db, "products"));
  //     setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //   };

  //   fetchProducts();
  // }, []);



  // if (!profile) return <div>Loading...</div>;


  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = await getDocs(collection(db, 'blogs'));
      setBlogs(blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBlogs();
  }, []);



  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };




  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        navigate("/signin");
      }
    };

    fetchUserData();
  }, [navigate]);



  return (
    <>


      {/* ============== NAVBAR =============== */}

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
          <Offcanvas.Title className='navsidebar__name'><Link to={'/'} style={{ textDecoration: "none", color: "#000" }}>Blogs</Link></Offcanvas.Title>
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


      {/* <Modal
        show={shows}
        onHide={handleCloses}
        onClick={(e) => {
          if (e.target.classList.contains('modal')) {
            handleCloses();
          }
        }} className='modal__login'>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='fb__button'>
            <p className='fb__btn' onClick={signInWithGooogle}><img src={googleicon} alt='fbicon' className='fb__icon' />Login with Google</p>
            <ToastContainer />
          </div>
          <div className='fb__button'>
            <p className='fb__btn' onClick={signInWithFacebook}><img src={fbicon} alt='fbicon' className='fb__icon' />Login with Facebook</p>
            <ToastContainer />
          </div>
        </Modal.Body>
      </Modal> */}



      {/* {
        user &&
        <>
          <div className={`nav-side ${navShow ? 'active' : 'inactive'}`} id='user__details'>
            <div className='user__image'>
            <img src={user.photoURL} alt='userimg' className='users__img' />
            </div>
            <h3 className='log__name'>Hello <p>{user.displayName}</p></h3>

          <div>
           
            <h5 className='user-name'><i class="fa-regular fa-envelope"></i> <span className='log__email'>{user.email}</span></h5>
          </div>

          <button className="logout__btn" onClick={handleLogout}>Logout</button>
          </div>
        </>
      } */}



      <Card className="blog__top" style={{ marginTop: "8.3rem", border: "none", backgroundColor:"#eee" }}>
        <Card.Img src={bgimage} alt="..." width="300px" height="100%" className='card__iamges' />
        <Card.ImgOverlay className='cards__details'>
          <Card.Text className='cards__titless'>Start Sharing Your Words Now!</Card.Text>
          <Card.Text className='cards__paras'>
            Ignite your writing passion. Share your voice with the world on our cutting-edge platform. Join a thriving community of dynamic bloggers today. Unleash your creativity and join a community of fellow bloggers today.
          </Card.Text>
          {/* <Card.Text>
          <small>Last updated 3 mins ago</small>
        </Card.Text> */}
        </Card.ImgOverlay>
      </Card>









      <div className='category__section' style={{ color: "#000" }}>
        <div className='category__head'>
          <h2 className='category__text'>Trending Blogs</h2>
        </div>
       

      </div>


      <Container>
        <Row>
          {blogs.map((blog) => (
            <Col key={blog.id} sm={12} md={6} lg={4} className="mb-4 cards__container" >
              <Link to={`/blog/${blog.id}`} style={{ textDecoration: "none", color: "#000", backgroundColor:"#000" }}>
                <Card className="h-100 custom-card-size">
                  <div className="card-image-container">
                    <Card.Img variant="top" src={blog.imageUrl} />
                  </div>
                  <Card.Body className='card__body'>
                    <Card.Title className='cards__category'>{blog.category}</Card.Title>
                    <Card.Text className='card__titless'>{blog.title}</Card.Text>
                    <Card.Text className='cards__names'>@{blog.userName}</Card.Text>
                    <Card.Text>{blog.date}</Card.Text>
                    <Card.Text className='cards__dates'>{new Date(blog.createdAt.seconds * 1000).toLocaleString()}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>








    </>
  );
}

export default Home;
