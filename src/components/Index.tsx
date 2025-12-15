import { HomeIcon, Landmark, PartyPopper, UmbrellaIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function Index() {
	return (
		<div className="fixed top-4 right-4 px-1.5 py-1 bg-gray-100 rounded-full flex gap-1 z-10">
			<Link to="/leave-approval">
				<div className="text-lg font-medium w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200">
					<HomeIcon size={18} />
				</div>
			</Link>
			<Link to="/canvas">
				<div className="text-lg font-medium w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200">
					<Landmark size={18} />
				</div>
			</Link>
			<Link to="/canvas">
				<div className="text-lg font-medium w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200">
					<UmbrellaIcon size={18} />
				</div>
			</Link>
			<Link to="/canvas">
				<div className="text-lg font-medium w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200">
					<PartyPopper size={18} />
				</div>
			</Link>
		</div>
	)
}
