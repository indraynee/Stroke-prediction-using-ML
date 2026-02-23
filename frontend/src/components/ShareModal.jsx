import React, { useState } from 'react';
import { X, Link as LinkIcon, Copy, Check, Share2, ExternalLink } from 'lucide-react';

const ShareModal = ({ predictionId, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/share/${predictionId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Share2 className="text-[#8ebae2]" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Share Prediction</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-gray-600 mb-4">
              Share this prediction report with healthcare providers. This link provides access to the risk assessment without requiring login.
            </p>
            
            {/* Share URL Display */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{shareUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-[#8ebae2] text-white hover:bg-[#a5c9eb]'
              }`}
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy Link
                </>
              )}
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="px-4 py-3 border-2 border-[#8ebae2] text-[#8ebae2] rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Preview
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This link contains limited patient information for healthcare professional review. 
              Personal identifiable information is not included for privacy protection.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShareModal;
