import {useEffect,useState} from 'react'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(true)
    const [lastFetchedListings,setLastFetchedListings] = useState
    (null)
  
    useEffect(()=>{
        const fetchListings = async() =>{
            try {
                const listingsRef = collection(db,'listings')
                
                // create a query
                const q = query(
                    listingsRef,
                    where('offer','==',true),
                    orderBy('timestamp','desc'),
                    limit(1)
                )
                // execute query
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length-1]
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
        // eslint-disable-next-line
    },[])

    // Pagination / Load More
const onFetchMoreListings = async() =>{
    try {
        const listingsRef = collection(db,'listings')
        
        // create a query
        const q = query(
            listingsRef,
            where('offer','==',true),
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
                Offers
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
        ) : <h3>There are no current Offers</h3>
        }
    </div>
  )
}

export default Offers