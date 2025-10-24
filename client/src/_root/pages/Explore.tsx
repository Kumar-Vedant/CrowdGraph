

function Explore() {
  return (
    <div>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#110d1b] tracking-light text-[32px] font-bold leading-tight">Explore Communities</p>
                <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Discover and join communities that align with your interests and expertise.</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div
                    className="text-[#5f4c9a] flex border-none bg-[#eae7f3] items-center justify-center pl-4 rounded-l-lg border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search for communities"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#110d1b] focus:outline-0 focus:ring-0 border-none bg-[#eae7f3] focus:border-none h-full placeholder:text-[#5f4c9a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#eae7f3] pl-4 pr-2">
                <p className="text-[#110d1b] text-sm font-medium leading-normal">AI</p>
                <div className="text-[#110d1b]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#eae7f3] pl-4 pr-2">
                <p className="text-[#110d1b] text-sm font-medium leading-normal">Medicine</p>
                <div className="text-[#110d1b]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#eae7f3] pl-4 pr-2">
                <p className="text-[#110d1b] text-sm font-medium leading-normal">Climate</p>
                <div className="text-[#110d1b]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#eae7f3] pl-4 pr-2">
                <p className="text-[#110d1b] text-sm font-medium leading-normal">History</p>
                <div className="text-[#110d1b]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#eae7f3] pl-4 pr-2">
                <p className="text-[#110d1b] text-sm font-medium leading-normal">Technology</p>
                <div className="text-[#110d1b]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Communities</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_n_OM595_SQH9JBtJuQ0coS04yuG6dFGQ128rAlepCLSl5ZMij7JPGukZ2BCNBohuNE5-pbdFt0JpEfLMsKmwumWnc55ZBoT2SZQjbdRPCvydy53HllWmuRuc39FQX-WG_EDhzyD3hZ7a9Lz7_cd4HvTigCWP_GGf74p-EqSpjYYOAddlzX1yFt8nvlj0-Z8-CxJjIlGD55lQZL7GmHeaJMyTXWy3n_65FEupfF5j5nWVvQLttTQUchRSZrC2gtsQc4TJQMnyq78")' }}
                ></div>
                <div>
                  <p className="text-[#110d1b] text-base font-medium leading-normal">AI Research Collective</p>
                  <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Collaborate on cutting-edge AI research and projects.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYiGZptvPJGDetcqHbfGRBAJ04xROQW0_1E8Ie1TODovZd_udTmW5kVLRcG-yk43FrB-jRv4O5tEUeqGlB_kc7jtVp8m94FiRjlFeTOoU-cXsoWV20esWMYhNWm0-ZOVR2Ep40BdrhEnmrbSgQk4naBjDtlbo_N2Kg_ILDXX2krn4Fcd1HmOe0WADlk5u-uzm2HgVOOq5B31r7lQFMHmSEE66Jc2-IX4J-dHN6ocwlzMHvQ7LeWcRX6rPWlC4eZlVZ39_1d6zKsJw")' }}
                ></div>
                <div>
                  <p className="text-[#110d1b] text-base font-medium leading-normal">Healthcare Innovation Hub</p>
                  <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Drive innovation in healthcare through collaborative knowledge sharing.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAlIJG8zBmasF7uDfxv0k6FRi9awgxJSIvKP-ByRNYalgE3FDxG8KOoMfXYMxN1Jhkox1ocVgQUfNSGLrGHLltgX3-6GR67y_1FbGFjqJPjMh-_HxM_R1JeCH999BZU5EoHFOe1-q3_-Pgubx_UECJADaGevYI8QRnStZAszy7NLVzZVBUCZYgSZmauT6Z2GbnAdtYjENpnT5MgaRUD0otKDpR4ctuINYkz215Ih7U4bdYEWh4KnMi-0Gi2neBcNRK8uK8iFTMfVGg")' }}
                ></div>
                <div>
                  <p className="text-[#110d1b] text-base font-medium leading-normal">Climate Action Network</p>
                  <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Join forces to address climate change with data-driven insights.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbvypD3x0Mg_jgjpi0EA65lMiVOyJ5PNecLjViPYZT78re4bNK4RbVt-rnaXmzu6KFc0gtCiABDt8qKJNTtKIpqsi6_m-wULWSQeRtsZ2b4bVqZ-lDnbj7iJhTDdPUCmLjuB4Coa7d_mSDnixo7ZIrGlL0fTS7-FuDAZ_H8Q6AtwuVLtlm1DsEOhcs9Zaws3w85fQ4EvMdkEbccOTQ6eeZB-hWV5ZWT03HORq7MVeMW_6r-zDZsrLXS0Sz5f3BaJHDOSG0hFfcOto")' }}
                ></div>
                <div>
                  <p className="text-[#110d1b] text-base font-medium leading-normal">Historical Knowledge Society</p>
                  <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Explore and preserve historical knowledge through community-driven initiatives.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcF40-FC8YwS4C3lGNDUB9YcbLodmobB2DJ9v8bzxHAxnByX0TYoB-cinAfpNikppSbAcVrWbJBVtOGYOVtFe1eogrmpSCvU46sQc7pZKEVW0ocPQK7N31TD7JMTlXwtzW9ZPA8P8HHxL73rpsT8xmSjg7hpX0OztudcMf5ttLonZqacY_cUh90i-m1cdf_-8LC1Fa21-T9UXYMaEzHGJqirBhJlIAx898awrjYMBpsii49RlyndojKZbhf-Go4gF8Hz2e6IsSexQ")' }}
                ></div>
                <div>
                  <p className="text-[#110d1b] text-base font-medium leading-normal">Tech Pioneers Forum</p>
                  <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Shape the future of technology with a community of innovators.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <a href="#" className="flex size-10 items-center justify-center">
                <div className="text-[#110d1b]" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </div>
              </a>
              <a className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-[#110d1b] rounded-full bg-[#eae7f3]" href="#">1</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#110d1b] rounded-full" href="#">2</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#110d1b] rounded-full" href="#">3</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#110d1b] rounded-full" href="#">4</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#110d1b] rounded-full" href="#">5</a>
              <a href="#" className="flex size-10 items-center justify-center">
                <div className="text-[#110d1b]" data-icon="CaretRight" data-size="18px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Explore