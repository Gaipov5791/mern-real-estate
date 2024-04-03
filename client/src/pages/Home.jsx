import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ListingItem from '../components/ListingItem';

const Home = () => {
	const [offerListings, setOfferListings] = useState([]);
	const [saleListings, setSaleListings] = useState([]);
	const [rentListings, setRentListings] = useState([]);
	console.log(saleListings);
	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch('/api/listing/getListings?offer=true&limit=4');
				const data = await res.json();
				setOfferListings(data);
				fetchRentListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchRentListings = async () => {
			try {
				const res = await fetch('/api/listing/getListings?type=rent&limit=4');
				const data = await res.json();
				setRentListings(data);
				fetchSaleListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchSaleListings = async () => {
			try {
				const res = await fetch('/api/listing/getListings?type=sale&limit=4');
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchOfferListings();
	}, []);

    return (
		<>
			<div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
				<h1 className='text-slate-700 font-bold text-3xl lg:text-6xl' >
					Find your next <span className='text-slate-500'>perfect</span>
					<br />
					place with ease
				</h1>
				<div className='text-gray-400 text-xs sm:text-sm'>
					Bakyr Estate is the best place to find your
					perfect place to live.
					<br />
					We have a wide range of properties for you
					choose from.
				</div>
				<Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
					Let's get started...
				</Link>
			</div>
			<Swiper
				navigation={true} 
				modules={[Navigation]}
			>
				{
					offerListings && offerListings.length > 0 &&
					offerListings.map((listing) => (
						<SwiperSlide key={listing._id}>
							<div 
								className='h-[500px]'
								style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, 
								backgroundSize: 'cover'}}
								>
							</div>
						</SwiperSlide>
					))
				}
			</Swiper>
			<div className='max-w-6xl mx-auto flex flex-col p-3 gap-8 my-10'>
				{
					offerListings && offerListings.length > 0 && (
						<div>
							<div className='my-3'>
								<h2 className='text-2xl font-semibold text-slate-600'>
									Recent Offers
								</h2>
								<Link 
									className='text-sm text-blue-800 hover:underline' 
									to={'/search?offer=true'}
								>
									Show more offers
								</Link>
							</div>
							<div className='flex flex-wrap gap-4'>
								{
									offerListings.map((listing) => (
										<ListingItem listing={listing} key={listing._id}/>
									))
								}
							</div>
						</div>
					)
				}
				{
					rentListings && rentListings.length > 0 && (
						<div>
							<div className='my-3'>
								<h2 className='text-2xl font-semibold text-slate-600'>
									Recent places for rent
								</h2>
								<Link 
									className='text-sm text-blue-800 hover:underline' 
									to={'/search?type=rent'}
								>
									Show more places for rent
								</Link>
							</div>
							<div className='flex flex-wrap gap-4'>
								{
									offerListings.map((listing) => (
										<ListingItem listing={listing} key={listing._id}/>
									))
								}
							</div>
						</div>
					)
				}
				{
					saleListings && saleListings.length > 0 && (
						<div>
							<div className='my-3'>
								<h2 className='text-2xl font-semibold text-slate-600'>
									Recent places for sale
								</h2>
								<Link 
									className='text-sm text-blue-800 hover:underline' 
									to={'/search?type=sale'}
								>
									Show more places for sale
								</Link>
							</div>
							<div className='flex flex-wrap gap-4'>
								{
									offerListings.map((listing) => (
										<ListingItem listing={listing} key={listing._id}/>
									))
								}
							</div>
						</div>
					)
				}
			</div>
		</>
    )
	
}

export default Home;