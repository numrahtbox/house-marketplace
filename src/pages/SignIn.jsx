import {useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'

function SignIn() {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData] = useState({
    email : '',
    password : ''
  })
  const {email,password} = formData
  const onChange = (e) =>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id] : e.target.value,
    }))
  }
  const onSubmit = async(e) =>{
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentials = await signInWithEmailAndPassword(auth,email,password)
      if(userCredentials.user)
        navigate('/')
    } catch (error) {
      toast.error('Bad User Credentials!')
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
            <div className='signInBar'>
              <p className="signInText">Sign In</p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </button>

            </div>
          </form>
          <OAuth/>
          <Link to='/sign-up' className='registerLink'>
            Signup Instead
          </Link>
        </div>
      </>
    )
  }
  
  export default SignIn