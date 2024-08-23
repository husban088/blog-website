import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navbar, Container, Nav, Offcanvas, Row, Col, Card } from 'react-bootstrap';
import { signOut } from 'firebase/auth';

const UserBlogs = () => {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);

  const [currentUserDetails, setCurrentUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const q = query(collection(db, 'blogs'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      setBlogs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };


    const fetchUserDetails = async () => {
      const userDoc = doc(db, 'users', userId); // Assuming users are stored in a 'users' collection
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        setCurrentUserDetails(userSnap.data());
      }
    };

    fetchUserDetails();
    fetchUserBlogs();
  }, [userId]);

  const navigate = useNavigate();


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);



  const [shows, setShows] = useState(false);


  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=> {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";
      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }
  },[user])

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



  // const handleLogoutUser = async (userId) => {
  //   try {
  //     // Revoke user refresh tokens (requires Firebase Admin SDK)
  //     // You would typically call this from your server
  //     await fetch(`/revokeTokens/${userId}`, { method: 'POST' });

  //     // Optionally delete user from Firebase Auth
  //     await deleteDoc(doc(db, 'user', userId));

  //     // Remove the user from the state
  //     setUsers(users.filter(user => user.id !== userId));

  //     // Provide feedback
  //     console.log(`User with ID ${userId} has been logged out and removed.`);
  //   } catch (error) {
  //     console.error('Error logging out user:', error);
  //   }
  // };




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
              <Nav.Link className='nav-links' id='panel__link'><Link to={'/panel'} className='nav__link'>Panel</Link></Nav.Link>
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



    {/* User details */}
    {currentUserDetails && (
        <div className="profiles__cont" style={{marginTop:"13rem"}}>

          <div className='profiles__images'>
          <img src={currentUserDetails.imageUrl} alt="User profile" style={{width:"80px",height:"80px", borderRadius:"50%", transform:"translateY(4.5rem)", border :"3px solid #fff", objectFit:"cover", backgroundSize:"cover", backgroundPosition:"center", }} />
          </div>

          <div className='profiless__details' style={{ marginTop: '3rem' }}>
          <h3 className='profiles__names'><box-icon name='user' style={{fill:"lightskyblue", transform:"translateX(-0.5rem)"}}></box-icon> {currentUserDetails.name}</h3>
          <h3 className='profiles__emails'><box-icon name='envelope' style={{fill:"lightskyblue",transform:"translateX(-0.5rem)"}}></box-icon> {currentUserDetails.email}</h3>
          <h3 className='profiles__emails'><box-icon name='lock-alt' style={{fill:"lightskyblue",transform:"translateX(-0.5rem)"}}></box-icon>  {currentUserDetails.password}</h3>
          </div>
       
        
         
        </div>
      )}





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



    </>
  );
};

export default UserBlogs;