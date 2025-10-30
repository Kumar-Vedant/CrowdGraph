import { Link } from "react-router-dom";
import type { Community } from "../../schema";
import { images } from "../../constants/images";

interface CommunityCardProps extends Community {
    imageUrl: string;
}

function CommunityCard({ id, title, description, createdAt, imageUrl }: CommunityCardProps) {
    return (
        <Link to={`/community/${id}`}>
            <div className="flex flex-col gap-3 pb-3">
                <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                ></div>
                <div>
                    <p className="text-[#110d1b] text-base font-medium leading-normal">{title}</p>
                    <p className="text-[#5f4c9a] text-sm font-normal leading-normal">{description}</p>
                </div>
            </div>
        </Link>
    )
}

function CommunityGrid({ communities }: { communities: Community[] }) {
  return (
    <div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,175px))] gap-3 p-4">
            {communities.map((community) => (
                <CommunityCard
                    key={community.id}
                    {...community}
                    imageUrl={images[Math.floor(Math.random() * images.length)]}
                />
            ))}
        </div>
    </div>
  )
}

export default CommunityGrid