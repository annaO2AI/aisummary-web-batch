"use client";

import {
  SentimentChart,
  SentimentScoreGauge,
  ActionItemsList,
  SpeakerInsights,
  CallSummaryCard,
  CallCard,
  OSCard,
  ProgressBar,
  SentimentChartNew,
  Dashbordmain
} from "./dashboard/index";
import { useDashboard } from "../context/DashboardContext";
import SentimentScoreCard from "./dashboard/cards/SentimentScoreCard";
import { SentimentScoreChart } from "./dashboard/SentimentScoreGauge";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { decodeJWT } from "@/app/utils/decodeJWT";
import { API_ROUTES } from "../constants/api";
import { fetchWithAuth } from "../utils/axios";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type React from "react";

interface Section {
  id: string;
  component: React.ReactElement;
  visible: boolean;
}

// SortableItem component for each draggable section
const SortableItem = ({ 
  id, 
  children, 
  visible, 
  onClose 
}: { 
  id: string; 
  children: React.ReactElement; 
  visible: boolean; 
  onClose: (id: string) => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!visible) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative transition-shadow"
    >
      <button
        onClick={() => onClose(id)}
        className="absolute top-3 right-3 z-10 text-gray-500 hover:text-red-500 focus:outline-none bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
        aria-label={`Close ${id} section`}
      >
        ✕
      </button>
      {children}
    </div>
  );
};

