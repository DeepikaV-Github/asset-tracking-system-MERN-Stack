// 
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser  } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiResponse, setApiResponse] = useState(null); // State to hold API response
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    // Retrieve the API response from local storage
    // const storedApiResponse = localStorage.getItem('apiResponse');
    const fetchApiResponse = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        console.log(email) // Retrieve the email from local storage
        if (!email) {
          console.error('No email found in local storage');
          return;
        }

        const response = await fetch('/api/external/fetch-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email }), // Use the email as username
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data from external API');
        }

        const data = await response.json();
        console.log(data)
        setApiResponse(data); // Store the API response in state
      } catch (error) {
        console.error('Error fetching API response:', error);
      }
    };

    fetchApiResponse();
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-blue-900'>Conneqtion</span>
            <span className='text-blue-400'>Group</span>
          </h1>
        </Link>
        
        {/* Search Form */}
        {/* Uncomment if you want to enable search functionality */}
        {/* <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form> */}

        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-blue-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-blue-700 hover:underline'>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser  ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser .avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-blue-700 hover:underline'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>

      {/* Display API Response */}
      {apiResponse && (
        <div className='bg-blue-100 p-4 text-blue-800 text-center'>
          
          <p>{JSON.stringify(apiResponse)}</p> {/* Display the response */}
        </div>
      )}
    </header>
  );
}