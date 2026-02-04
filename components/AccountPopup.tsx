import React from "react";
import { XIcon } from "./icons/XIcon";

interface AccountPopupProps {
  user: {
    name: string;
    email: string;
    picture: string;
    pro: boolean;
  };
  onClose: () => void;
}

export const AccountPopup: React.FC<AccountPopupProps> = ({ user, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-sm font-semibold text-gray-900">Account</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-center px-6 py-5 space-y-2">
          <img
            src={user.picture}
            alt="profile"
            className="w-16 h-16 rounded-full border"
          />

          <p className="text-sm font-semibold text-gray-900">
            {user.name}
          </p>
          <p className="text-xs text-gray-500">
            {user.email}
          </p>

          <span className="mt-2 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            {user.pro ? "ClariCase Unlimited" : "Free Plan"}
          </span>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">

          {/* Primary CTA */}
          {!user.pro ? (
            <button
              className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition"
              onClick={() =>
                (window.location.href =
                  "https://www.paypal.com/ncp/payment/A2YEU63SR5HJY")
              }
            >
              Upgrade to Unlimited
            </button>
          ) : (
            <button
              className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition"
              onClick={() =>
                (window.location.href =
                  "mailto:team@claricase.xyz?subject=Billing%20and%20Subscription%20-%20ClariCase")
              }
            >
              Manage Subscription
            </button>
          )}

          <button
            className="w-full py-2.5 text-sm text-gray-700 border rounded-lg hover:bg-gray-50 transition"
            onClick={() =>
              (window.location.href =
                "mailto:support@claricase.xyz?subject=Help%20and%20Support%20-%20ClariCase")
            }
          >
            Get Help & Support
          </button>

          {/* Destructive action */}
          <div className="pt-2">
            <button
              className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              onClick={() =>
                (window.location.href =
                  "mailto:support@claricase.xyz?subject=Account%20Deletion%20Request%20-%20ClariCase")
              }
            >
              Request Account Deletion
            </button>
            <p className="mt-1 text-[7px] text-gray-500 text-center">
              Your data will be permanently removed in accordance with our privacy policy.
            </p>
          </div>

          {/* Trust line */}
          <p className="pt-3 text-[11px] text-gray-400 text-center">
            ClariCase never trains AI models on your private datas.
          </p>
        </div>6
      </div>
    </>
  );
};
