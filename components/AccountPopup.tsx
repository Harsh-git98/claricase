import React from "react";
import { XIcon } from "./icons/XIcon";

interface AccountPopupProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onClose: () => void;
}

export const AccountPopup: React.FC<AccountPopupProps> = ({ user, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-200 text-gray-500"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <img
            src={user.picture}
            alt="profile"
            className="w-20 h-20 rounded-full shadow"
          />

          <p className="text-md font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Manage Subscription
          </button>

          <button className="w-full py-2 px-4 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
            Privacy Settings
          </button>
        </div>
      </div>
    </>
  );
};
