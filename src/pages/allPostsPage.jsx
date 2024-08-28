import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

const AllPostsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/allposts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrganizations(data.data);

        // Extract unique types and locations
        const allTypes = new Set();
        const allLocations = new Set();
        data.data.forEach(org => {
          org.posts.forEach(post => {
            allTypes.add(post.type);
            post.locations.forEach(location => allLocations.add(location));
          });
        });
        setTypes(Array.from(allTypes));
        setLocations(Array.from(allLocations));
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredOrganizations = organizations.map(org => ({
    ...org,
    posts: org.posts.filter(post => 
      (selectedType === '' || post.type === selectedType) &&
      (selectedLocation === '' || post.locations.includes(selectedLocation)) &&
      (searchTerm === '' || post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(org => org.posts.length > 0);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Background section */}
      <div className="bg-[url(./assets/Background.jpg)] bg-cover bg-center p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-black font-bold mb-4">Who do you want to help?</h1>
          <p className="text-xl text-black">
            Find events where you can lend a hand and make a difference. Just sign up, show up, and help out!
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto -mt-8 bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <select
              className="appearance-none w-full md:w-[180px] bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiChevronDown />
            </div>
          </div>
          <div className="relative">
            <select
              className="appearance-none w-full md:w-[180px] bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiChevronDown />
            </div>
          </div>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {filteredOrganizations.map((org) =>
          org.posts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => handlePostClick(post._id)}
            >
              <img
                src={post.image || 'https://via.placeholder.com/400x200'}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {post.type.substring(0, 30)}
                </span>
                <h3 className="text-lg font-semibold mb-2">{post.content.substring(0, 60)}...</h3>
                <p className="text-sm text-gray-600">
                  {org.name} • {post.locations.join(', ')} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllPostsPage;