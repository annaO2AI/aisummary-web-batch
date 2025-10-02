import axios from "axios"
import { API_ROUTES } from "../../constants/api"
import { fetchWithAuth } from "@/app/utils/axios"

type Props = {
  selectedAudio: string[] | null  // Changed to array
  setGraphData: (data: any) => void
  loading: boolean
  setLoading: (v: boolean) => void
  setProgress:(V:number) => void
}

export default function ProcessButton({
  selectedAudio,
  setGraphData,
  loading,
  setLoading,
  setProgress
}: Props) {
  const handleProcess = async () => {
    if (!selectedAudio || selectedAudio.length === 0) return    
    setLoading(true)
    try {
      const res = await axios.post(
        API_ROUTES.processCall,
        {
          filenames: selectedAudio,
          model_option: "AzureOpenAI",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              setProgress(percent)
            }
          },
        }
      )
      
      // console.log("Processing result:", data)
      setGraphData(res?.data)
    } catch (err) {
      console.error("Processing error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedAudio || selectedAudio.length === 0) return null

  const fileCount = selectedAudio.length
  const buttonText = loading 
    ? `Generating... (${fileCount} file${fileCount > 1 ? 's' : ''})` 
    : `Generate Report (${fileCount} file${fileCount > 1 ? 's' : ''})`

  return (
    <div className="flex justify-center mt-4 dashordmain-custom-stylewrap gap-0 flex-col">
       {selectedAudio.length > 1 && (
        <p className="text-sm text-gray-600 mt-2">
          Processing {selectedAudio.length} audio files
        </p>
      )}
      <button
        onClick={handleProcess}
        className="mt-1 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 dashordmain-custom-style"
        disabled={loading}
      >
        {buttonText}
      </button>
     
    </div>
  )
}