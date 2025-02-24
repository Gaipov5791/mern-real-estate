import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
  import Contact from '../components/Contact';

const Listing = () => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [contact, setContact] = useState(false);
    const [copied, setCopied] = useState(false);
    const params = useParams();
    const {currentUser} = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/getListing/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    return;
                }
                setListing(data);
                setError(false);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && 
                <p className='text-red-700 text-2xl text-center my-7'>
                    Loading...
                </p>
            }
            {error && 
                <p className='text-red-700 text-2xl text-center my-7'>
                    Something went wrong!
                </p>
            }
                {listing && !loading && !error && 
                (
                    <div>
                        <Swiper 
                            navigation={true} 
                            modules={[Navigation]}
                        >
                            {listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div
                                        className='h-[550px]'
                                        style={{
                                            background: `url(${url}) center no-repeat`,
                                            backgroundSize: 'cover'
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className='fixed top-[13%] right-[3%] z-10 rounded-full border bg-slate-100 
                            w-12 h-12 flex justify-center items-center cursor-pointer'>
                            <FaShare
                                className='text-slate-500'
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.href);
                                  setCopied(true);
                                  setTimeout(() => {
                                    setCopied(false);
                                  }, 2000);
                                }} 
                            />
                        </div>
                        {copied && (
                            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                                Link copied!
                            </p>
                        )}
                        <div className='flex flex-col p-3 max-w-4xl mx-auto my-7 gap-4'>
                            <p className='text-2xl font-semibold'>
                                {listing.name} - ${' '}
                                {listing.offer ?
                                    listing.discountPrice.toLocaleString('en-Us') :
                                    listing.regularPrice.toLocaleString('en-US')}
                                {listing.type === 'rent' && '/ month'}
                            </p>
                            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
                                <FaMapMarkerAlt className='text-green-700'/>
                                {listing.address}
                            </p>
                            <div className='flex gap-4'>
                                <p className='bg-red-900 w-full max-w-[200px] text-white 
                                text-center rounded-md p-1'>
                                    {listing.type === 'rent' ?
                                        'For rent' : 'For sale'
                                    }
                                </p>
                                {listing.offer && (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white 
                                    text-center rounded-md p-1'>
                                        ${+listing.regularPrice - +listing.discountPrice} OFF
                                    </p>
                                )}
                            </div>
                            <p className='text-slate-800'>
                                <span className='font-semibold text-black'>Description - </span>
                                {listing.description}
                            </p>
                            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaBed className='text-lg'/>
                                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaBath className='text-lg'/>
                                    {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaParking className='text-lg'/>
                                    {listing.parking ? 'Parking spot': 'No parking'}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaChair className='text-lg'/>
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                            </ul>
                            {currentUser && listing.userRef !== currentUser._id && !contact && 
                            (
                                <button 
                                    onClick={() => setContact(true)}
                                    className='bg-slate-700 text-white uppercase rounded-lg p-3 hover:opacity-50'
                                >
                                    Contact Landlord
                                </button>
                            )}
                            {contact && <Contact listing={listing}/>}
                        </div>
                    </div>
                )
                }
        </main>
    )
}

export default Listing;