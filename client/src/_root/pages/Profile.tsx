import React from 'react'

function Profile() {
  return (
    <div>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtXSN3t85yBLBq5hrfrVAbpLrlLfqPZo2qF32zH8nycJvV6kBcZ9qMFUXr23p7cJwRTFSKJjaF14iu4b7C39RXZ5wK6NotGccRWZWkmg06n9cpUITJE60LalBGxPKDrf14fDYnTyLVYA9PBwXzbPmEOGvY3uXs91Ip6fRGw_yzk_N4OdpN-yq8UdWsgLmFFSWmsMr9iP91A6_YbAcVPh6Na6Sdc3VQFnUecK0AS_S3_8Mi9Voh0mDPdUY5A9wgs0nRefq5fV1SoaQ")'
                    }}
                  ></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em]">Sophia Carter</p>
                    <p className="text-[#5f4c9a] text-base font-normal leading-normal">AI Enthusiast | Knowledge Graph Contributor</p>
                    <p className="text-[#5f4c9a] text-base font-normal leading-normal">Joined 2022</p>
                  </div>
                </div>
                <button
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto"
                >
                  <span className="truncate">Follow</span>
                </button>
              </div>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-[#d5cfe7] px-4 gap-8">
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#4913ec] text-[#110d1b] pb-[13px] pt-4" href="#">
                  <p className="text-[#110d1b] text-sm font-bold leading-normal tracking-[0.015em]">Overview</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5f4c9a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5f4c9a] text-sm font-bold leading-normal tracking-[0.015em]">Contributions</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5f4c9a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5f4c9a] text-sm font-bold leading-normal tracking-[0.015em]">Activity</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5f4c9a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5f4c9a] text-sm font-bold leading-normal tracking-[0.015em]">Settings</p>
                </a>
              </div>
            </div>
            <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Points and Badges</h2>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d5cfe7]">
                <p className="text-[#110d1b] text-base font-medium leading-normal">Total Points</p>
                <p className="text-[#110d1b] tracking-light text-2xl font-bold leading-tight">1,250</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d5cfe7]">
                <p className="text-[#110d1b] text-base font-medium leading-normal">Badges Earned</p>
                <p className="text-[#110d1b] tracking-light text-2xl font-bold leading-tight">15</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d5cfe7]">
                <p className="text-[#110d1b] text-base font-medium leading-normal">Community Role</p>
                <p className="text-[#110d1b] tracking-light text-2xl font-bold leading-tight">Contributor</p>
              </div>
            </div>
            <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Contribution History</h2>
            <div className="flex px-4 py-3">
              <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#eae7f3] p-1">
                <label
                  className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-[#f9f8fc] has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-[#110d1b] text-[#5f4c9a] text-sm font-medium leading-normal"
                >
                  <span className="truncate">Approved</span>
                  <input type="radio" name="bb65bc70-7421-4278-ad0e-e532d83350f3" className="invisible w-0" value="Approved" checked={true} />
                </label>
                <label
                  className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-[#f9f8fc] has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-[#110d1b] text-[#5f4c9a] text-sm font-medium leading-normal"
                >
                  <span className="truncate">Pending</span>
                  <input type="radio" name="bb65bc70-7421-4278-ad0e-e532d83350f3" className="invisible w-0" value="Pending" />
                </label>
              </div>
            </div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-lg border border-[#d5cfe7] bg-[#f9f8fc]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#f9f8fc]">
                      <th className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-120 px-4 py-3 text-left text-[#110d1b] w-[400px] text-sm font-medium leading-normal">
                        Contribution
                      </th>
                      <th className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-240 px-4 py-3 text-left text-[#110d1b] w-[400px] text-sm font-medium leading-normal">Date</th>
                      <th className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-360 px-4 py-3 text-left text-[#110d1b] w-60 text-sm font-medium leading-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#d5cfe7]">
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-120 h-[72px] px-4 py-2 w-[400px] text-[#110d1b] text-sm font-normal leading-normal">
                        Added new AI concept: Neural Networks
                      </td>
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5f4c9a] text-sm font-normal leading-normal">
                        2023-08-15
                      </td>
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal w-full"
                        >
                          <span className="truncate">Approved</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d5cfe7]">
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-120 h-[72px] px-4 py-2 w-[400px] text-[#110d1b] text-sm font-normal leading-normal">
                        Updated existing concept: Machine Learning Algorithms
                      </td>
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5f4c9a] text-sm font-normal leading-normal">
                        2023-07-22
                      </td>
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal w-full"
                        >
                          <span className="truncate">Approved</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d5cfe7]">
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-120 h-[72px] px-4 py-2 w-[400px] text-[#110d1b] text-sm font-normal leading-normal">
                        Reviewed contribution: Natural Language Processing
                      </td>
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5f4c9a] text-sm font-normal leading-normal">
                        2023-06-10
                      </td>
                      <td className="table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal w-full"
                        >
                          <span className="truncate">Approved</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* <style>
                          @container(max-width:120px){.table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-120{display: none;}}
                @container(max-width:240px){.table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-240{display: none;}}
                @container(max-width:360px){.table-0b5b4002-c2a0-460e-a602-8d1053b72362-column-360{display: none;}}
              </style> */}
            </div>
            <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Activity Timeline</h2>
            <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
              <div className="flex flex-col items-center gap-1 pt-3">
                <div className="text-[#110d1b]" data-icon="User" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                    ></path>
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#d5cfe7] h-2 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#110d1b] text-base font-medium leading-normal">Joined CrowdGraph</p>
                <p className="text-[#5f4c9a] text-base font-normal leading-normal">2022-01-15</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#d5cfe7] h-2"></div>
                <div className="text-[#110d1b]" data-icon="Plus" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#d5cfe7] h-2 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#110d1b] text-base font-medium leading-normal">Made first contribution</p>
                <p className="text-[#5f4c9a] text-base font-normal leading-normal">2022-03-20</p>
              </div>
              <div className="flex flex-col items-center gap-1 pb-3">
                <div className="w-[1.5px] bg-[#d5cfe7] h-2"></div>
                <div className="text-[#110d1b]" data-icon="Star" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#110d1b] text-base font-medium leading-normal">Reached 1000 points</p>
                <p className="text-[#5f4c9a] text-base font-normal leading-normal">2023-05-01</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Profile