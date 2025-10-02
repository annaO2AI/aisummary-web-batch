import React from "react";

const Toast = ({ open, title, description, buttonText, onButtonClick }:any) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        minWidth: "320px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        zIndex: 1000,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* <div style={{ fontWeight: "bold", fontSize: "18px" }}>{title}</div> */}
      <div style={{ fontSize: "15px", color: "#444" }}>{description}</div>
      <div style={{ marginTop: "12px", textAlign: "right" }}>
        <button
          onClick={onButtonClick}
          style={{
            padding: "8px 16px",
            background: "#0078d4",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Toast;