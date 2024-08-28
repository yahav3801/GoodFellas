import React, { useState } from 'react';

const CreateEventPopup = ({ onClose, onCreateEvent }) => {
  const [eventData, setEventData] = useState({
    title: '',
    content: '',
    type: '',
    image: '',
    locations: [''],
    aiDesc: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleLocationChange = (e, index) => {
    const newLocations = [...eventData.locations];
    newLocations[index] = e.target.value;
    setEventData({ ...eventData, locations: newLocations });
  };

  const addLocation = () => {
    setEventData({ ...eventData, locations: [...eventData.locations, ''] });
  };

  const removeLocation = (index) => {
    const newLocations = eventData.locations.filter((_, i) => i !== index);
    setEventData({ ...eventData, locations: newLocations });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateEvent(eventData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={eventData.content}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={eventData.type}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={eventData.image}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aiDesc">
              AI Description
            </label>
            <textarea
              id="aiDesc"
              name="aiDesc"
              value={eventData.aiDesc}
              onChange={handleInputChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Locations
            </label>
            {eventData.locations.map((location, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => handleLocationChange(e, index)}
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2 transition duration-200"
            >
              Add Location
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPopup;