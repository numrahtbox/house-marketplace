import {useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {setDoc,doc,serverTimestamp} from 'firebase/firestore' 
import {toast} from 'react-toastify'
import {db} from '../firebase.config'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'

function SignUp() {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData] = useState({
    name:'',
    email : '',
    password : ''
  })
  const {name,email,password} = formData
  const onChange = (e) =>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }
  const onSubmit = async (e) =>{
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredentials.user
      updateProfile(auth.currentUser,{
        displayName:name
      })
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.serverTimestamp = serverTimestamp()

      await setDoc(doc(db,'users',user.uid),formDataCopy)

      navigate('/')

    } catch (error) {
      toast.error('Sometthing went wrong with registration')
    }
  }

  const navigate = useNavigate()

    return (
      <>
        <div className='pageContainer'>
          <header>
            <p className='pageHeader'>Welcome Back!</p>
          </header>
          <form onSubmit={onSubmit}>
          <input 
            type='name'
            className='nameInput'
            placeholder='Name'
            id='name'
            value={name}
            onChange={onChange}
            />
            <input 
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input 
                type={showPassword ? 'text' : 'password'}
                className='passwordInput'
                placeholder='Password'
                id='password'
                onChange={onChange}
                value={password}/>
              <img src={visibilityIcon} className='showPassword' alt='show password' onClick={()=>setShowPassword((prevState)=>!prevState)}/>
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password?</Link>
            <div className='signUpBar'>
              <p className="signUpText">Sign Up</p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </button>

            </div>
          </form>
          <OAuth/>
          <Link to='/sign-in' className='registerLink'>
            Signin Instead
          </Link>
        </div>
      </>
    )
  }
  
  export default SignUp