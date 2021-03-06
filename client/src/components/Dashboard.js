import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow } from 'mdbreact';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions';
import '../styles/dashboard.css'
import ProjectCard from './card/DashboardProjectCard';
import Footer from './Footer';
import DashboardConProjectsCard from "./card/DashboardConProjectCard"
import DashboardPenProjectCard from './card/DashboardPenProjectCard';
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import ScrollToTop from './ScrollToTop';

export default function Dashboard() {
  const [show, setShow] = useState(false);
  const [profilePicture, setProfilePicture] = useState('')
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currentUserData, setCurrentUserData] = useState([])
  const user = useSelector(state => state.user);
  const dispatch = useDispatch()
  const formData = new FormData()

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.append('profilePicture',profilePicture)
    
    fetch('/api/v1/hub', {
      method: 'PATCH',
      body:formData
    })
      .then(res => res.json())
      .then(data => {
        if(!data.error){
          loadProject()
          alert('Yay! Profile picture updated.')
          handleClose()
        }else{
          alert('Error loading picture')
        }
      })
    
  }
 

  const loadProject = () =>{
    fetch('/api/v1/hub/current')
    .then(res=>res.json())
    .then(data=>{
      setCurrentUserData(data)
      dispatch(login(data))
    })
  }
      
  useEffect(()=>{
    loadProject()
    //? Dependency doesn't depend on loadProject because we simply want to run the load projects when the component is rendered
    //? And we end up passing the loadProject function as a prop to be used elsewhere.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    return (
    <>
      <ScrollToTop />
      <Navbar />

      <div id="top">
    <MDBContainer>
      <MDBRow>
      <MDBCol md='3' sm="12" xs="3"  className="mt-5">
      <MDBCard testimonial className="card-profile" >
      <div />
          <div className='image-and-camera'>
          <img
              src={user.loginInfo.profilePicture} 
              alt='' className="rounded-circle hoverable border border-info dashboard-image" 
            />
          <button className="camera-button" onClick={handleShow}>
          <MDBIcon icon="camera" />
          </button>
          </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Update your profile picture</Modal.Title>
        </Modal.Header>
        <Modal.Body><form className="form-update-pic"  id="profilePic" onSubmit={(e) => {handleSubmit(e)}}>

        <div className="input-block-update">
            <label htmlFor="newProfilePic" > Choose file 
           </label>
           <br/>

           <label htmlFor="newProfilePic" className="new-profile-pic">
           <MDBIcon far icon="plus-square indigo-text" size='2x'/>
           </label> {profilePicture ? profilePicture.name : ''}


            <input type="file" id="newProfilePic" className="form-control" onChange={(e) => {setProfilePicture(e.target.files[0])}}/>

          </div>
          </form>

          </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        <Button form="profilePic" variant="success" type="submit" className=" ">
            SAVE CHANGES
          </Button>
          
        </Modal.Footer>
      </Modal>
      
          <MDBCardBody>
          <h4 className='card-title'> <MDBIcon icon="user indigo-text" /> {user.loginInfo.firstName} {user.loginInfo.lastName} </h4>
          <h4 className='card-title'><MDBIcon far icon="newspaper" /> {user.loginInfo.title ? user.loginInfo.title : (<Link className="add-skills" to='/hub'>Add headline</Link>)}</h4>
          <h4 className='card-title'> <MDBIcon icon="envelope orange-text" /> {user.loginInfo.email} </h4> 
          <Link to="/hub"><button name="button" type="button" className="btn btn-block  edit-button">Edit profile</button></Link>
            <hr />

            <h3 className="card-title">
            <MDBIcon icon="cogs grey-text" /> Technical Skills</h3>
            <h2>
            {Object.keys(currentUserData).length > 0 && currentUserData.Skills.filter((userData)=>{
                return (userData.category === "technical")
               
                  
              }).length> 0 ? (currentUserData.Skills.filter((userData)=>{
                return (userData.category === "technical")
               
                  
              }).map((name, index)=>{
                  return <span className="skills-dashboard" key={index}>{name.name} </span> 
                })): (<Link className="add-skills" to='/hub'>Add skills to your profile</Link>)}
            </h2>
            
            <br/>
            <hr />

            <h3 className="card-title">
            <MDBIcon icon="hand-holding-heart pink-text" /> Soft Skills
            </h3>
            <h2>
            {Object.keys(currentUserData).length > 0 && currentUserData.Skills.filter((userData)=>{
                return (userData.category === "soft")
               
                  
              }).length> 0 ? (currentUserData.Skills.filter((userData)=>{
                return (userData.category === "soft")
               
                  
              }).map((name, index)=>{
                
                  return <span className="skills-dashboard" key={index}>{name.name} </span> 
                })): (<Link className="add-skills" to='/hub'>Add skills to your profile</Link>)}
            </h2>
            <br/>
            <hr />

            <h3 className="card-title">
            <MDBIcon icon="language purple-text" /> Spoken languages </h3>
              <h2>
              {Object.keys(currentUserData).length > 0 && currentUserData.Skills.filter((userData)=>{
                return (userData.category === "language")  
              }).length> 0 ? (currentUserData.Skills.filter((userData)=>{
                return (userData.category === "language")  
              }).map((name, index)=>{
                  return <span className="skills-dashboard" key={index}>{name.name} </span> 
                })): (<Link className="add-skills" to='/hub'>Add languages to your profile</Link>)}
              </h2>
            <br/>
            <hr />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>

    
      <MDBCol md='8'  className="projects-col pl-5">
          <h1 className="title-cards">My Projects</h1>

             
          {Object.keys(currentUserData).length > 0 && (Object.keys(currentUserData.Projects).length > 0 ? (currentUserData.Projects.map((project, index)=>{
            return <ProjectCard key={project.id} project={project} loadProject={loadProject}/>
          })): "You haven't published any projects yet") } 
          <Link to="/projectForm"><button className="btn btn-block mb-3 publish-button">
            Publish a new project
          </button></Link>
          <br />

          <h1 className="title-cards">Contributing Projects</h1>
          {Object.keys(currentUserData).length > 0 && 
            <>
              {currentUserData.MemberProjects.filter(project => project.TeamMember.approved === "approved").map(project => {
                return <DashboardConProjectsCard key={project.id} project={project}/>
              })}
              {currentUserData.MemberProjects.filter(project => project.TeamMember.approved === "approved").length === 0 && (
                "You are not contributing to any projects yet"
              )}
              <h1 className="title-cards">Pending Projects</h1>
              {currentUserData.MemberProjects.filter(project => project.TeamMember.approved === "pending").map(project => {
                return <DashboardPenProjectCard key={project.id} project={project}/>
              })}
              {currentUserData.MemberProjects.filter(project => project.TeamMember.approved === "pending").length === 0 && (
              "You haven't applied for any projects yet"
              )}
            </>
          }
      </MDBCol>
    </MDBRow>
    </MDBContainer>
        </div>

        <Footer />
      </>
    )
}
