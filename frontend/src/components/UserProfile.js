import React from "react";

const UserProfile = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-xs font-medium text-white">
            {user.name.charAt(0)}
          </span>
        </div>
        <div className="text-sm text-gray-700">{user.name}</div>
        <button
          onClick={onLogout}
          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
        >
          Çıkış
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
