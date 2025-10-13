"use client"
import { useEffect, useState } from "react"
import { API_ROUTES } from "../../constants/api"
import AudioPlayer from "./AudioPlayer"
import { fetchWithAuth } from "../../utils/axios"

type Props = {
  selectedAudio: string | null
  setSelectedAudio: (filename: string) => void
  clearGraphData: () => void
}

export default function AudioSelector({
  selectedAudio,
  setSelectedAudio,
  clearGraphData,
}: Props) {
  const [audioMap, setAudioMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [fetchingAudio, setFetchingAudio] = useState(false)

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const res = await fetchWithAuth(API_ROUTES.audioFiles)
        const data = await res.json()
        setAudioMap(data)
      } catch (err) {
        console.error("Failed to load audio files:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAudioFiles()
  }, [])

  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (!selectedAudio) {
        setAudioUrl("")
        return
      }

      setFetchingAudio(true)
      try {
        const response = await fetch(
          `https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/audio/${selectedAudio}`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json'
            }
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setAudioUrl(data.url)
      } catch (err) {
        console.error("Failed to fetch audio URL:", err)
        setAudioUrl("")
      } finally {
        setFetchingAudio(false)
      }
    }

    fetchAudioUrl()
  }, [selectedAudio])

  return (
    <>
      {loading ? (
        <p>Loading audio files...</p>
      ) : (
        <div className="relative">
          <select
            className="w-full h-[45px] appearance-none px-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSelectedAudio(e.target.value)
              clearGraphData()
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select an audio file
            </option>
            {Object.keys(audioMap).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.10378 1.09419L5.82044 6.00739L10.5371 1.09419" stroke="#34334B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
      <div className="dashbord-miannot">
        {fetchingAudio && <p>Loading audio...</p>}
        {selectedAudio && audioUrl && !fetchingAudio && <AudioPlayer src={audioUrl} />}
      </div>
    </>
  )
}