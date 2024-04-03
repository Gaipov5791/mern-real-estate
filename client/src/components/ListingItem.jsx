import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ListingItem = ({listing}) => {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow 
        overflow-hidden rounded-lg w-full sm:w-[330px]'>
            <Link to={`listing/${listing._id}`}>
                <img 
                    src={listing.imageUrls[0]} 
                    alt="listing cover" 
                    className='h-[320px] sm:h-[220px] w-full object-cover
                    hover:scale-105 transition-scale duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className='text-slate-700 font-semibold text-lg truncate'>
                        {listing.name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <FaMapMarkerAlt className='w-4 h-4 text-green-700'/>
                        <p className='text-sm text-gray-600 truncate'>{listing.address}</p>
                    </div>
                    <p className='text-gray-600 text-sm line-clamp-2'>{listing.description}</p>
                    <p className='text-slate-500 mt-2 font-semibold'>
                        $ {listing.offer ? 
                        listing.discountPrice.toLocaleString('en-Us')  : 
                        listing.regularPrice.toLocaleString('en-Us') }
                        {listing.type === 'rent' && '/ month'}
                    </p>
                    <div className='flex gap-4 text-slate-700'>
                        <div className='text-xs font-bold'>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        <div className='text-xs font-bold'>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ListingItem;