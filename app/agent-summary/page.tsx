"use client"
import { useCallback, useEffect, useMemo, useState } from "react"

interface Agent {
  agent_id: number
  agent_name: string
  total_calls: number
  avg_agent_rating: number
  avg_sentiment_rating: number
  avg_duration_seconds: number
  total_anomalies: number
  detected_audiofiles: string[]
}

function formatForApi(datetimeLocalValue: string): string {
  // input like "2025-09-26T15:45" or "2025-09-26T15:45:12"
  if (!datetimeLocalValue) return ""
  const normalized = datetimeLocalValue.replace("T", " ")
  // Ensure seconds present
  return /:\d{2}$/.test(normalized) ? normalized : `${normalized}:00`
}

export default function AgentSummaryPage() {
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showFilters, setShowFilters] = useState<boolean>(true)

  const canFetch = useMemo(() => Boolean(start && end), [start, end])

  const fetchAgents = useCallback(async () => {
    if (!canFetch) return
    setLoading(true)
    try {
      const startParam = encodeURIComponent(formatForApi(start))
      const endParam = encodeURIComponent(formatForApi(end))
      const url = `https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/agent_statistics?start_datetime=${startParam}&end_datetime=${endParam}`
      const response = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" })
      if (!response.ok) {
        setAgents([])
        return
      }
      const data: Agent[] = await response.json()
      const list = Array.isArray(data) ? data : []
      setAgents(list)
      if (list.length >= 0) {
        setShowFilters(false)
      }
    } catch (e) {
      setAgents([])
    } finally {
      setLoading(false)
    }
  }, [start, end, canFetch])

  // Auto-fetch when both inputs are provided
  useEffect(() => {
    if (canFetch) {
      fetchAgents()
    }
  }, [canFetch, fetchAgents])

  return (
    <div className="ot-min-h-screen w-full pt-16">
      <div className="max-w-6xl mx-auto">
        {showFilters && (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Start datetime</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">End datetime</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <div>
              <button
                onClick={fetchAgents}
                disabled={!canFetch || loading}
                className={`px-4 py-2 rounded text-white ${!canFetch || loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Loading..." : "Fetch Summary"}
              </button>
            </div>
          </div>
        )}
        {!showFilters && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={() => setShowFilters(true)}
              className="px-3 py-2 text-blue-600 hover:text-blue-800"
            >
              Change Filters
            </button>
          </div>
        )}

        {!showFilters && agents.length > 0 && (
          <div className="overflow-x-auto w-[100%] mt-2">
            <table className="bg-white border border-gray-200 min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Agent Name</th>
                  <th className="py-2 px-4 border-b text-left">Total Number of Calls</th>
                  <th className="py-2 px-4 border-b text-left">Average Call Sentiment</th>
                  <th className="py-2 px-4 border-b text-left">Average Rating of Agent</th>
                  <th className="py-2 px-4 border-b text-left">Average Duration (s)</th>
                  <th className="py-2 px-4 border-b text-left">Anomalies Detected</th>
                  <th className="py-2 px-4 border-b text-left">Detected Files</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.agent_id}>
                    <td className="py-2 px-4 border-b">{agent.agent_name}</td>
                    <td className="py-2 px-4 border-b">{agent.total_calls}</td>
                    <td className="py-2 px-4 border-b">
                      {Number.isInteger(agent.avg_sentiment_rating)
                        ? agent.avg_sentiment_rating
                        : agent.avg_sentiment_rating.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {Number.isInteger(agent.avg_agent_rating)
                        ? agent.avg_agent_rating
                        : agent.avg_agent_rating.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {Number.isInteger(agent.avg_duration_seconds)
                        ? agent.avg_duration_seconds
                        : agent.avg_duration_seconds.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">{agent.total_anomalies}</td>
                    <td className="py-2 px-4 border-b">
                      {agent.detected_audiofiles && agent.detected_audiofiles.length
                        ? agent.detected_audiofiles.join(", ")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!showFilters && agents.length === 0 && !loading && (
          <div className="py-8 text-center text-gray-500">No data for selected range.</div>
        )}
      </div>
    </div>
  )
}

