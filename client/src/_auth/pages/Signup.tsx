import React from 'react'

function Signup() {
  return (
    <div>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex justify-center flex-col w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#110d1b] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Sign up for CrowdGraph</h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">Email</p>
                <input
                  placeholder="Enter your email"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">Username</p>
                <input
                  placeholder="Choose a username"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">Password</p>
                <input
                  placeholder="Create a password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#110d1b] text-base font-medium leading-normal pb-2">Confirm Password</p>
                <input
                  placeholder="Confirm your password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border border-[#d5cfe7] bg-[#f9f8fc] focus:border-[#d5cfe7] h-14 placeholder:text-[#5f4c9a] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex px-4 py-3">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#4913ec] text-[#f9f8fc] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Sign Up</span>
              </button>
            </div>
            <p className="text-[#5f4c9a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Already have an account? <a href="/login">Log In</a></p>

          </div>
        </div>
    </div>
  )
}

export default Signup