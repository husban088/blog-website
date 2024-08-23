import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, deleteDoc, query, collection, where, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Dropdown, Button, Modal } from 'react-bootstrap';


import '../App';
import { signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();



  const [show, setShow] = useState(false);
  // const [product, setProduct] = useState([]);

  const [shows, setShows] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [user, setUser] = useState(null);


  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    // setProfile(null);
    navigate("/login");
  };

  const handleClose = () => setShow(false);


  useEffect(() => {
    if (user) {
      const adminEmail = "husbanahmad9371@gmail.com";
      const adminName = "husban ahmad";

      setIsAdmin(user.email === adminEmail);
    } else {
      setIsAdmin(false);
    }

  }, [user]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        if (blogDoc.exists()) {
          setBlog({ id: blogDoc.id, ...blogDoc.data() });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };
    fetchBlog();
  }, [id]);


  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });

    return () => unsubscribe();

  }, []);





  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  const handleDelete = async () => {
    if (blog.userId === auth.currentUser.uid) {
      await deleteDoc(doc(db, 'blogs', id));
      navigate('/');
    }
  };









  const { blogId } = useParams(); // Assuming you're using React Router to pass the blog ID as a URL parameter
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await db.collection('blogs').doc(blogId).get(); // Fetching the blog data from Firestore
        if (blogDoc.exists) {
          setBlog(blogDoc.data());
        } else {
          console.error('No such blog!');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false); // Stop the loading spinner whether data was fetched successfully or not
      }
    };

    fetchBlog();
  }, [blogId]);



  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, 'comments'), where('blogId', '==', id));
        const querySnapshot = await getDocs(q);
        setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [id]);


  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      await addDoc(collection(db, 'comments'), {
        blogId: id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        content: newComment,
        timestamp: new Date()
      });
      setNewComment('');
      const q = query(collection(db, 'comments'), where('blogId', '==', id));
      const querySnapshot = await getDocs(q);
      setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentDoc = doc(db, 'comments', commentId);
      const commentData = (await getDoc(commentDoc)).data();
      if (commentData.userId === user.uid || isAdmin) {
        await deleteDoc(commentDoc);
        const q = query(collection(db, 'comments'), where('blogId', '==', id));
        const querySnapshot = await getDocs(q);
        setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async () => {
    if (editContent.trim() === '') return;
    try {
      const commentDoc = doc(db, 'comments', editCommentId);
      const commentData = (await getDoc(commentDoc)).data();
      if (commentData.userId === user.uid || isAdmin) {
        await setDoc(commentDoc, { ...commentData, content: editContent }, { merge: true });
        setEditCommentId(null);
        setEditContent('');
        const q = query(collection(db, 'comments'), where('blogId', '==', id));
        const querySnapshot = await getDocs(q);
        setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditCommentId(commentId);
    setEditContent(content);
  };

  const handleEditCancel = () => {
    setEditCommentId(null);
    setEditContent('');
  };






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






      <div className='blog__container' style={{ marginBottom: "3rem", color: "#000", width:"50%", marginRight:"auto", marginLeft:"auto" }}>
        <div className='row'>
          <div className='col-1-of-2' style={{ marginRight: "auto", marginLeft: "auto" }}>
            <div className='blogs__details' style={{ marginRight: "auto", marginLeft: "auto" }}>
              <div className='back__button'>
                <Link style={{ textDecoration: "none", color: "#fff" }} to={'/'} className='back__btn'><box-icon name='arrow-back' style={{ fill: "white", transform: "translateX(-0.5rem)" }}></box-icon> Back</Link>
              </div>
              {/* <div className='blogs__cat-head'>
            <h3 className='blogs__cat-text'>Categories: <Link style={{textDecoration:"none", color:"#fff"}} className='code__btn'>{product.category}</Link></h3>
            </div> */}
              <div className='blog__title-head'>

                {blog ? (
                  <>
                    {/* <Link style={{ textDecoration: "none", color: "#000" }} to={'/profile'}><h5 className='blog__title-text'>@{blog.userName}</h5></Link> */}

                    <div className='blog__details-section'>

                      <h5 className='blog__names-texts'>@{blog.userName}</h5>

                      <h3 className='blog__titles-text'>Category: <span className='category__category category__categorys'>{blog.title}</span></h3>
                      <h2 className='blog__details-text'>{blog.details}</h2>
                      {/* <h2 className='blog__comp-text'>Power code</h2> */}
                      <h2 className='blog__date-text'>{blog.date}</h2>
                      <img src={blog.imageUrl} alt='blog image' className='blog__image-img' />

                    </div>

                    <div className='edit__delete'>
                      {blog.userId === auth.currentUser.uid && (
                        <>
                          <box-icon name='edit-alt' style={{ fill: "blue", cursor: "pointer" }} onClick={handleEdit}></box-icon>
                          <box-icon name='trash' style={{ fill: "red", cursor: "pointer" }} onClick={handleDelete}></box-icon>
                        </>

                      )}
                    </div>


                  </>
                )
                  :
                  (
                    // <p>Loading....</p>
                    <div className='center'>
                      <div className='ring'></div>
                      <span>Loading...</span>
                    </div>
                  )
                }

              </div>
            </div>
          </div>
          {/* <div className='col-1-of-2'>
          <div className='blog__box'>
            <div className='trnd__blog-head'>
              <h3 className='trnd__blog-text'>Trending Blogs</h3>
            </div>
            <div className='blog__conts'>
                {
                  blogTopList.map((blogtoplist)=> {
                    return(
                      <>
                        <div className='blogs__details-sect'>
                        <Link style={{textDecoration:"none", color:"#fff"}} to={`/blog/${blogtoplist.id}`} key={blogtoplist.id}>
                        <div className='blogs__details-cont'>
                        <div className='blogs__details-image'>
                            <img src={blogtoplist.image} alt="blog image" className='blogs__details-img'/>
                            <h4 className='blogs__details-title'>{blogtoplist.title}</h4>
                          </div>
                          <div className='blogs__details-date'>
                            <h3 className='blogs__details-dates'>{blogtoplist.date}</h3>
                          </div>
                        </div>
                        </Link>
                      </div>
                      </>
                    )
                  })
                }
            </div>
          </div>
        </div> */}
        </div>
      </div>





      {/* {loading ? (
        <div>Loading blog details...</div> // Display this while data is being fetched
      ) : blog ? (
        <div className='blog__container'>
          <h1>{blog.title}</h1>
          <p>Category: {blog.category}</p>
          <div>
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{ width: '100%', height: 'auto' }} // Ensures the image is responsive
            />
          </div>
          <p>{blog.details}</p>
        </div>
      ) : (
        <div>Blog not found</div> // Display if blog data is not available
      )} */}








      {/* <div className='category__container'>
                {blog && (
                    <>
                        <div className='blog__containers'>
                                <div className='category__box'>
                                    <div className='category__image'>
                                        <img src={blog.imageUrl} alt='category image' className='category__img' />
                                    </div>
                                    <div className='category__details'>
                                    <h3 className='category__title'>{blog.title}</h3>
                                    <h3 className='category__title'>{blog.details}</h3>

                                        <p>Written by: {blog.userName}</p>
                                        {blog.userId === auth.currentUser.uid && (
                                            <>
                                                <button onClick={handleEdit}>Edit</button>
                                                <button onClick={handleDelete}>Delete</button>
                                            </>
                                        )}
                                    </div>

                                </div>
                        </div>
                    </>
                )}
            </div> */}





      {/* <div style={{ marginTop: '14rem' }}>
                {blog && (
                    <>
                        <img src={blog.imageUrl} style={{ marginTop: '10rem' }} />
                        <h2>{blog.title}</h2>
                        <p>{blog.details}</p>
                        <p>Written by: {blog.userName}</p>
                        {blog.userId === auth.currentUser.uid && (
                            <>
                                <button onClick={handleEdit}>Edit</button>
                                <button onClick={handleDelete}>Delete</button>
                            </>
                        )}
                    </>
                )}
            </div> */}




      {/* {blog ? (
      <div className='category__box'>
        <div className='category__image'>
          <img src={blog.imageUrl} alt={blog.title} className='category__img' />
        </div>
        <div className='category__details'>
          <h3 className='category__category'>{blog.category}</h3>
          <Link to={`/profile`} style={{ textDecoration: "none", color: "black" }}>
            <h3 className='category__title'>@{blog.userName}</h3>
          </Link>
          <h3 className='category__title'>{blog.title}</h3>
          <h3 className=''>{blog.details}</h3>
        </div>
      </div>
    ) : (
      <p>Loading blog details...</p>
    )} */}










      <div className='comment__section'>
        <h3>Add Comments</h3>
        {user && (
          <div className='blog__add-comment'>
            <input
              type='text'
              value={newComment}
              className='comment__input'
              required
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Add a comment...'
            />
            <div className='add__button'>
              <button className="custom-btn btn-5" onClick={handleAddComment}>Add</button>
            </div>
          </div>
        )}
        {comments.map(comment => (
          <div key={comment.id} className='blog__comment'>
            <h3 className='comment__name'><strong>@{comment.userName}</strong>: {editCommentId === comment.id ? (
              <>
                <div className='blog__add-comment blog__add-comments'>
                  <input
                    type='text'
                    value={editContent}
                    className='comment__inputs'
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className='comment__buttons'>
                    <button className="custom-btn btn-5" onClick={handleEditComment}>Save</button>
                  </div>

                  <div className='comment__buttons'>
                    <button className="custom-btn btn-5" onClick={handleEditCancel}>Cancel</button>
                  </div>

                </div>
              </>
            ) : (
              comment.content
            )}</h3>
            {comment.userId === user?.uid || isAdmin ? (
              <div className='blog__comment-actions'>
                {editCommentId !== comment.id ? (
                  <>
                    <box-icon name='edit-alt' className='pen__icon' style={{ fill: "blue", cursor: "pointer" }} onClick={() => handleEditClick(comment.id, comment.content)}></box-icon>
                    <box-icon name='trash' className='bask__icon' style={{ fill: "red", cursor: "pointer" }} onClick={() => handleDeleteComment(comment.id)}></box-icon>
                  </>
                ) : (
                  // <Button onClick={handleEditCancel}>Cancel Edit</Button>
                  ''
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>






    </>
  );
};

export default BlogDetails;