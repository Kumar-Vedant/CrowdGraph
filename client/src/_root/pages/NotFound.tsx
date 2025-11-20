import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h1 className="text-foreground tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">Oops! The page you're looking for doesn't exist.</h1>
            <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              We couldn't find the page you requested. It might have been moved or deleted.
            </p>
            <div className="flex justify-center">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                <Link to="/">
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
                  >
                    <span className="truncate">Go to Home</span>
                  </button>
                </Link>
                <Link to="/communities">
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-muted text-foreground text-sm font-bold leading-normal tracking-[0.015em] grow"
                  >
                    <span className="truncate">Explore Communities</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default NotFound



