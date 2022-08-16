import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
  const [listings,setListings] = useState(null)
  const [loading,setLoading] = useState(true)
  const [lastFetchedListings,setLastFetchedListings] = useState
    (null)
  const params = useParams()

useEffect(()=>{
    const fetchListings = async() =>{
        try {
            const listingsRef = collection(db,'listings')
            
            // create a query
            const q = query(
                listingsRef,
                where('type','==',params.categoryName),
                orderBy('timestamp','desc'),
                limit(1)
            )
            // execute query
            const querySnap = await getDocs(q)
            
            const lastVisible = querySnap.docs[querySnap.docs.length
                -1]
            setLastFetchedListings(lastVisible)
            
            

            const listings = []
            querySnap.forEach((doc)=>{
                console.log(doc.data())
                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            })

            setListings(listings)
            setLoading(false)

            
        } catch (error) {
            toast.error('Could not fecth Listings')
            
        }

    }
    fetchListings()
},[params.categoryName])
// Pagination / Load More
const onFetchMoreListings = async() =>{
    try {
        const listingsRef = collection(db,'listings')
        
        // create a query
        const q = query(
            listingsRef,
            where('type','==',params.categoryName),
            orderBy('timestamp','desc'),
            startAfter(lastFetchedListings),
            limit(10),
          
        )
        // execute query
        const querySnap = await getDocs(q)
        
        const lastVisible = querySnap.docs[querySnap.docs.length
            -1]
        setLastFetchedListings(lastVisible)
        
        

        const listings = []
        querySnap.forEach((doc)=>{
            console.log(doc.data())
            return listings.push({
                id:doc.id,
                data:doc.data()
            })
        })

        setListings((prevState) => [...prevState,...listings])
        setLoading(false)

        
    } catch (error) {
        toast.error('Could not fecth Listings')
        
    }

}

  return (
    <div className='category'>
        <header>
            <p className='pageHeader'>
                {params.categoryName === 'rent' ? 'Places for Rent' : 'Places for Sale'}
            </p>
        </header>
        {loading ? (
            <Spinner/>
        ) : listings && listings.length > 0 ? (
            <>
              <main>
                <ul className='categoryListings'>
                    {
                        listings.map((listing)=>(
                            <ListingItem listing={listing.data} id={listing.id}
                            key={listing.id}/>
                        ))
                    }

                </ul>
              </main>

              <br />
              <br />
              {lastFetchedListings && (
                <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
              )}
            </>
        ) : <h3>No Listings for {params.categoryName}</h3>


        }
    </div>
  )
}

export default Category