const Dashboard = () => {
  const { graphData, loading, selectedAudio, hasProcessed, setHasProcessed, resetDashboard } = useDashboard();
  
  // State variables
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const [useremail, setUseremail] = useState<string | null>(null);
  const [useAccess, setUseAccess] = useState<Record<string, string>>({});
  const [loadinguse, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Dashboard state:", {
      loading,
      hasProcessed,
      graphData,
      selectedAudio,
      isDataReady
    });
  }, [loading, hasProcessed, graphData, selectedAudio, isDataReady]);

  // Check if data is ready for display
  useEffect(() => {
    const dataReady = !loading && 
                     graphData && 
                     (graphData.sentiment_chunks?.length > 0 || 
                      graphData.call_summary || 
                      graphData.Customer_name ||
                      graphData.sentiment_score !== undefined);
    
    setIsDataReady(dataReady);
    console.log("Data ready check:", { dataReady, graphData });
  }, [loading, graphData]);

  // Conditions for showing different views
  const showAudioInsights = isDataReady;
  const showDashboardMain = !loading && !hasProcessed && !isDataReady;

  // Initialize sections when graphData is available
  useEffect(() => {
    if (!isDataReady || !graphData) {
      console.log("Data not ready, skipping section initialization");
      return;
    }

    console.log("Initializing sections with data:", graphData);

    const newSections: Section[] = [
      {
        id: "call-info",
        component: (
          <div className="flex flex-row gap-6 mb-6">
            <CallCard 
              audioId={selectedAudio || ""} 
              customerName={graphData?.Customer_name || "Unknown Customer"} 
              agentName={graphData?.Agent_name || ""} 
            />
            <OSCard sentiment={graphData?.sentiment_score?.toString() || "N/A"} />
            <SentimentScoreCard score={graphData?.sentiment_score ?? 0} />
            <SentimentScoreGauge sentimentScore={graphData?.sentiment_score ?? 0} />
          </div>
        ),
        visible: true,
      }
    ];

    // Add call summary section if available
    if (graphData?.call_summary) {
      newSections.push({
        id: "call-summary",
        component: (
          <div className="w-full mb-6">
            <CallSummaryCard summary={graphData.call_summary} />
          </div>
        ),
        visible: true,
      });
    }

    // Add speaker insights if available
    if (graphData?.speaker_insights || graphData?.Agent_rating) {
      newSections.push({
        id: "speaker-insights",
        component: (
          <div className="w-full mb-6">
            <SpeakerInsights
              speakerInsights={graphData?.speaker_insights ?? { Customer: "", Agent: "" }}
              agentRating={graphData?.Agent_rating ?? 0}
              role={useAccess.role || ""}
              customerName={graphData?.Customer_name || ""}
            />
          </div>
        ),
        visible: true,
      });
    }

    // Add sentiment chart if data available
    if (graphData?.sentiment_chunks && graphData.sentiment_chunks.length > 0) {
      newSections.push({
        id: "sentiment-chart",
        component: (
          <div className="flex flex-col gap-6 p-12 rounded-xl shadow-sm bg-white mb-6">
            <div>
              <h2 className="ot-title font-semibold text-xl">Call Sentiment Over Time</h2>
              <p className="text-base osubtitle">
                This chart shows the sentiment score over time based on the audio file selected.
              </p>
            </div>
            <SentimentChartNew data={graphData.sentiment_chunks} />
          </div>
        ),
        visible: true,
      });
    }

    // Add sentiment score chart
    if (graphData?.sentiment_score !== undefined) {
      newSections.push({
        id: "sentiment-score-chart",
        component: (
          <div className="mb-6">
            <SentimentScoreChart sentimentScore={graphData.sentiment_score} />
          </div>
        ),
        visible: true,
      });
    }

    // Add action items if available
    if (graphData?.action_items || graphData?.email_sent) {
      newSections.push({
        id: "action-items",
        component: (
          <div className="flex flex-row gap-6 mt-6">
            <div className="w-full">
              <ActionItemsList
                actionItems={graphData?.action_items ?? []}
                emailSent={graphData?.email_sent ?? []}
                audioId={selectedAudio || ""}
                sentimentScore={graphData?.sentiment_score ?? 0}
              />
            </div>
          </div>
        ),
        visible: true,
      });
    }

    setSections(newSections);
    console.log("Sections initialized:", newSections.length, "sections");
  }, [isDataReady, graphData, selectedAudio, useAccess.role]);

  // JWT decoding with error handling
  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const token = cookies.find((c) => c.startsWith("access_token="))?.split("=")[1];

      if (!token) {
        console.log("No access token found in cookies");
        setLoading(false);
        return;
      }

      const decoded = decodeJWT(token);
      if (!decoded) {
        console.log("Failed to decode JWT");
        setLoading(false);
        return;
      }

      if (decoded?.name) setUsername(decoded.name);
      if (decoded?.email || decoded?.Email || decoded?.user_email) {
        setUseremail(decoded.email || decoded.Email || decoded.user_email);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      setLoading(false);
    }
  }, []);

  // Fetch user access role with error handling
  useEffect(() => {
    const fetchUseaccess = async () => {
      if (!useremail) {
        console.log("Skipping API call: useremail is not yet set");
        setLoading(false);
        return;
      }

      try {
        const url = `${API_ROUTES.useaccess}?email=${useremail}`;
        const res = await fetchWithAuth(url);
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        const data = await res.json();
        setUseAccess(data || {});
        console.log("User access loaded:", data);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        // Set empty object as fallback
        setUseAccess({});
      } finally {
        setLoading(false);
      }
    };

    fetchUseaccess();
  }, [useremail]);

  // Progress bar with cleanup
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      setProgress(10);
      timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 80 / 60, 90));
      }, 100);
    } else {
      setProgress(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  // Handle drag end with error boundary
  const onDragEnd = (event: any) => {
    try {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setSections((prev) => {
        const oldIndex = prev.findIndex((section) => section.id === active.id);
        const newIndex = prev.findIndex((section) => section.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return prev;
        
        const newSections = [...prev];
        const [movedSection] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, movedSection);
        return newSections;
      });
    } catch (error) {
      console.error("Error in drag end:", error);
    }
  };

  // Handle section close
  const handleCloseSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, visible: false } : section
      )
    );
  };

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Component render
  return (
    <div className="relative z-0 max-w-7xl mx-auto space-y-6 px-4">
      {/* Audio Insights */}
      {showAudioInsights && (
        <div className="mt-6 pt-4 audio-insights-main">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold ot-title">
              Audio Insights
            </h1>
            {username && (
              <span className="text-gray-700 font-normal">
                Hi, {username} {useAccess.role ? `(${useAccess.role})` : ''}
              </span>
            )}
          </div>
          
          {sections.length > 0 ? (
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={onDragEnd}
            >
              <SortableContext 
                items={sections.map((section) => section.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6">
                  {sections.map((section) => (
                    <SortableItem
                      key={section.id}
                      id={section.id}
                      visible={section.visible}
                      onClose={handleCloseSection}
                    >
                      {section.component}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading insights...</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={() => resetDashboard()}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Process New Audio
            </button>
          </div>
        </div>
      )}

      {/* Dashboardmain */}
      {showDashboardMain && (
        <div className="Dashbordmain-main">
          <Dashbordmain />
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div className="mt-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">Processing audio file...</p>
          </div>
          <ProgressBar progress={progress} />
        </div>
      )}

      {/* Fallback for no data after processing */}
      {!loading && hasProcessed && !isDataReady && (
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800 mb-4">
              Processing completed but no insights were generated. This could be due to:
            </p>
            <ul className="text-sm text-yellow-700 text-left mb-4">
              <li>• Audio file was too short or unclear</li>
              <li>• No speech was detected</li>
              <li>• Processing encountered an error</li>
            </ul>
            <button
              onClick={() => resetDashboard()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Another Audio File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;