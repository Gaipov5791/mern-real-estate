import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
    const [landlord, setLandlord] = useState(null);
    const [errorlandlord, setErrorLandlord] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                setErrorLandlord(error.message);
            }
        };
        fetchLandlord();

    }, [listing.userRef]);

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-4'>
                    <p>Contact <span className='font-semibold'>
                            {landlord.username}
                        </span> for <span className='font-semibold'>
                            {listing.name.toLowerCase()}
                        </span>
                    </p>
                    <textarea
                        onChange={onChange}
                        name="message" 
                        id="message" 
                        rows="2"
                        value={message}
                        placeholder='Enter your text'
                        className='w-full border p-3 rounded-lg'
                    ></textarea>
                    <Link 
                        to={`mailto:${landlord.email}?subject=Regarding 
                        ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center uppercase p-3 
                        rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}

export default Contact;