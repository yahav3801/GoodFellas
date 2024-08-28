import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Submission state
  const [submissionData, setSubmissionData] = useState({
    subName: "",
    subEmail: "",
    subPhone: "",
    subGroupNum: "1-3",
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! How can I help you with this event?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/post/${postId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleSubmissionChange = (e) => {
    const { name, value } = e.target;
    setSubmissionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmissionSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          ...submissionData,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Submission successful:", result);
      setSubmissionData({
        subName: "",
        subEmail: "",
        subPhone: "",
        subGroupNum: "1-3",
      });
      alert("Submission successful! Please check your email for confirmation.");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  const handleChatSubmit = async () => {
    if (userInput.trim() === "") return;

    // Update chat messages with user input
    setChatMessages((prev) => [...prev, { text: userInput, sender: "user" }]);

    try {
      // Use GET request with query parameters
      const response = await fetch(
        `http://127.0.0.1:8000/api/ai?question=${encodeURIComponent(
          userInput
        )}&context=${encodeURIComponent(`${post.aiDesc}`)}`
      );

      const data = await response.json();

      if (response.ok) {
        setChatMessages((prev) => [
          ...prev,
          { text: data.response, sender: "bot" },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            text: "Something went wrong. Please try again later.",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
      setChatMessages((prev) => [
        ...prev,
        { text: "Failed to reach the server.", sender: "bot" },
      ]);
    } finally {
      setUserInput("");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading post details...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <p>
          The post you're looking for might not exist or there was an error
          fetching it.
        </p>
        <Link to="/" className="text-blue-500 hover:underline">
          Return to Home Page
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-8">
        <p>No post found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Return to Home Page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <img
          src={post.image || "https://via.placeholder.com/400x200"}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 mb-4">{post.content}</p>
        <div className="mb-4">
          <span className="font-semibold">Type:</span> {post.type}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Location:</span>{" "}
          {post.locations.join(", ")}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Submission Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Submit for This Event</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            name="subName"
            value={submissionData.subName}
            onChange={handleSubmissionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            name="subEmail"
            value={submissionData.subEmail}
            onChange={handleSubmissionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Phone</label>
          <input
            type="tel"
            name="subPhone"
            value={submissionData.subPhone}
            onChange={handleSubmissionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Group Size
          </label>
          <select
            name="subGroupNum"
            value={submissionData.subGroupNum}
            onChange={handleSubmissionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1-3">1-3 people</option>
            <option value="3-10">3-10 people</option>
            <option value="10+">10+ people</option>
          </select>
        </div>
        <button
          onClick={handleSubmissionSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </div>

      {/* Chatbot */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          Have Questions? Chat with Us!
        </h2>
        <div className="h-64 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-md">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleChatSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-r-md hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
