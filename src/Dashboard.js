import './Dash.css';
import React, {useState , useEffect} from 'react';
import { useHistory, useLocation } from "react-router";
import { useNavigate,useParams } from "react-router-dom";
import firebase from 'firebase';
import {
  getFirestore, query,
  getDocs, collection,
  where, addDoc, update 
}from "firebase/firestore";
var ip = 'localhost'
var config = {
  apiKey: "AIzaSyCrtUrEBF8X0pQQU7_-GS9F5IaxX8mGtXU",
  authDomain: "make-it-cde4f.firebaseapp.com",
  databaseURL: "https://make-it-cde4f-default-rtdb.firebaseio.com",
  projectId: "make-it-cde4f",
  storageBucket: "make-it-cde4f.appspot.com",
  messagingSenderId: "835509810208",
  appId: "1:835509810208:web:cc696476ad076d008ef845"
  };
function Dashboard(props) {
  let {signIn,uname} = useParams();
  const db = firebase.firestore()
 const navigate = useNavigate();
 const location = useLocation();
 const [signedIn,setSignedIn] = useState(signIn=="signedIn"?"signedIn":"signedOut")
 const [Email,setEmail] = useState(uname==undefined?"Unknown":uname)
 const [newUserName,setNewUserName] = useState('')
 const [newPassword,setNewPassword] = useState('')
 const [oldPassword,setOldPassword] = useState('')
 const [status,setStatus] = useState('None')
 const [reports,setReports] = useState([])
 const [urecipes,setRecipes] = useState([])
 const [approved,setApproved] = useState('0')
 const [pending,setPending] = useState('0')
 const [Total,setTotal] = useState('0')
 useEffect(()=>{
    
    db.collection("feebacks")
  .get()
  .then(async function(querySnapshot) {
    var temp =[]
    await querySnapshot.forEach(function(doc) {
      temp.push({
        name:doc.data().name,
        email:doc.data().email,
        problem:doc.data().feedback
      })
          
      });
    setReports(temp)
  });

  db.collection("userRecipes")
  .get()
  .then(async function(querySnapshot) {
    var temp =[]
    await querySnapshot.forEach(function(doc) {
      temp.push({
        name:doc.data().title,
        webURL:doc.data().webURL,
        PicURL:doc.data().picURL,
        status:doc.data().status,
        id:doc.id
      })
          
      });
    setRecipes(temp)
  });
},[status])
 function createAccount (){
  setStatus('create')
 }
 function updatePassword (){
   setStatus('update')
 }
 function report (){
   setStatus('report')
 }
function recipes (){
  setStatus('recipes')
}
 function signOut (){
   setSignedIn("signedOut")
  navigate("/")
 }
 function back (){
  setStatus('None')
 }
 function update (){
  db.collection("userRecipes")
  .get()
  .then(async function(querySnapshot) {
    var temp ="" 
    var t=0;
    var p=0;
    var a=0;
    await querySnapshot.forEach(function(doc) {
      t=t+1
      if(doc.data().status=="pending"){
        p=p+1
      }else if(doc.data().status=="approved"){
        a=a+1
      }  
          
      });
    setApproved(a)
    setPending(p)
    setTotal(t)
    });
 }
 
var SubmitCreateForm = (event)=>{
  event.preventDefault();
  firebase.database().ref('Administrators/'+newUserName).set({'password':newPassword});
  console.log("SUbmited "+newUserName+"  "+newPassword+" end")  
  setNewUserName('')
  setNewPassword('')
  alert('Administrator Created')
  setStatus('None')
}
var SubmitUpdateForm = (event)=>{
  event.preventDefault();
  var  update = false;
  firebase.database().ref('Administrators/'+Email).on('value', (snapshot) => {
    if(oldPassword==snapshot.val().password){
      update = true;
    }
  });
  if(update){
      firebase.database().ref('Administrators/'+Email).set({'password':newPassword});
      setOldPassword("")
      setNewPassword("")
      alert('Password Updated')
  }else{
      alert('Wrong Old Password')
  }  
}

 if(signedIn=='signedIn' && status=='None'){
  return (
    <div className="DashApp">
      <div className='DashBoard'>
        <div id='dashRow'>
          <div id='dashSectionL'>
            <p>Administrator</p>
              <div id='dashOptions'>
                <p>Options</p>
                <button id='dashOptionsButton' onClick={createAccount}>Create New Account</button>
                <button id='dashOptionsButton' onClick={updatePassword}>Update Password</button>
                <button id='dashOptionsButton' onClick={report}>Reports</button>
                <button id='dashOptionsButton' onClick={recipes}>Recipies</button>
                <button id='dashOptionsButtonLast' onClick={signOut}>Sign Out</button>
              </div>
          </div>
          <div id='dashSectionR'>
            <p>Database Statistics</p>
              <div id='dashStats'>
              <div id='dashStatsRow'>
                <p>Total Recipes: {Total}</p>
                <p>Approved Recipes: {approved}</p>
                <p>Pending Recipes: {pending}</p>
              </div>
              <div id='dashStatsReports'>
                <button id={'dashStatsReportsUpdate'}
                  onClick={update}
                >Update Statistics</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }
 else if(signedIn=='signedIn' && status=='create'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg" onSubmit={SubmitCreateForm}>
          <div className='inputHeader'>
            <p>SIGNUP FORM</p>
          </div> 
          <div className='inputCover'>
          <p>NEW USER NAME</p>
          <input
            type="text"
            value={newUserName}
            onChange={(name)=>{setNewUserName(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW PASSWORD</p>
          <input
            type="password"
            value={newPassword}
            onChange={(name)=>{setNewPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <input
            type="submit"
            value='Create'
          />
          </div>
        </form>
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
 else if(signedIn=='signedIn' && status=='update'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg" onSubmit={SubmitUpdateForm}>
          <div className='inputHeader'>
            <p>PASSWORD UPDATE FORM</p>
          </div> 
          <div className='inputCover'>
          <p>Old PASSWORD</p>
          <input
            type="text"
            value={oldPassword}
            onChange={(name)=>{setOldPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW PASSWORD</p>
          <input
            type="password"
            value={newPassword}
            onChange={(name)=>{setNewPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <input
            type="submit"
            value='Update'
          />
          </div>
        </form>
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
 else if(signedIn=='signedIn' && status=='report'){
    return(
      <div className='reportBox'>
        <p id='reportHeader'>Reports</p>
        <div id='reports'>
        {
          reports.map(function(report, idx) {
              return( 
                <div id="report">
                  <div>
                  <p id='name'>Name: {report.name}</p>
                  <p id='name'>Email: {report.email}</p>
                  <p id='problem'>{report.problem}</p>
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
      </div>
      );
  }
  else if(signedIn=='signedIn' && status=='recipes'){
    return(
      <div className='reportBox'>
        <p id='reportHeader'>Recipes</p>
        <div id='reports'>
        {
          urecipes.map(function(recipe, idx) {
              return( 
                <div id="recipe">
                  <div>
                  <img id="recipeImg" src={recipe.PicURL} alt="Recipe"/>
                  </div>
                  <div id="rinfo">
                  <p id='rname'>Name: {recipe.name}</p>
                  <p id='rname'>Web URL: {recipe.webURL}</p>
                  </div>
                  <div id="rbuttonBox">
                  <button
                  onClick={async()=>{
                    if(recipe.status=="pending"){
                    db.collection("userRecipes").doc(recipe.id).update({
                      status:"approved"
                    })
                    alert("Recipe Approved")
                    setStatus("None")
                  }
                    else{
                      db.collection("userRecipes").doc(recipe.id).delete();
                     alert("Recipe Deleted")
                    setStatus("None")
                    }
                  }}
                  id="rbutton">{recipe.status=="pending"?"Approve Recipe":"Delete"}</button>
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
      </div>
      );
  }
  else if(signedIn!='signedIn'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg">
          <div className='inputHeader'>
            <p>NOT SIGNED IN, PLEASE SIGN IN TO ACCESS DASHBOARD</p>
          </div> 
        </form>  
      </div>
    );
  }
}

export default Dashboard;
