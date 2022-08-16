import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs,query, orderBy,limit } from 'firebase/firestore'
import {db} from '../firebase.config'
import Spinner from './Spinner'

//Slider
import SwiperCore,{Navigation, Pagination, Scrollbar,A11y} from 'swiper'
import {Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle'

SwiperCore.use([Navigation, Pagination, Scrollbar,A11y])

function Slider() {
    const [loading,setLoading] = useState(true)
    const [listings,setListings] = useState(null)

    const naviagte = useNavigate()

    useEffect(()=>{

        const fetchListings = async () =>{
            const listingRef = collection(db,'listings')
            const q = query(listingRef,orderBy('timestamp','desc'),
            limit(5))
            const querySnap = await getDocs(q)
            let listings = []
    
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
    
        }
      
        fetchListings()
       
    },[])
    if(loading){
        return <Spinner/>
    }
  return listings && (
    <>
    <p className="exploreHeading">Recommended</p>
      <Swiper 
         slidesPerView={1}
         pagination={{clickable:true}} >
               {listings.map((data,id) => (
                    <SwiperSlide key={id} onClick={() => naviagte(
                        `/category/${data.data.type}/${data.id}`)}>
                
                        <div 
                            style={{
                                background: `url(${data.data.imageUrls[0]})
                                center no-repeat`,
                                backgroundSize: 'cover',
                            }}
                            className='swiperSlideDiv'>
                                <p className="swiperSlideText">{data.data.name}</p>
                                <p className="swiperSlidePrice">
                                    ${data.data.discountedPrice ?? data.data.regularPrice}{''}
                                    {data.data.type === 'rent' && '/ month'}
                                </p>


                        </div>
                        
                    </SwiperSlide>
                ))}
       
    </Swiper> 

    </>
  )
}

export default Slider

