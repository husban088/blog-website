import React, { useEffect, useState } from "react";
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "./firebase";
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";


function Feedback() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = async (e) => {

    const user = auth.currentUser;

    e.preventDefault();

    try {
      await addDoc(collection(db, 'feedback'), {
        name,
        email,
        suggestion,
        userId: user.uid,
        createdAt: new Date(),
      });

      setName('');
      setEmail('');
      setSuggestion('');
      alert('Feedback submitted successfully!');
      navigate('/')
    } catch (error) {
      console.error('Error adding feedback: ', error);
    }
  };



  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });

    return () => unsubscribe();

  }, []);

  // async function handleLogout() {
  //   try {
  //     await auth.signOut();
  //     // navigate('/')
  //     console.log("User logged out successfully!");
  //   } catch (error) {
  //     console.error("Error logging out:", error.message);
  //   }
  // }

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    // setProfile(null);
    navigate("/login");
  };


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);



  const [shows, setShows] = useState(false);



  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";
      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }
  }, [user])




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



      <form className="login__cont addblogs__cont" onSubmit={handleSubmit} style={{marginTop:"13rem"}}>
        <h1 className="login__head" style={{ textAlign: "center" }}>Suggestion box</h1>
        <h3 className="login__head-para" style={{ textAlign: "center" }}>Please share your suggestion with us</h3>

        <div className="inputbox">
          <input
            label="Your Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <span>Your Name</span>
          <i></i>

        </div>

        <div className="inputbox">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            label="Your Email"
          />
          <span>Your Email</span>
          <i></i>
        </div>

        <div className="inputboxes">
          <textarea
          rows={10} 
          cols={10}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className='addblog__txt'
            placeholder='Your Suggestion'
            required
          />
          {/* <span>Your Suggestion</span>
          <i></i> */}
        </div>

        <div className='login__button' style={{textAlign:"center"}}>
          <button className="custom-btn btn-5" type="submit">Add feedback</button>

        </div>
      </form>

    </>
  );
}

export default Feedback;



