import {
  HomeIcon,
  BarChart2Icon,
  SettingsIcon,
  MenuIcon,
  XIcon,
} from "lucide-react"
import clsx from "clsx"
import { AudioSelector, ProcessButton } from "./index"
import { useDashboard } from "../../context/DashboardContext"

const navItems = [
  { label: "Home", icon: HomeIcon, href: "#" },
  { label: "Reports", icon: BarChart2Icon, href: "#" },
  { label: "Settings", icon: SettingsIcon, href: "#" },
]

type SidebarProps = {
  collapsed: boolean
  hovered: boolean
  toggleSidebar: () => void
  setHovered: (hovered: boolean) => void
}

export default function Sidebar({
  collapsed,
  hovered,
  toggleSidebar,
  setHovered,
}: SidebarProps) {
  const {
    selectedAudio,
    setSelectedAudio,
    graphData,
    setGraphData,
    loading,
    setLoading,
  } = useDashboard()

  const isExpanded = !collapsed 

  return (
    <aside
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
      className={clsx(
        "h-screen fixed top-0 left-0 bg-white border-r shadow transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex justify-end p-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 mt-6 border-t pt-4">
          <AudioSelector
            selectedAudio={selectedAudio}
            setSelectedAudio={setSelectedAudio}
            clearGraphData={() => setGraphData([])}
          />

          <ProcessButton
            selectedAudio={selectedAudio}
            setGraphData={setGraphData}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </aside>
  )
}
