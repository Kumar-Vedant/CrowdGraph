import { Link } from 'react-router'
import CommunityGrid from '../../components/shared/CommunityGrid'
import type { Community } from '@/schema';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/apiHook';
import { getFeaturedCommunities } from '@/services/api';

function landing() {
  const { data: featuredCommunities, loading: loadingFeatured, callApi: callFeaturedCommunities } = useApi(getFeaturedCommunities);
  const [communitiesToShow, setCommunitiesToShow] = useState<Community[]>([]);

  // Load featured communities on mount
  useEffect(() => {
    callFeaturedCommunities();
  }, [callFeaturedCommunities]);

  useEffect(() => {
    if (featuredCommunities) {
      setCommunitiesToShow(featuredCommunities);
    }
  }, [featuredCommunities]);

  return (
    <>
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[320px] sm:min-h-[400px] md:min-h-[480px] flex-col gap-4 sm:gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-6 sm:p-8"
                  style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmLWitLro9Izt7Zp-y_b1tOIy2IEtjXBcugGxGza7i4Kxq77lnfWl1KS6PdpT097eBIlIOygS2wB5Ws2shj4YF36_wBW7maoTNl9zKkiUP0amPX3_u7z1k3HI5-cQEG1aVSgHmI6jYlNwNAh-hFHIowjTtE8Le2QjMFoDaaelIrydnfCNjuc6KDa1-9fT37DtkcizV510GSrfkioUo-MkkhMki_18NKifV8o56ytK_pKLhAOBHIjsTOcrnUib30_RCr_pV5W0FFNk")' }}
                >
                  <div className="flex flex-col gap-2 text-center px-4">
                    <h1
                      className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      Human-Centered Crowdsourcing for AI-Assisted Knowledge Graphs
                    </h1>
                    <h2 className="text-white text-xs sm:text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      CrowdGraph is a collaborative web platform that combines crowdsourcing and AI to help communities build structured knowledge graphs.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex justify-center px-4">
                    <Link to='/Communities'>
                      <button
                        className="flex min-w-[84px] w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                      >
                        <span className="truncate">Explore Communities</span>
                      </button>
                    </Link>
                    <Link to='/signup'>
                      <button
                        className="flex min-w-[84px] w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-muted text-foreground text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                      >
                        <span className="truncate">Start Contributing</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-foreground text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Communities</h2>
            
            <CommunityGrid communities={communitiesToShow.slice(0, 5)} />
            
            <h2 className="text-foreground text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Hybrid AI + Human Validation Model</h2>
            <p className="text-foreground text-sm sm:text-base font-normal leading-normal pb-3 pt-1 px-4">
              Our platform combines the power of AI with human expertise to ensure the accuracy and reliability of knowledge graphs. AI algorithms suggest potential relationships,
              while community members validate and refine these suggestions, creating a robust and trustworthy knowledge base.
            </p>
            <h2 className="text-foreground text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Testimonials &amp; Stats</h2>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 sm:p-6 border border-border">
                <p className="text-foreground text-sm sm:text-base font-medium leading-normal">Active Communities</p>
                <p className="text-foreground tracking-light text-xl sm:text-2xl font-bold leading-tight">10+</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 sm:p-6 border border-border">
                <p className="text-foreground text-sm sm:text-base font-medium leading-normal">Validated Relations</p>
                <p className="text-foreground tracking-light text-xl sm:text-2xl font-bold leading-tight">Thousands</p>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-foreground tracking-light text-2xl sm:text-[28px] md:text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                >
                  Features
                </h1>
                <p className="text-foreground text-sm sm:text-base font-normal leading-normal max-w-[720px]">
                  CrowdGraph offers a range of features to support collaborative knowledge graph construction.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-border bg-muted p-4 flex-col">
                  <div className="text-foreground" data-icon="Users" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-foreground text-base font-bold leading-tight">User-Friendly Interface</h2>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">Intuitive tools for creating, editing, and validating knowledge graph elements.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-border bg-muted p-4 flex-col">
                  <div className="text-foreground" data-icon="UsersThree" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-foreground text-base font-bold leading-tight">Community Collaboration</h2>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">Features for communication, discussion, and collective decision-making within communities.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-border bg-muted p-4 flex-col">
                  <div className="text-foreground" data-icon="PersonArmsSpread" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56ZM231.5,87.71A19.62,19.62,0,0,0,212,72H44a20,20,0,0,0-8.38,38.16l.13,0,50.75,22.35-21,79.72A20,20,0,0,0,102,228.8l26-44.87,26,44.87a20,20,0,0,0,36.4-16.52l-21-79.72,50.75-22.35.13,0A19.64,19.64,0,0,0,231.5,87.71Zm-17.8,7.9-56.93,25.06a8,8,0,0,0-4.51,9.36L175.13,217a7,7,0,0,0,.49,1.35,4,4,0,0,1-5,5.45,4,4,0,0,1-2.25-2.07,6.31,6.31,0,0,0-.34-.63L134.92,164a8,8,0,0,0-13.84,0L88,221.05a6.31,6.31,0,0,0-.34.63,4,4,0,0,1-2.25,2.07,4,4,0,0,1-5-5.45,7,7,0,0,0,.49-1.35L103.74,130a8,8,0,0,0-4.51-9.36L42.3,95.61A4,4,0,0,1,44,88H212a4,4,0,0,1,1.73,7.61Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-foreground text-base font-bold leading-tight">Accessibility</h2>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">Designed with accessibility in mind, ensuring usability for all members.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center items-center">
                  <h1
                    className="text-foreground tracking-light text-2xl sm:text-[28px] md:text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                  >
                    Join the CrowdGraph Community
                  </h1>
                  <p className="text-foreground text-sm sm:text-base font-normal leading-normal max-w-[720px]">Start building knowledge graphs that matter.</p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center w-full sm:w-auto">
                    <Link to='/signup' className="w-full sm:w-auto">
                      <button
                        className="flex min-w-[84px] w-full sm:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow"
                      >
                        <span className="truncate">Get Started</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <p className="text-muted-foreground text-sm sm:text-base font-normal leading-normal">@2024 CrowdGraph. All rights reserved.</p>
            </footer>
          </div>
        </footer>
    </>
  )
}

export default landing



