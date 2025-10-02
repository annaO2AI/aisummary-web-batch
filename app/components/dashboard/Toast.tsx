import React from "react";

const Toast = ({ open, title, description, buttonText, onButtonClick }:any) => {
  if (!open) return null;

  return (
    <div className="flex justify-between w-[100%] items-center rounded-md mt-12 mb-6 bg-red-600 h-[60] p-6">
      {/* <div style={{ fontWeight: "bold", fontSize: "18px" }}>{title}</div> */}
      <div className="text-white text-base">{description}</div>
      <div>
        <button
          onClick={onButtonClick}
          style={{
            cursor: "pointer",
          }}
        >
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.08859 4.88794L4.14645 4.81869C4.32001 4.64512 4.58944 4.62584 4.78431 4.76083L4.85355 4.81869L10 9.96524L15.1464 4.81869C15.32 4.64512 15.5894 4.62584 15.7843 4.76083L15.8536 4.81869C16.0271 4.99225 16.0464 5.26168 15.9114 5.45655L15.8536 5.52579L10.707 10.6722L15.8536 15.8187C16.0271 15.9923 16.0464 16.2617 15.9114 16.4565L15.8536 16.5258C15.68 16.6994 15.4106 16.7186 15.2157 16.5836L15.1464 16.5258L10 11.3792L4.85355 16.5258C4.67999 16.6994 4.41056 16.7186 4.21569 16.5836L4.14645 16.5258C3.97288 16.3522 3.9536 16.0828 4.08859 15.8879L4.14645 15.8187L9.293 10.6722L4.14645 5.52579C3.97288 5.35223 3.9536 5.0828 4.08859 4.88794L4.14645 4.81869L4.08859 4.88794Z" fill="white"/>
          </svg>

        </button>
      </div>
    </div>
  );
};

export default Toast;