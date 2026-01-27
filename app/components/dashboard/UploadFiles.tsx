//UploadFiles.tsx
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Upload, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

// Type definitions
interface SuccessResponse {
  filename: string;
  url: string;
  message: string;
}

interface ErrorResponse {
  detail: string;
}

interface IncidentResponse {
  incident_number: string;
  valid: boolean;
}

interface FileItem {
  original_name: string;
  datetime: string;
  filename: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const AudioUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [response, setResponse] = useState<SuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [incidentNumber, setIncidentNumber] = useState<string>("");
  const [isIncidentValid, setIsIncidentValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [incidentSuccess, setIncidentSuccess] = useState<string | null>(null);
  const [incidentError, setIncidentError] = useState<string | null>(null);
  const [previousFiles, setPreviousFiles] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [filesError, setFilesError] = useState<string | null>(null);

  // Fetch previous files on component mount
  useEffect(() => {
    fetchPreviousFiles();
  }, []);

  const fetchPreviousFiles = async (): Promise<void> => {
    setLoadingFiles(true);
    setFilesError(null);
    try {
      const res = await fetch(
        "https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/files",
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (res.ok) {
        const data: FileItem[] = await res.json();
        setPreviousFiles(data);
      } else {
        setFilesError("Failed to load files list");
      }
    } catch (err) {
      setFilesError("Error loading files list");
      console.error("Error fetching files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileSelect = (filename: string): void => {
    setSelectedFile(filename);
    setError(null);
    setResponse(null);
  };

  const validateIncidentNumber = async (incNumber: string): Promise<void> => {
    if (!incNumber) {
      setIncidentError("Please enter an incident number.");
      setIsIncidentValid(null);
      return;
    }

    setIsValidating(true);
    setIncidentSuccess(null);
    setIncidentError(null);

    try {
      const res = await fetch(
        `https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/check-incidient-number?inc_number=${encodeURIComponent(
          incNumber
        )}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      const data: IncidentResponse = await res.json();

      if (res.ok && data.incident_number === incNumber) {
        setIsIncidentValid(data.valid);
        if (data.valid) {
          setIncidentSuccess("Incident number is valid.");
        } else {
          setIncidentError("Please enter a valid Incident Number.");
        }
      } else {
        setIsIncidentValid(false);
        setIncidentError("Please enter a valid Incident Number.");
      }
    } catch (err) {
      setIsIncidentValid(false);
      setIncidentError("Error validating incident number. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleIncidentChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setIncidentNumber(value);
    setIsIncidentValid(null);
    setIncidentSuccess(null);
    setIncidentError(null);
  };

  const handleIncidentBlur = (): void => {
    if (incidentNumber) {
      validateIncidentNumber(incidentNumber);
    } else {
      setIncidentError("Please enter an incident number.");
    }
  };

const uploadFile = async (): Promise<void> => {
  if (!selectedFile || isIncidentValid === false || !incidentNumber) {
    if (!selectedFile) {
      setError("Please select a file from the list.");
    }
    if (isIncidentValid === false || !incidentNumber) {
      setIncidentError("Please enter a valid Incident Number.");
    }
    return;
  }

  setUploading(true);
  setError(null);
  setResponse(null);

  try {
    // Use URLSearchParams instead of FormData for x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("incident_number", incidentNumber);
    params.append("blob_file_name", selectedFile);
    params.append("file_name", selectedFile);

    const res = await fetch(
      "https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/upload-report-to-incident-from-blob",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded", // Add this header
        },
        body: params.toString(), // Convert to string
      }
    );

    const data: ApiResponse = await res.json();

    if (res.ok) {
      setResponse(data as SuccessResponse);
    } else {
      const errorData = data as ErrorResponse;
      setError(errorData.detail || "Upload failed");
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    setError("Network error: " + errorMessage);
  } finally {
    setUploading(false);
  }
};

  const resetUpload = (): void => {
    setSelectedFile("");
    setResponse(null);
    setError(null);
    setIncidentNumber("");
    setIsIncidentValid(null);
    setIncidentSuccess(null);
    setIncidentError(null);
  };

  const formatDateTime = (datetime: string): string => {
    // Format: YYYYMMDDHHMMSS to DD/MM/YYYY HH:MM:SS
    const year = datetime.substring(0, 4);
    const month = datetime.substring(4, 6);
    const day = datetime.substring(6, 8);
    const hour = datetime.substring(8, 10);
    const minute = datetime.substring(10, 12);
    const second = datetime.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold ot-title">Upload File</h2>
        <p className="font-sm osubtitle">Select a file and enter incident number for processing</p>
      </div>

      {/* Files List Section */}
      {!response && (
        <div>
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 osubtitle">
              Select File to Upload
            </h3>
            {loadingFiles ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-blue-500 mr-2" />
                <span className="osubtitle">Loading files...</span>
              </div>
            ) : filesError ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <p className="text-yellow-700 text-sm">{filesError}</p>
                </div>
                <button
                  onClick={fetchPreviousFiles}
                  className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                >
                  Retry
                </button>
              </div>
            ) : previousFiles.length > 0 ? (
              <div className="relative">
                <select
                  className="w-full h-[45px] appearance-none px-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleFileSelect(e.target.value)}
                  value={selectedFile}
                >
                  <option value="" disabled>
                    Select a file
                  </option>
                  {previousFiles.map((fileItem, index) => (
                    <option key={index} value={fileItem.filename}>
                      {fileItem.filename} - {formatDateTime(fileItem.datetime)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.10378 1.09419L5.82044 6.00739L10.5371 1.09419" stroke="#34334B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500 osubtitle">No files available</p>
              </div>
            )}
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm ot-title">
                      Selected File: {selectedFile}
                    </p>
                    <p className="text-xs text-blue-600 osubtitle">
                      File ready for upload
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile("")}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  type="button"
                >
                  Change File
                </button>
              </div>
            </div>
          )}

          {/* Incident Number Input */}
          <div className="pt-4 rounded-lg">
            <h2 className="text-md font-semibold mb-1 osubtitle">
              Enter Incident Number
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Incident Number"
                value={incidentNumber}
                onChange={handleIncidentChange}
                onBlur={handleIncidentBlur}
                className={`w-full p-3 border rounded-md mb-2 focus:outline-none focus:ring-2 ${
                  isIncidentValid === false
                    ? "border-red-500 focus:ring-red-500"
                    : isIncidentValid === true
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {isValidating && (
                <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-gray-500" />
              )}
            </div>
            
            {/* Incident Success Message */}
            {incidentSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-700 text-sm">{incidentSuccess}</p>
                </div>
              </div>
            )}
            
            {/* Incident Error Message */}
            {incidentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{incidentError}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={resetUpload}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={uploadFile}
                disabled={uploading || !selectedFile || isIncidentValid === false || !incidentNumber}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Response */}
      {response && (
        <div className="bg-white border border-gray-200 rounded-lg p-10 mb-4 text-center">
          <div>
            <Image
              src="/Uploadfile-Successfully.svg"
              alt="Upload successful"
              width={260}
              height={197}
              className="max-w-md m-auto"
            />
            <h3 className="text-center font-bold ot-title text-2xl">
              Upload Successful!
            </h3>
          </div>
          <button
            onClick={resetUpload}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors m-auto"
            type="button"
          >
            Upload Another File
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="font-medium text-red-800">Upload Failed</h3>
              <p className="text-red-700 text-left text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            type="button"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioUploadComponent;