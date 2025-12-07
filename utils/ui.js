import { message } from "antd";

export const shortenAddress = (addr) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const copyToClipboard = async (text, label = "Text") => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    message.success(`${label} copied!`);
    return true;
  } catch (err) {
    console.error("copy failed", err);
    message.error("Copy failed");
    return false;
  }
};

export const convertTime = (time) => {
  if (!time || Number(time) === 0) return "-";
  const newTime = new Date(time * 1000); // Assuming seconds from smart contract
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(newTime);
};
