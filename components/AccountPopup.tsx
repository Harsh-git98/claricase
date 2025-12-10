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
          {user?.pro ? (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Pro User
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-200 text-gray-800 text-sm rounded-full">
              Free User
            </span>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 via-purple-700 to-purple-500 text-white rounded-lg hover:bg-indigo-700 transition" onClick={() => window.location.href = "mailto:claricase@hotmail.com?subject=Inquiry%20-%20ClariCase%20Professional%20Plan&body=Hello%20ClariCase%20Team,%0D%0A%0D%0AI%20am%20interested%20in%20learning%20more%20about%20the%20Professional%20plan.%20Please%20help%20me%20with%20pricing%20details%20and%20next%20steps.%0D%0A%0D%0AMy%20Details:%0D%0AName:%20%0D%0AOrganization/Law%20Firm:%20%0D%0AUse%20Case:%20(Research,%20Client%20Cases,%20Internal%20Workflows)%0D%0A%0D%0AHow%20soon%20are%20you%20planning%20to%20get%20started?%20(Immediately/This%20Month/Later)%0D%0A%0D%0AThank%20you%2C%0D%0A"}>
            Contact Sales
          </button>

          <button className="w-full py-2 px-4 border rounded-lg text-gray-700 hover:bg-gray-100 transition" onClick={() => window.location.href = "mailto:claricase@hotmail.com?subject=Help%20%26%20Support%20-%20ClariCase&body=Hello%20ClariCase%20Team,%0D%0A%0D%0AI%20need%20assistance%20with%20ClariCase.%20Please%20help%20me%20with%20my%20issue.%0D%0A%0D%0AThank%20you%2C%0D%0A"}>
            Feedback / Support
          </button>
          <button className="w-full py-2 px-4 border rounded-lg text-red-700 hover:bg-red-300 transition" onClick={() => window.location.href =
  "mailto:claricase@hotmail.com?subject=Account%20Deletion%20Request%20-%20ClariCase&body=Hello%20ClariCase%20Team,%0D%0A%0D%0AI%20would%20like%20to%20request%20deletion%20of%20my%20account.%20Please%20help%20me%20with%20the%20process.%0D%0A%0D%0AThank%20you%2C%0D%0A"}>
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
};
