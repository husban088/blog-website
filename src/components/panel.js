import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import pnguser from './assets/pnguser.png'

import { Navbar, Container, Nav, NavDropdown, Offcanvas, Dropdown, Button, Modal, Row, Col, Card } from 'react-bootstrap';
import { FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth, providers, provider, db, database, firestore } from './firebase'
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, deleteDoc, doc, getDocs, updateDoc, getDoc, query, where } from 'firebase/firestore';



const Panel = () => {


  const [user, setUser] = useState(null);



  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });

    return () => unsubscribe();

  }, []);

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



  const navigate = useNavigate();


  const handleLogout = async () => {
    await signOut(auth);
    setUsers(null);
    // setProfile(null);
    navigate("/login");
  };




  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = await getDocs(collection(db, 'blogs'));
      setBlogs(blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'users'));
      setUsers(usersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchBlogs();
    fetchUsers();
  }, []);

  const handleDelete = async (blogId) => {
    try {
      await deleteDoc(doc(db, 'blogs', blogId));
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };






  const [feedbackList, setFeedbackList] = useState([]);
  const [editFeedback, setEditFeedback] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedSuggestion, setEditedSuggestion] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackSnapshot = await getDocs(collection(db, 'feedback'));
      const feedbackData = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbackList(feedbackData);
    };

    fetchFeedback();
  }, []);

  const handleDeletes = async (id) => {
    try {
      await deleteDoc(doc(db, 'feedback', id));
      setFeedbackList(feedbackList.filter(feedback => feedback.id !== id));
    } catch (error) {
      console.error('Error deleting feedback: ', error);
    }
  };

  const handleEdit = (feedback) => {
    setEditFeedback(feedback);
    setEditedName(feedback.name);
    setEditedEmail(feedback.email);
    setEditedSuggestion(feedback.suggestion);
  };

  const handleUpdate = async (id) => {
    const updatedFeedback = {
      name: editedName,
      email: editedEmail,
      suggestion: editedSuggestion,
      updatedAt: new Date(),
    };

    try {
      await updateDoc(doc(db, 'feedback', id), updatedFeedback);
      setFeedbackList(feedbackList.map(fb => (fb.id === id ? { ...fb, ...updatedFeedback } : fb)));
      setEditFeedback(null);
    } catch (error) {
      console.error('Error updating feedback: ', error);
    }
  };



  const handleLogoutUser = async (userId) => {
    try {
      // Revoke user refresh tokens (requires Firebase Admin SDK)
      // You would typically call this from your server
      await fetch(`/revokeTokens/${userId}`, { method: 'POST' });

      // Optionally delete user from Firebase Auth
      await deleteDoc(doc(db, 'user', userId));

      // Remove the user from the state
      setUsers(users.filter(user => user.id !== userId));

      // Provide feedback
      console.log(`User with ID ${userId} has been logged out and removed.`);
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  };


  // const handleLogoutUser = async (userId) => {
  //   try {
  //     // Revoke user refresh tokens using Firebase Admin SDK on your server
  //     // The endpoint `/revokeTokens/{userId}` should be implemented on your server to handle token revocation.
  //     await fetch(`/revokeTokens/${userId}`, { method: 'POST' });

  //     // Alternatively, if you want to just log the user out locally without affecting Firebase Auth data
  //     // You can do something like this if the user is currently authenticated:
  //     // await signOut(auth);
  //     // Note: This approach won't remove user data from Firestore but only end the current session.

  //     // Remove the user from the state to update the UI
  //     setUsers(users.filter(user => user.id !== userId));

  //     // Provide feedback
  //     console.log(`User with ID ${userId} has been logged out.`);
  //   } catch (error) {
  //     console.error('Error logging out user:', error);
  //   }
  // };


  // const handleLogoutUser = async (userId) => {
  //   try {
  //     // Mark the user as logged out in Firestore
  //     const userRef = doc(db, 'users', userId);
  //     await updateDoc(userRef, { isLoggedOut: true });

  //     // Update the local state to remove the user
  //     setUsers(users.filter(user => user.id !== userId));

  //     console.log(`User with ID ${userId} has been logged out.`);
  //   } catch (error) {
  //     console.error('Error logging out user:', error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const q = query(collection(db, 'users'), where('isLoggedOut', '!=', true));
  //     const usersCollection = await getDocs(q);
  //     setUsers(usersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  //   };

  //   fetchUsers();
  // }, []);


  // const handleLogoutUser = async (userId) => {
  //   try {
  //     // Just sign out the user from your local app
  //     await signOut(auth);

  //     // Remove the user from the local state to update the UI
  //     setUsers(users.filter(user => user.id !== userId));

  //     // Provide feedback to the admin
  //     console.log(`User with ID ${userId} has been logged out.`);
  //   } catch (error) {
  //     console.error('Error logging out user:', error);
  //   }
  // };







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
                <Nav.Link className='nav-links' id='panel__link'><Link to={'/panel'} className='nav__link'>Panel</Link></Nav.Link>
              }
              <Nav.Link className='nav-links'>
                {
                  !user ?
                    <Nav.Link onClick={() => setShows(!shows)}>
                      <Link className='nav__link nav-link logout-button' style={{ textDecoration: "none", color: "black" }} onClick={handleLogout}>Login</Link>
                    </Nav.Link>
                    :
                    <Nav.Link><Link to={'/'} className='nav__link nav-link logout-button' style={{ textDecoration: "none", color: "black" }} onClick={handleLogout}>Logout</Link></Nav.Link>
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





      {/* <div className="admin-feedback" style={{ marginTop: "13rem" }}>
        <h2 className="category__text category__texts">Admin Feedback Management</h2>
        {feedbackList.map(feedback => (
          <div key={feedback.id} className="">
            {editFeedback?.id === feedback.id ? (
              <div className="login__cont addblogs__cont" style={{ marginTop: "3rem" }}>

                <h1 className="login__head" style={{ textAlign: "center" }}>Edit and delete feedback</h1>


                <div className='inputbox'>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />

                </div>


                <div className='inputbox'>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />

                </div>

                <div className='inputbox'>
                  <input
                    value={editedSuggestion}
                    onChange={(e) => setEditedSuggestion(e.target.value)}
                  />

                </div>

                <div className='login__button' style={{ marginBottom: "2rem", textAlign: "center" }}>
                  <button className="custom-btn btn-5" onClick={() => setEditFeedback(null)}>Cancel</button>
                </div>

                <div className='login__button' style={{ textAlign: "center" }}>
                  <button className="custom-btn btn-5" style={{ marginBottom: "2rem" }} onClick={() => handleUpdate(feedback.id)}>Update</button>
                </div>


              </div>


            ) : (
               <Container>
                <Row>
                  <Col sm={12} md={6} lg={4} className="mb-4 cards__container">
                    <Card className="h-300 custom-card-size custom-card-sizes">
                      <Card.Body className='card__bodys'>
                        <Card.Text className='card__namesss'>Name: {feedback.name}</Card.Text>
                        <Card.Text className='card__namesss'>Email: {feedback.email}</Card.Text>
                        <Card.Text className='card__namesss'>Suggestion: {feedback.suggestion}</Card.Text>
                        <Card.Text>{feedback.date}</Card.Text>
                        <Card.Text className='cards__dates'>{new Date(feedback.createdAt.seconds * 1000).toLocaleString()}</Card.Text>
                        <div>
                              <box-icon name='edit-alt' className='pen__icon' style={{ fill: "blue", cursor: "pointer" }} onClick={() => handleEdit(feedback)}></box-icon>
                              <box-icon name='trash' className='bask__icon' style={{ fill: "red", cursor: "pointer" }} onClick={() => handleDeletes(feedback.id)}></box-icon>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>

            )}
          </div>
        ))}
      </div> */}







<div className="admin-feedback" style={{ marginTop: "13rem" }}>
  <h2 className="category__text category__texts">Admin Feedback Management</h2>
  
  {/* Feedback List */}
  <Container>
    <Row>
      {feedbackList.map(feedback => (
        <Col sm={12} md={6} lg={4} className="mb-4" key={feedback.id}>
          <Card className="h-100 custom-card-size">
            <Card.Body className='card__bodys'>
              <Card.Text className='card__namesss'>Name: {feedback.name}</Card.Text>
              <Card.Text className='card__namesss'>Email: {feedback.email}</Card.Text>
              <Card.Text className='card__namesss'>Suggestion: {feedback.suggestion}</Card.Text>
              <Card.Text>{feedback.date}</Card.Text>
              <Card.Text className='cards__dates'>
                {new Date(feedback.createdAt.seconds * 1000).toLocaleString()}
              </Card.Text>
              <div>
                <box-icon name='edit-alt' className='pen__icon' style={{ fill: "blue", cursor: "pointer" }} onClick={() => handleEdit(feedback)}></box-icon>
                <box-icon name='trash' className='bask__icon' style={{ fill: "red", cursor: "pointer" }} onClick={() => handleDeletes(feedback.id)}></box-icon>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
  
  {/* Edit Feedback Section */}
  {editFeedback && (
    <div className="edit-feedback-section" style={{ marginTop: "3rem" }}>
      <div className="login__cont addblogs__cont">
        <h1 className="login__head" style={{ textAlign: "center" }}>Edit Feedback</h1>

        <div className='inputbox'>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </div>

        <div className='inputbox'>
          <input
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        </div>

        <div className='inputbox'>
          <input
            value={editedSuggestion}
            onChange={(e) => setEditedSuggestion(e.target.value)}
          />
        </div>

        <div className='login__button' style={{ marginBottom: "2rem", textAlign: "center" }}>
          <button className="custom-btn btn-5" onClick={() => setEditFeedback(null)}>Cancel</button>
        </div>

        <div className='login__button' style={{ textAlign: "center" }}>
          <button className="custom-btn btn-5" style={{ marginBottom: "2rem" }} onClick={() => handleUpdate(editFeedback.id)}>Update</button>
        </div>
      </div>
    </div>
  )}
</div>











      <div style={{ marginTop: "5rem" }}>
        {/* <h2>Edit and delete of users Blogs</h2>
        <div className='category__container'>
        {blogs.map((blog) => (
          <div key={blog.id} className='category__box'>
            <div className='category__details'>
            <h3 className='category__title'>{blog.title}</h3>
            <h3 className='category__name'>By: @{blog.userName}</h3>
            
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link to={`/edit-blog/${blog.id}`}><i class="fa-solid fa-pen-to-square pen__icon"></i></Link>
            <i class="fa-solid fa-trash bask__icon" onClick={() => handleDelete(blog.id)}></i>
            </div>

            </div>
          </div>
        ))}
        </div> */}
        <h2 className='category__text category__texts'>User Login Details</h2>
        <div className='userprof__container'>
          {users.map((user) => (

            <Link to={`/user-blogs/${user.id}`} style={{ textDecoration: "none", color: "black" }}>

              <div className='userprof__box'>

                <div className='userprof__image' style={{ transform: "translateY(1rem)" }}>
                  <img src={user.imageUrl} alt="Profile" className='userprof__img' style={{ width: '85px', height: '85px', borderRadius: '10%', objectFit: "cover" }} />
                </div>

                <div className='userprof__details'>
                  <h3 className='userprof__name'>@{user.name}</h3>
                  <h3 className='category__name' style={{ color: 'black' }}>{user.date}</h3>
                  {/* <h3 className='category__name'>Email: {user.email}</h3> */}
                </div>

                {/* <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                 <Link to={`/user-blogs/${user.id}`}><i class="fa-solid fa-eye pen__icon"></i></Link>
                 <i className="fa-solid fa-sign-out bask__icon" onClick={()=> handleLogoutUser(user.id)}></i>
               </div> */}

              </div>

            </Link>

          ))}
        </div>
      </div>


    </>
  );
};

export default Panel;