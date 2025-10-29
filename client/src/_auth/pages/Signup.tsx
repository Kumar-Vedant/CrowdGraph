import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Signup successful:", data);
        navigate("/login"); // 🔁 Redirect to login page
      } else {
        const err = await res.json();
        alert(`Signup failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div>
      <div className="px-40 flex flex-1 justify-center py-5">
        <form
          onSubmit={handleSubmit}
          className="layout-content-container flex justify-center items-center flex-col w-[512px] py-5 max-w-[960px] flex-1"
        >
          <h2 className="text-[#110d1b] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Sign up for CrowdGraph
          </h2>

          {/* Email */}
          <div className="flex w-2/3 flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">
                Email
              </p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          {/* Username */}
          <div className="flex w-2/3 flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">
                Username
              </p>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          {/* Password */}
          <div className="flex w-2/3 flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">
                Password
              </p>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          {/* Confirm Password */}
          <div className="flex w-2/3 flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">
                Confirm Password
              </p>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex px-4 py-3">
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#4913ec] text-[#f9f8fc] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Sign Up</span>
            </button>
          </div>

          <p className="text-[#5f4c9a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#4913ec]">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
