import {
  HomeIcon,
  BarChart2Icon,
  SettingsIcon,
  MenuIcon,
  XIcon,
} from "lucide-react"
import clsx from "clsx";
import { AudioSelector, ProcessButton } from "./index"
import { useDashboard } from "../../context/DashboardContext";

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

  const handleMenuClick = () => {
    // Collapse sidebar only if it's expanded
    if (isExpanded) {
      toggleSidebar();
    }
  };

  const menuItems = [
    {
      id: "FilesUpload",
      label: "Files Upload",
      icon: "AiIcon",
      href: "/UploadFiles",
    },
  ];

  return (
    <aside
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

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((menu) => (
              <a
                key={menu.id}
                href={menu.href}
                onClick={handleMenuClick}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {menu.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}