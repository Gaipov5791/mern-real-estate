import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
	const [formData, setFormData] = useState({});
	const {loading, error} = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch('/api/auth/signin', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(signInFailure(data.message));
				return;
			}
			dispatch(signInSuccess(data));
			navigate('/');
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};

	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-center text-3xl font-semibold m-7'>Sign In</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input 
					type="email" 
					placeholder='email' 
					className='border rounded-lg p-3 focus:outline-none'
					id='email'
					onChange={handleChange}
				/>
				<input 
					type="password" 
					placeholder='password' 
					className='border rounded-lg p-3 focus:outline-none'
					id='password'
					onChange={handleChange}
				/>
				<button disabled={loading} className='bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>
					{loading ? 'Loading' : 'Sign In'}
				</button>
				<OAuth/>
			</form>
			<div className='flex gap-4 mt-5'>
				<p>Dont have an account?</p>
				<Link to={'/sign-up'}>
					<span className='text-blue-700'>Sign Up</span>
				</Link>
			</div>
			<div>{error && <p className='text-red-700'>{error}</p>}</div>
		</div>
	)
}

export default SignIn;