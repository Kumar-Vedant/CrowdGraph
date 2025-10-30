import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import { CommunityFeed } from "@/components/shared/CommunityFeed";
import { searchCommunityById } from "@/services/api";
import { useApi } from "@/hooks/apiHook";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

function CommunityDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
      navigate("/login");
  }

  const { communityId } = useParams<{ communityId: string }>();

  const { data: communityData, loading, error, callApi } = useApi(searchCommunityById);
  
  useEffect(() => {
    if (communityId) {
      callApi(communityId);
    }
  }, [communityId, callApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }
  if (error) {
      return <div className="p-6">Community not found.</div>;
  }
  if (!communityData) {
      return <div className="p-6">Community not found.</div>;
  }
  
  else {
    return (
      <div>
          <div className="gap-1 px-6 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-[#110d1b] tracking-light text-[32px] font-bold leading-tight">{communityData.title}</p>
                  <p className="text-[#5f4c9a] text-sm font-normal">Owner: {communityData.owner.name} · Created at: {communityData.createdAt.toLocaleDateString()}</p>
                  <p className="text-[#5f4c9a] text-sm font-normal leading-normal">{communityData.members.length} members · Reputation: {communityData.reputation}</p>
                </div>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal"
                >
                  <span className="truncate">Add Node</span>
                </button>
              </div>
              <div className="@container flex flex-col h-full flex-1">
                <div className="flex flex-1 flex-col @[480px]:px-4 @[480px]:py-3">
                  <div
                    className="bg-contain bg-center flex min-h-[320px] flex-1 flex-col justify-between px-4 pb-4 pt-5 @[480px]:rounded-lg @[480px]:px-8 @[480px]:pb-6 @[480px]:pt-8"
                    style={{ backgroundImage: 'url("https://i0.wp.com/nightingaledvs.com/wp-content/uploads/2022/04/Figure6.png?resize=720%2C427&ssl=1")' }}
                  >
  
                    <SearchBar placeholder="Search Query" onSearch={(query) => {
                      console.log("Searching for:", query);
                    }} />
  
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex flex-col gap-0.5">
                        <button className="flex size-10 items-center justify-center rounded-t-lg bg-[#f9f8fc] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                          <div className="text-[#110d1b]" data-icon="Plus" data-size="24px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                            </svg>
                          </div>
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-b-lg bg-[#f9f8fc] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                          <div className="text-[#110d1b]" data-icon="Minus" data-size="24px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
  
              {/* Community Feed to show user posts */}
              <div>
                  <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Community Feed</h2>
                  <CommunityFeed communityId={communityId!} />
              </div>
            </div>
            <div className="layout-content-container flex flex-col w-[360px]">
              <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">AI Suggestions</h2>
              <div className="p-4">
                <div className="flex items-stretch justify-between gap-4 rounded-lg">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#5f4c9a] text-sm font-normal leading-normal">Suggested Link</p>
                      <p className="text-[#110d1b] text-base font-bold leading-tight">Node A to Node B</p>
                      <p className="text-[#5f4c9a] text-sm font-normal leading-normal">AI suggests a link between Node A and Node B based on recent community contributions.</p>
                    </div>
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal w-fit"
                    >
                      <span className="truncate">Add Link</span>
                    </button>
                  </div>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPOwhDl4Ep7zGKthwqCHYe0EsEVhwBK9S2sS5RndYROMqMGoJQs7uTZSKfgJd8-euMEW5ameez90069ePXvQilUbiBjSFQiGzGRvmgXbNs3qR5ue_OlR7e8F2amvRQKeTU5hM8VWEtN07qn5VHF3V3S-x_qlhkS1sxDiFp9ZiOj8fNH-eEOBZuhfQEuxNt1JClR_CK7BTLnk7NxG24CfKSrouj7AsWBHOlSOvf_k9or3aabWN4WhPDm_wvEEcCr3493Nt_neF9APQ")' }}
                  ></div>
                </div>
              </div>
              <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Contribution Queue</h2>
              <div className="flex items-center gap-4 bg-[#f9f8fc] px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[#110d1b] flex items-center justify-center rounded-lg bg-[#eae7f3] shrink-0 size-12" data-icon="Link" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#110d1b] text-base font-medium leading-normal line-clamp-1">Add Link: Node C to Node D</p>
                    <p className="text-[#5f4c9a] text-sm font-normal leading-normal line-clamp-2">Submitted by Alex</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal w-fit"
                  >
                    <span className="truncate">Review</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#f9f8fc] px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="text-[#110d1b] flex items-center justify-center rounded-lg bg-[#eae7f3] shrink-0 size-12"
                    data-icon="PencilSimple"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#110d1b] text-base font-medium leading-normal line-clamp-1">Edit Node E</p>
                    <p className="text-[#5f4c9a] text-sm font-normal leading-normal line-clamp-2">Submitted by Sarah</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#eae7f3] text-[#110d1b] text-sm font-medium leading-normal w-fit"
                  >
                    <span className="truncate">Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default CommunityDashboard