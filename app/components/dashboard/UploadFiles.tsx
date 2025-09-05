"use client"
import React, { useState, ChangeEvent, DragEvent } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Type definitions
interface SuccessResponse {
  filename: string;
  url: string;
  message: string;
}

interface ErrorResponse {
  detail: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const AudioUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [response, setResponse] = useState<SuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate if it's an audio file
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        setError(null);
        setResponse(null);
      } else {
        setError('Please select a valid audio file.');
        setFile(null);
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError(null);
      setResponse(null);
    } else {
      setError('Please drop a valid audio file.');
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const uploadFile = async (): Promise<void> => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/upload-audio/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (res.ok) {
        setResponse(data as SuccessResponse);
      } else {
        const errorData = data as ErrorResponse;
        setError(errorData.detail || 'Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError('Network error: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = (): void => {
    setFile(null);
    setResponse(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Audio File</h2>
        <p className="text-gray-600">Upload your audio file for processing</p>
      </div>

      {/* File Upload Area */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 mb-2">
            Drag and drop your audio file here
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors">
            <span>Browse Files</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: MP3, WAV, M4A, OGG, FLAC
          </p>
        </div>
      )}

      {/* Selected File Display */}
      {file && !response && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {formatFileSize(file.size)} • {file.type}
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-gray-500 hover:text-red-500 text-sm"
              type="button"
            >
              Remove
            </button>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={uploadFile}
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="button"
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
            <button
              onClick={resetUpload}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Response */}
      {response && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-800">Upload Successful!</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-green-800">Filename:</span>
              <span className="text-green-700 ml-2">{response.filename}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">URL:</span>
              <a 
                href={response.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-2 break-all"
              >
                {response.url}
              </a>
            </div>
            <div>
              <span className="font-medium text-green-800">Message:</span>
              <span className="text-green-700 ml-2">{response.message}</span>
            </div>
          </div>
          <button
            onClick={resetUpload}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
              <p className="text-red-700 text-sm mt-1">{error}</p>
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