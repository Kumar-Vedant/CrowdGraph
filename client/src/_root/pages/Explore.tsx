import CommunityGrid from "../../components/shared/CommunityGrid"
import SearchBar from "../../components/shared/SearchBar"
import { communities } from '../../services/data'


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
            
            <SearchBar placeholder="Search for communities" onSearch={(query) => {
              console.log("Searching for:", query);
            }} />
            
            <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Communities</h2>
            
            <CommunityGrid communities={communities} />
          
          </div>
        </div>
    </div>
  )
}

export default Explore