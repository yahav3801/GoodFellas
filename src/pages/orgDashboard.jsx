import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "@heroicons/react/solid";
import CreateEventPopup from "../components/CreateEventPopup";

const OrgDashboard = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchOrgData(token);
    }
  }, [navigate]);

  const fetchOrgData = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/org", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrgData(data.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching org data:", error);
      navigate("/login");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/org", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: orgData.name,
          email: orgData.email,
          phoneNumber: orgData.phoneNumber,
          address: orgData.address,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setOrgData(updatedData.data);
        setIsEditing(false);
      } else {
        console.error("Failed to update org data");
      }
    } catch (error) {
      console.error("Error updating org data:", error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...eventData, orgId: orgData._id }),
      });

      if (response.ok) {
        await fetchOrgData(token);
        setShowCreateEventPopup(false);
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/post", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orgId: orgData._id, postId }),
      });

      if (response.ok) {
        await fetchOrgData(token);
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateStatus = async (postId, subId, newStatus) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/emails/update-status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId, subId, newStatus }),
        }
      );

      if (response.ok) {
        await fetchOrgData(token);
      } else {
        console.error("Failed to update status and send email");
      }
    } catch (error) {
      console.error("Error updating status and sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!orgData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Image Section */}
      <div className="bg-[url(./assets/Background.jpg)] bg-cover bg-center h-64 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
          <div>
            <h1 className="text-4xl text-black font-bold">
              Organization Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 -mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Organization Profile
            </h2>
            {isEditing ? (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out"
                onClick={handleSave}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="flex items-center text-blue-500 hover:text-blue-600 transition duration-150 ease-in-out"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="h-5 w-5 mr-1" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-150 ease-in-out"
              type="text"
              placeholder="Organization Name"
              value={orgData.name}
              onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
              disabled={!isEditing}
            />
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-150 ease-in-out"
              type="email"
              placeholder="Email Address"
              value={orgData.email}
              onChange={(e) =>
                setOrgData({ ...orgData, email: e.target.value })
              }
              disabled={!isEditing}
            />
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-150 ease-in-out"
              type="tel"
              placeholder="Phone Number"
              value={orgData.phoneNumber}
              onChange={(e) =>
                setOrgData({ ...orgData, phoneNumber: e.target.value })
              }
              disabled={!isEditing}
            />
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-150 ease-in-out"
              type="text"
              placeholder="Address"
              value={orgData.address}
              onChange={(e) =>
                setOrgData({ ...orgData, address: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Events</h2>
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out"
            onClick={() => setShowCreateEventPopup(true)}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Create Event
          </button>
        </div>

        {orgData.posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-lg p-6 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={post.image || "https://picsum.photos/100"}
                  alt="Event"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <div className="flex flex-row">
                    {post.locations &&
                      post.locations.map((location, index) => (
                        <p key={index} className="text-gray-500">
                          {location}
                          {index + 1 === post.locations.length ? "" : " , "}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDeleteEvent(post._id)}
                  className="text-red-500 hover:text-red-600 transition duration-150 ease-in-out"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedEvent(
                      selectedEvent === post._id ? null : post._id
                    )
                  }
                  className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                >
                  {selectedEvent === post._id ? (
                    <ChevronUpIcon className="h-6 w-6" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {selectedEvent === post._id && (
              <div className="mt-6">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-gray-700">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Group</div>
                    <div>Status</div>
                  </div>
                  {post.subs.map((sub) => (
                    <div
                      key={sub._id}
                      className="grid grid-cols-6 gap-4 p-4 bg-white border-t border-gray-200"
                    >
                      <div>{sub.subName}</div>
                      <div>{sub.subEmail}</div>
                      <div>{sub.subPhone}</div>
                      <div>{sub.subGroupNum}</div>
                      <div>{sub.status}</div>
                      {/* <div className="flex space-x-2">
                        {sub.status === "Pending" && (
                          <>
                            <button
                              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-150 ease-in-out disabled:opacity-50"
                              onClick={() => handleUpdateStatus(post._id, sub._id, "Approved")}
                              disabled={isLoading}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-150 ease-in-out disabled:opacity-50"
                              onClick={() => handleUpdateStatus(post._id, sub._id, "Rejected")}
                              disabled={isLoading}
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCreateEventPopup && (
        <CreateEventPopup
          onClose={() => setShowCreateEventPopup(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default OrgDashboard;
