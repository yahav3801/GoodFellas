import React from "react";
import backgroundImage from "../assets/background6.jpg";
import { useState } from "react";

const PostsPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [groupSum, setGroupSum] = useState("");
  const [orgImage, setOrgImage] = useState(null);
  const [error, setError] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumChange = (event) => {
    setPhoneNum(event.target.value);
  };

  const handleGroupSumChange = (event) => {
    setGroupSum(event.target.value);
  };

  const handleOrgImageChange = (event) => {
    setOrgImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !phoneNum || !groupSum || !orgImage) {
      setError("Please fill out all required fields");
      return;
    }

    // Handle form submission here

    console.log("Form data:", { name, email, phoneNum, groupSum, orgImage });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="bg-[#2F2F2F] rounded-lg p-4 shadow-sm w-3/4 md:w-1/2">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:ml-8 w-full md:w-1/2">
            <h2 className="text-white font-bold text-2xl">Title</h2>
            <p className="text-white">Organization Name</p>
            <p className="text-white">Type</p>
            <div className="flex justify-between">
              <p className="text-white">Date</p>
            </div>
            <p className="text-white">Location</p>
          </div>
          <label
            htmlFor="orgImage"
            className="w-full md:w-1/2 h-64 bg-cover bg-center rounded-lg cursor-pointer flex justify-center items-center"
            style={{
              backgroundImage: orgImage
                ? `url(${URL.createObjectURL(orgImage)})`
                : `url(${backgroundImage})`,
            }}
          >
            <div className="text-center text-black text-2xl font-bold">
              Choose a Photo
            </div>
            <input
              type="file"
              id="orgImage"
              name="orgImage"
              className="hidden"
              onChange={handleOrgImageChange}
            />
          </label>
        </div>
      </div>

      <div className="bg-[#2F2F2F] rounded-lg p-4 shadow-sm w-3/4 md:w-1/2 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
          <div>
            <label htmlFor="userName" className="block font-medium text-white">
              User Name
            </label>
            <input
              onChange={handleNameChange}
              type="text"
              id="userName"
              name="userName"
              className="w-full bg-[#4F4F4F] border-none rounded-md text-white p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-white">
              Email
            </label>
            <input
              onChange={handleEmailChange}
              type="email"
              id="email"
              name="email"
              className="w-full bg-[#4F4F4F] border-none rounded-md text-white p-2"
            />
          </div>

          <div>
            <label htmlFor="phoneNum" className="block font-medium text-white">
              Phone Number
            </label>
            <input
              onChange={handlePhoneNumChange}
              type="tel"
              id="phoneNum"
              name="phoneNum"
              className="w-full bg-[#4F4F4F] border-none rounded-md text-white p-2"
            />
          </div>

          <div>
            <label htmlFor="groupSum" className="block font-medium text-white">
              Group Summary
            </label>
            <select
              onChange={handleGroupSumChange}
              id="groupSum"
              name="groupSum"
              className="w-full bg-[#4F4F4F] border-none rounded-md text-white p-2"
            >
              <option value="">Select a group</option>
              <option value="group1">Group 1</option>
              <option value="group2">Group 2</option>
              <option value="group3">Group 3</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#4F4F4F] hover:bg-[#6F6F6F] text-white font-medium py-2 px-4 rounded col-span-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostsPage;
