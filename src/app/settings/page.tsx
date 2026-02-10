"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "company" | "account">("profile");

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-gray-400 hover:text-white">
              ← Back to chat
            </Link>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-800">
          {[
            { id: "profile", label: "Profile" },
            { id: "company", label: "Company" },
            { id: "account", label: "Account" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-white border-indigo-500"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "company" && <CompanySettings />}
        {activeTab === "account" && <AccountSettings />}
      </div>
    </div>
  );
}

function ProfileSettings() {
  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Call API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value="you@example.com"
              disabled
              className="w-full max-w-md px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            {saved ? "✓ Saved" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanySettings() {
  const [companyName, setCompanyName] = useState("My Company");
  const [companyContext, setCompanyContext] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Call API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Company</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Company name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Company context</label>
            <textarea
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder="Tell your AI team about your company, industry, stage, goals..."
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">This context is sent with every message to help personas give better advice</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            {saved ? "✓ Saved" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const handleExport = () => {
    // TODO: Trigger export download
    alert("Export functionality coming soon");
  };

  const handleDelete = () => {
    if (deleteText === "DELETE") {
      // TODO: Call delete API
      alert("Account deletion coming soon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Export Data</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 mb-4">
            Download all your data including conversations, decisions, and profile information.
          </p>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            📥 Export my data
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Session</h2>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* Delete Account */}
      <div>
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
          <p className="text-gray-400 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Delete account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Type DELETE to confirm:</p>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                className="w-full max-w-xs px-4 py-2 bg-gray-800 border border-red-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteText !== "DELETE"}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Confirm delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteText("");
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
