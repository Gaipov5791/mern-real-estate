import {useSelector, useDispatch} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { 
	updateUserStart, 
	updateUserSuccess, 
	updateUserFailure, 
	deleteUserFailure, 
	deleteUserSuccess, 
	signOutUserFailure,
	signOutUserStart,
	signOutUserSuccess
} from '../redux/user/userSlice';

const Profile = () => {
	const {currentUser, loading, error} = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [file, setFile] = useState(undefined);
	const fileRef = useRef(null);
	const [imagePerc, setImagePerc] = useState(0);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [errorListings, setErrorListings] = useState(false);
	const [userListings, setUserListings] = useState([]);
	const [formData, setFormData] = useState({});
	
	console.log(file);
	console.log(imagePerc);
	console.log(formData);

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on('state_changed', (snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			setImagePerc(Math.round(progress))},
			(error) => {
				setImageUploadError(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref)
				.then((downloadUrl) => {
					setFormData({...formData, avatar: downloadUrl});
				});
			},
		);
	};

	const handleChange = (e) => {
		setFormData({...formData, [e.target.id]: e.target.value});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}
			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	const handleDeleteClick = async () => {
		try {
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE"
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSingOutClick = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch('/api/auth/signout');
			const data = await res.json();
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message));
				return;
			}
			dispatch(signOutUserSuccess(data));
		} catch (error) {
			dispatch(signOutUserFailure(error.message));
		}
	};

	const handleShowListings = async () => {
		try {
			setErrorListings(false);
			const res = await fetch(`/api/user/listings/${currentUser._id}`);
			const data = await res.json();
			if (data.success === false) {
				setErrorListings(true);
				return;
			}
			setUserListings(data);
			setErrorListings(false);
		} catch (error) {
			setErrorListings(true);
		}
	};

	const handleDeleteListing = async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}
			setUserListings((prev) => 
				prev.filter((listing) => listing._id !== listingId)
			);
		} catch (error) {
			console.log(error.message);
		}
	};
	// firebase storage
	// allow read;
	// allow write: if
	// request.resource.size < 2 * 1024 *1024 &&
	// request.resource.contentType.matches('image/.*')
	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input 
					onChange={(e) => setFile(e.target.files[0])}
					type="file" 
					ref={fileRef} 
					hidden 
					accept='image/*'
				/>
				<img 
					onClick={() =>fileRef.current.click()}
					className='w-24 h-24 rounded-full self-center 
					cursor-pointer object-cover mt-2' 
					src={formData.avatar || currentUser.avatar} 
					alt="profile" 
				/>
				<p className='text-sm self-center'>
					{imageUploadError ? (
						<span className='text-red-700'>Error image upload 
						(image must be less then 2 mb)</span>
					) : imagePerc > 0 && imagePerc < 100 ? (
						<span className='text-slate-700'>{`Uploading: ${imagePerc} %`}</span>
					) : imagePerc === 100 ? (
						<span className='text-green-700'>Image uploaded successfully!</span>
					) : ""}
				</p>
				<input 
					onChange={handleChange}
					defaultValue={currentUser.username}
					type="text" 
					placeholder='username'
					id='username'
					className='border p-3 rounded-lg focus:outline-none'
				/>
				<input 
					onChange={handleChange}
					defaultValue={currentUser.email}
					type="email" 
					placeholder='email'
					id='email'
					className='border p-3 rounded-lg focus:outline-none'
				/>
				<input
					onChange={handleChange}
					defaultValue={currentUser.password}
					type="password" 
					placeholder='password'
					id='password'
					className='border p-3 rounded-lg focus:outline-none'
				/>
				<button disabled={loading} className='bg-slate-700 text-white uppercase p-3 rounded-lg
				hover:opacity-95 disabled:opacity-80'>
					{loading ? "Loading..." : "Update"}
				</button>
				<Link 
					className='bg-green-700 text-white uppercase 
					p-3 rounded-lg text-center hover:opacity-95' 
					to='/create-listing'
				>
					Create Listing
				</Link>
			</form>
			<div className='flex justify-between mt-5'>
				<span 
					onClick={handleDeleteClick} 
					className='text-red-700 cursor-pointer'
				>
					Delete account
				</span>
				<span 
					onClick={handleSingOutClick} 
					className='text-red-700 cursor-pointer'
				>
					Sign out
				</span>
			</div>
			<p className='text-red-700 mt-3'>{error ? error : ""}</p>
			<p className='text-green-700 mt-3'>{updateSuccess ? "User is updated successfully!" : ""}</p>
			<button 
				onClick={handleShowListings} 
				className='text-green-700 w-full'
			>
				Show Listings
			</button>
			<p className='text-red-700 text-sm'>{errorListings ? "Error showing listing" : ""}</p>
			{userListings &&
			userListings.length > 0 &&
			<div className='flex flex-col gap-4'>
				<h1 className='text-center font-semibold mt-7 text-2xl'>Your Listings</h1>
				{userListings.map((listing) => (
				<div 
					key={listing._id}
					className='border rounded-lg p-3 flex justify-between 
					items-center gap-4'
				>
					<Link to={`/listing/${listing._id}`}>
						<img 
							src={listing.imageUrls[0]} 
							alt="listing cover" 
							className='w-16 h-16 object-contain'
						/>
					</Link>
					<Link 
						className='text-slate-700 font-semibold hover:underline 
						truncate flex-1' 
						to={`/listing/${listing._id}`}
					>
						<p>{listing.name}</p>
					</Link>
					<div className='flex flex-col items-center'>
						<button 
							onClick={() => handleDeleteListing(listing._id)}
							className='text-red-700 uppercase'>Delete</button>
						<Link to={`/update-listing/${listing._id}`}>
							<button className='text-green-700 uppercase'>Edit</button>
						</Link>
					</div>
				</div>
				))}
			</div>
			}
		</div>
	)
}

export default Profile;