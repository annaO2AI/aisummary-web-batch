import AgentSidebar from "../agent-details/Sidebar"

interface Agent {
  agent_id: number
  agent_name: string
  total_calls: number
  avg_agent_rating: number
  avg_sentiment_rating: number
  total_anomalies: number
  detected_audiofiles: []
}

async function fetchAgentStatistics(): Promise<Agent[]> {
  try {
    const response = await fetch(
      'https://aisummary-api-fue6a9gxabdceng4.centralus-01.azurewebsites.net/agent_statistics',
      { headers: { accept: 'application/json' }, cache: 'no-store' }
    )
    if (!response.ok) return []
    const data: Agent[] = await response.json()
    return data
  } catch (e) {
    return []
  }
}

export default async function AgentSummaryPage() {
  const agents = await fetchAgentStatistics()
  return (
    <div className="ot-min-h-screen w-full">
      <div className="max-w-6xl w-full grid grid-cols-[32%_68%] gap-6 items-start">
        <div className="flex flex-col gap-4">       
          <AgentSidebar agents={agents as any} selectedAgentIds={[]} />        
        </div>

        <div className="container mx-auto p-4">
          <div className="text-2xl font-bold mb-4">Agent Summary</div>
          <div className="overflow-x-auto w-[100%] mt-2">
            <table className="bg-white border border-gray-200 min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Agent Name</th>
                  <th className="py-2 px-4 border-b text-left">Total Number of Calls</th>
                  <th className="py-2 px-4 border-b text-left">Average Call Sentiment</th>
                  <th className="py-2 px-4 border-b text-left">Average Rating of Agent</th>
                  <th className="py-2 px-4 border-b text-left">Anomalies Detected</th>
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
                    <td className="py-2 px-4 border-b">{agent.total_anomalies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


