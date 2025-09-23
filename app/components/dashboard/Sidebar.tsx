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
import Link from "next/link"

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
      toggleSidebar()
    }
  }

  const menuItems = [
    {
      id: "FilesUpload",
      label: "Files Upload",
      icon: "AiIcon",
      href: "/UploadFiles",
    },
    {
      id: "AudioFilesUpload",
      label: "Audio Files Upload",
      icon: "AiIcon",
      href: "/audio-upload",
    },
    {
      id: "AgentDetails",
      label: "Agent Details",
      icon: "AiIcon",
      href: "/agent-details",
    },
  ]

  return (
    <aside
      className={clsx(
        "h-screen fixed top-0 left-0 bg-white border-r shadow transition-all duration-300 ease-in-out",
        isExpanded ? "w-[306px]" : "w-16"
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
        <div className="p-4 space-y-4 mt-6 border-t pt-4 batch-summary">
          <Link
            href="/"
            className=" flex gap-3 items-center block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
          >
            <span>
              <svg
                width="15"
                height="20"
                viewBox="0 0 15 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.5 12.6316C9.27862 12.6316 10.7142 11.221 10.7142 9.47371V3.1579C10.7142 1.41053 9.27862 0 7.5 0C5.72137 0 4.28571 1.41053 4.28571 3.1579V9.47371C4.28571 11.221 5.72137 12.6316 7.5 12.6316ZM6.42863 3.1579C6.42863 2.57895 6.91075 2.10527 7.5 2.10527C8.08925 2.10527 8.57137 2.57895 8.57137 3.1579V9.47371C8.57137 10.0632 8.1 10.5263 7.5 10.5263C6.91075 10.5263 6.42863 10.0526 6.42863 9.47371V3.1579ZM13.1786 9.47371H15C15 13.0631 12.0857 16.0316 8.57137 16.5474V20H6.42863V16.5474C2.91429 16.0316 0 13.0631 0 9.47371H1.82142C1.82142 12.6316 4.54286 14.8421 7.5 14.8421C10.4571 14.8421 13.1786 12.6316 13.1786 9.47371Z"
                  fill="#34334B"
                />
              </svg>
            </span>
            <span>Call Audio</span>
          </Link>
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
              <Link
                key={menu.id}
                href={menu.href}
                onClick={handleMenuClick}
                className="flex gap-3 items-center block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.19048 6C6.19048 3.79086 7.89606 2 10 2C12.1039 2 13.8095 3.79086 13.8095 6V7H14.7619C16.6029 7 18.0952 8.567 18.0952 10.5C18.0952 12.433 16.6029 14 14.7619 14H13.8095C13.2835 14 12.8571 14.4477 12.8571 15C12.8571 15.5523 13.2835 16 13.8095 16H14.7619C17.6549 16 20 13.5376 20 10.5C20 7.7793 18.1186 5.51997 15.6472 5.07824C15.225 2.20213 12.8574 0 10 0C7.14261 0 4.77506 2.20213 4.35272 5.07824C1.88144 5.51997 0 7.7793 0 10.5C0 13.5376 2.34517 16 5.2381 16H6.19048C6.71646 16 7.14286 15.5523 7.14286 15C7.14286 14.4477 6.71646 14 6.19048 14H5.2381C3.39714 14 1.90476 12.433 1.90476 10.5C1.90476 8.567 3.39714 7 5.2381 7H6.19048V6ZM13.5306 9.2929L10.6734 6.2929C10.3015 5.90237 9.69848 5.90237 9.32657 6.2929L6.46942 9.2929C6.09749 9.6834 6.09749 10.3166 6.46942 10.7071C6.84135 11.0976 7.44436 11.0976 7.8163 10.7071L9.04762 9.4142V15C9.04762 15.5523 9.474 16 10 16C10.526 16 10.9524 15.5523 10.9524 15V9.4142L12.1837 10.7071C12.5556 11.0976 13.1587 11.0976 13.5306 10.7071C13.9025 10.3166 13.9025 9.6834 13.5306 9.2929Z"
                      fill="#34334B"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {menu.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {!isExpanded && (
        <>
          <Link
            href="/"
            className="justify-center flex gap-3 items-center block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors mb-6 mt-12 h-[48px]"
          >
            <span>
              <svg
                width="15"
                height="20"
                viewBox="0 0 15 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.5 12.6316C9.27862 12.6316 10.7142 11.221 10.7142 9.47371V3.1579C10.7142 1.41053 9.27862 0 7.5 0C5.72137 0 4.28571 1.41053 4.28571 3.1579V9.47371C4.28571 11.221 5.72137 12.6316 7.5 12.6316ZM6.42863 3.1579C6.42863 2.57895 6.91075 2.10527 7.5 2.10527C8.08925 2.10527 8.57137 2.57895 8.57137 3.1579V9.47371C8.57137 10.0632 8.1 10.5263 7.5 10.5263C6.91075 10.5263 6.42863 10.0526 6.42863 9.47371V3.1579ZM13.1786 9.47371H15C15 13.0631 12.0857 16.0316 8.57137 16.5474V20H6.42863V16.5474C2.91429 16.0316 0 13.0631 0 9.47371H1.82142C1.82142 12.6316 4.54286 14.8421 7.5 14.8421C10.4571 14.8421 13.1786 12.6316 13.1786 9.47371Z"
                  fill="#34334B"
                />
              </svg>
            </span>
          </Link>
          <Link
            href="/audio-upload"
            className="justify-center flex gap-3 items-center block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors h-[48px]"
          >
            <span>
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.19048 6C6.19048 3.79086 7.89606 2 10 2C12.1039 2 13.8095 3.79086 13.8095 6V7H14.7619C16.6029 7 18.0952 8.567 18.0952 10.5C18.0952 12.433 16.6029 14 14.7619 14H13.8095C13.2835 14 12.8571 14.4477 12.8571 15C12.8571 15.5523 13.2835 16 13.8095 16H14.7619C17.6549 16 20 13.5376 20 10.5C20 7.7793 18.1186 5.51997 15.6472 5.07824C15.225 2.20213 12.8574 0 10 0C7.14261 0 4.77506 2.20213 4.35272 5.07824C1.88144 5.51997 0 7.7793 0 10.5C0 13.5376 2.34517 16 5.2381 16H6.19048C6.71646 16 7.14286 15.5523 7.14286 15C7.14286 14.4477 6.71646 14 6.19048 14H5.2381C3.39714 14 1.90476 12.433 1.90476 10.5C1.90476 8.567 3.39714 7 5.2381 7H6.19048V6ZM13.5306 9.2929L10.6734 6.2929C10.3015 5.90237 9.69848 5.90237 9.32657 6.2929L6.46942 9.2929C6.09749 9.6834 6.09749 10.3166 6.46942 10.7071C6.84135 11.0976 7.44436 11.0976 7.8163 10.7071L9.04762 9.4142V15C9.04762 15.5523 9.474 16 10 16C10.526 16 10.9524 15.5523 10.9524 15V9.4142L12.1837 10.7071C12.5556 11.0976 13.1587 11.0976 13.5306 10.7071C13.9025 10.3166 13.9025 9.6834 13.5306 9.2929Z"
                  fill="#34334B"
                />
              </svg>
            </span>
          </Link>
          <Link
            href="/agent-details"
            className="justify-center flex gap-3 items-center block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors h-[48px]"
          >
            <span>
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 2C11.6569 2 13 3.34315 13 5C13 6.65685 11.6569 8 10 8C8.34315 8 7 6.65685 7 5C7 3.34315 8.34315 2 10 2ZM9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5C11 5.55228 10.5523 6 10 6C9.44772 6 9 5.55228 9 5ZM4 8C2.89543 8 2 8.89543 2 10V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V10C18 8.89543 17.1046 8 16 8H13L11 6L9 8H7L5 6L4 8H2ZM5 9H15V14H5V9ZM6 10H14V13H6V10Z"
                  fill="#34334B"
                />
              </svg>
            </span>
          </Link>
        </>
      )}
    </aside>
  )
}
