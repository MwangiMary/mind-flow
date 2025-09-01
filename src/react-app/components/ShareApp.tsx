import { useState } from "react";
import { Share2, Copy, Check, QrCode, X } from "lucide-react";

interface ShareAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareApp({ isOpen, onClose }: ShareAppProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = "https://xutmvobehyo2w.mocha.app";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareOnTwitter = () => {
    const text = "Check out MindFlow - an AI-powered mood journal that helps track emotional wellness! 🧠✨";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
    window.open(url, "_blank");
  };

  const shareViaMail = () => {
    const subject = "Try MindFlow - AI-Powered Mood Journal";
    const body = `Hey! I wanted to share this amazing mood tracking app with you: MindFlow.\n\nIt uses AI to analyze your emotions and helps you understand your mental wellness patterns. I think you'd really like it!\n\nCheck it out: ${appUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Share MindFlow</h2>
          <p className="text-gray-600">Invite friends to start their wellness journey</p>
        </div>

        {/* App URL */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm text-gray-500 mb-1">App URL</p>
              <p className="text-sm font-mono text-gray-800 break-all">{appUrl}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share via</h3>
          
          <button
            onClick={shareViaMail}
            className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">@</span>
            </div>
            Email
          </button>

          <button
            onClick={shareOnTwitter}
            className="w-full flex items-center gap-3 p-3 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">𝕏</span>
            </div>
            Twitter / X
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">in</span>
            </div>
            LinkedIn
          </button>
        </div>

        {/* QR Code placeholder */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-center">
          <QrCode className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Show this URL to friends for easy mobile access
          </p>
        </div>
      </div>
    </div>
  );
}
