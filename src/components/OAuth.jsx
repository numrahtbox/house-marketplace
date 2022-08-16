import {useNavigate,useLocation} from 'react-router-dom'
import {getAuth, signInWithPopup,GoogleAuthProvider } from 'firebase/auth'
import {doc,setDoc,getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()
    const onGoogleClick = async() => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth,provider)
            const user = result.user
            // check for user 
            const docRef = doc(db,'users',user.uid)
            const docSnap = await getDoc(docRef)

            // if user does not exist create new user 
            if(!docSnap.exists()){
                await setDoc(docRef,{
                    name:user.displayName,
                    email:user.email,
                    timeStamp:serverTimestamp()
                })
                navigate('/')
            }
            else{
                toast.warning('Already User Existed with this Email')
            }
            
        } catch (error) {
            toast.error('Could not authorize with Google')
        }

    }

  return (
    <div className='socialLogin'>
        <p>Sign {location.pathname === '/sign-in' ? 'in' :'up'} with </p>
        <button className='socialIconDiv' onClick={onGoogleClick}>
            <img src={googleIcon} className='socialIconImg' alt='google' />

        </button>

    </div>
  )
}

export default OAuth