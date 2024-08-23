import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Dropdown, Button, Modal, Row, Col, Card } from 'react-bootstrap';
import { signOut } from 'firebase/auth';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [shows, setShows] = useState(false);


  const [user, setUser] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true); // State for managing loading


  useEffect(() => {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";

      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }

  }, [user]);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });
    return () => unsubscribe();

  }, []);



  const [show, setShow] = useState(false);


  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const user = auth.currentUser;

  //     if (user) {
  //       const userDoc = await getDoc(doc(db, 'users', user.uid));
  //       if (userDoc.exists()) {
  //         setUserData(userDoc.data());
  //       }

  //          // Fetch the user's blogs
  //          const blogsQuery = query(collection(db, 'blogs'), where('userId', '==', user.uid));
  //          const querySnapshot = await getDocs(blogsQuery);
  //          const blogsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //          setBlogs(blogsList);  

  //             // Fetch the user's feedbacks
  //       const feedbacksQuery = query(collection(db, 'feedback'), where('userId', '==', user.uid));
  //       const feedbacksSnapshot = await getDocs(feedbacksQuery);
  //       const feedbacksList = feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setFeedbacks(feedbacksList);

  //     } else {
  //       navigate('/signin'); // Redirect to signin if no user is logged in
  //     }

  //     setLoading(false); // Set loading to false once the data is fetched
  //   };

  //   fetchUserData();
  // }, [navigate]);



  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch user profile data
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch user's blogs
        const blogsQuery = query(collection(db, 'blogs'), where('userId', '==', currentUser.uid));
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogsList);

         // Fetch user's blogs
        //  const feedbacksQuery = query(collection(db, 'feedback'), where('userId', '==', currentUser.uid));
        //  const feedbacksSnapshot = await getDocs(feedbacksQuery);
        //  const feedbacksList = feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        //  setFeedbacks(feedbacksList);


      } else {
        navigate('/login'); // Redirect to signin if no user is logged in
      }
      setLoading(false); // Set loading to false once data is fetched
    };


    fetchUserData();
  }, [navigate]);





         



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



      {loading ? (
        <div className='center'>
          <div className='ring'></div>
          <span>Loading...</span>
        </div>
      ) : (
        userData && (
        <div className="profiles__cont">
              <div className='profiles__images'>
                <img src={userData.imageUrl} alt="Profile"  style={{width:"80px",height:"80px", borderRadius:"50%", transform:"translateY(5rem)", border :"3px solid #fff", objectFit:"cover", backgroundSize:"cover", backgroundPosition:"center"}}/>
              </div>
              <div className='profiless__details' style={{marginTop:"3.7rem"}}>
                <h3 className='profiles__names'><box-icon name='user' style={{fill:"lightskyblue", transform:"translateX(-0.5rem)"}}></box-icon> {userData.name}</h3>
                <h3 className='profiles__emails'><box-icon name='envelope' style={{fill:"lightskyblue",transform:"translateX(-0.5rem)"}}></box-icon> {userData.email}</h3>
                <h3 className='profiles__emails'><box-icon name='lock-alt' style={{fill:"lightskyblue",transform:"translateX(-0.5rem)"}}></box-icon> {userData.password}</h3>
              </div>
            </div>


        )
      )}





{/* <div className='category__container' style={{marginTop:"13rem"}}>
              {blogs.map((blog) => (
                <div className='blog__containers' key={blog.id}>
                  <Link to={`/blog/${blog.id}`} style={{ textDecoration: "none", color: "#000" }}>
                    <div className='category__box'>
                      <div className='category__image'>
                        <img src={blog.imageUrl} alt='Blog image' className='category__img'/>
                      </div>
                      <div className='category__details'>
                        <h3 className='category__category'>{blog.category}</h3>
                        <h3 className='category__title'>@{blog.userName}</h3>
                        <h3 className='category__title'>{blog.title}</h3>
                        <h3 className='category__name'>{blog.date}</h3>
                        <h3>{new Date(blog.createdAt.seconds * 1000).toLocaleString()}</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div> */}






            <Container>
        <Row>
          {blogs.map((blog) => (
            <Col key={blog.id} sm={12} md={6} lg={4} className="mb-4 cards__container" style={{marginTop:"3rem"}}>
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




            {/* <div className='category__container' style={{marginTop:"13rem"}}>
              {feedbacks.map((feedback) => (
                <div className='blog__containers' key={feedback.id}>
              
                    <div className='category__box'>

                      <div className='category__details'>
                        <h3 className='category__category'>{feedback.name}</h3>
                        <h3 className='category__title'>{feedback.email}</h3>
                        <h3 className='category__title'>{feedback.suggestion}</h3>
                    
                      </div>
                    </div>

                </div>
              ))}
            </div> */}




    </>
  );
};

export default Profile;


