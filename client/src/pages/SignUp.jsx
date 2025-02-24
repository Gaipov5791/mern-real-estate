import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch('/api/auth/signup', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				setError(data.message);
				setLoading(false);
				return;
			}
			setLoading(false);
			setError(null);
			navigate('/sign-in');
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-center text-3xl font-semibold m-7'>Sign Up</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input 
					type="text" 
					placeholder='username' 
					className='border rounded-lg p-3 focus:outline-none'
					id='username'
					onChange={handleChange}
				/>
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
					{loading ? 'Loading' : 'Sign Up'}
				</button>
				<OAuth/>
			</form>
			<div className='flex gap-4 mt-5'>
				<p>Have an account?</p>
				<Link to={'/sign-in'}>
					<span className='text-blue-700'>Sign In</span>
				</Link>
			</div>
			<div>{error && <p className='text-red-700'>{error}</p>}</div>
		</div>
	)
}

export default SignUp;