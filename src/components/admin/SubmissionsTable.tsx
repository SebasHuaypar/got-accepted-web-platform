"use client";

import { useState, useTransition, useEffect } from "react";
import { deleteSubmission } from "@/app/admin/actions";
import { replyToSubmission, markSubmissionAsRead } from "@/app/admin/actions/contact";
import { generateReplyEmailHtml } from "@/utils/emailTemplate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  FiSearch,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiX,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiEdit3,
  FiMonitor,
} from "react-icons/fi";

interface Submission {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
  status?: string;
  replied_at?: string;
}

export default function SubmissionsTable({
  initialSubmissions,
}: {
  initialSubmissions: Submission[];
}) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  
  // Keep local state in sync when Next.js server actions revalidate the data
  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyTab, setReplyTab] = useState<"write" | "preview">("write");

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "" });

  // Filter logic
  const filteredSubmissions = submissions.filter((sub) => {
    const term = searchQuery.toLowerCase();
    return (
      sub.name.toLowerCase().includes(term) ||
      sub.email.toLowerCase().includes(term) ||
      sub.topic.toLowerCase().includes(term) ||
      sub.message.toLowerCase().includes(term) ||
      (sub.status && sub.status.toLowerCase().includes(term))
    );
  });

  const handleConfirmDelete = () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: "" });
    if (!id) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteSubmission(id);
        setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
        if (selectedSubmission?.id === id) {
          closeModal();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete submission.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleSendReply = async () => {
    if (!selectedSubmission || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      await replyToSubmission(
        selectedSubmission.id,
        selectedSubmission.email,
        selectedSubmission.name,
        selectedSubmission.message,
        replyText
      );
      
      // Update local state to reflect the sent reply
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? { ...sub, status: "replied", replied_at: new Date().toISOString() }
            : sub
        )
      );
      
      setReplySuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error: any) {
      alert(error.message || "Failed to send reply. Check your Resend API configuration.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setShowReplyForm(false);
    setReplyText("");
    setReplySuccess(false);
    setReplyTab("write");
  };

  const openModal = (sub: Submission) => {
    setSelectedSubmission(sub);
    setShowReplyForm(false);
    setReplyText("");
    setReplySuccess(false);
    setReplyTab("write");

    if (!sub.status || sub.status === "unread") {
      startTransition(async () => {
        try {
          await markSubmissionAsRead(sub.id);
          // Update local state immediately for snappy UX
          setSubmissions((prev) =>
            prev.map((s) => (s.id === sub.id ? { ...s, status: "read" } : s))
          );
        } catch (error) {
          console.error("Failed to mark as read:", error);
        }
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTopicLabel = (topic: string) => {
    switch (topic) {
      case "programs":
        return "Master's Programs";
      case "scholarships":
        return "Scholarships";
      case "mentorship":
        return "Mentorship & Guidance";
      case "partnership":
        return "Partnership & Media";
      default:
        return topic;
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, content, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary placeholder-gray-400"
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
          Total: {filteredSubmissions.length} message(s)
        </div>
      </div>

      {/* Messages List / Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-16 text-center text-gray-400 font-bold">
          No contact submissions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6">Sender</th>
                <th className="py-4 px-6">Topic</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Snippet</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-primary">{sub.name}</div>
                    <div className="text-xs text-gray-400 font-semibold">{sub.email}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-500">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                      {getTopicLabel(sub.topic)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {sub.status === "replied" ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-black uppercase tracking-wider">
                        Replied
                      </span>
                    ) : sub.status === "read" ? (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-black uppercase tracking-wider">
                        Read
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-accent/10 text-accent rounded-md text-[10px] font-black uppercase tracking-wider">
                        Unread
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-medium max-w-[200px] truncate">
                    {sub.message}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-400 font-bold whitespace-nowrap">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(sub)}
                        className="p-2 hover:bg-primary/5 text-gray-400 hover:text-primary rounded-xl transition-colors"
                        title="Read & Reply"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: sub.id })}
                        disabled={deletingId === sub.id}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Message"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Reader & Reply Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full p-8 md:p-10 space-y-6 relative animate-scaleUp max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-gray-200 transition-colors z-10 bg-white"
            >
              <FiX size={18} />
            </button>

            <div className="overflow-y-auto pr-2 space-y-6 flex-1">
              {/* Header info */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
                    {getTopicLabel(selectedSubmission.topic)}
                  </span>
                  {selectedSubmission.status === "replied" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
                      <FiCheckCircle size={12} className="shrink-0" /> Replied
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-primary leading-tight">
                  {selectedSubmission.name}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-bold border-b border-gray-100 pb-4">
                  <span className="flex items-center gap-1.5">
                    <FiMail />
                    {selectedSubmission.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCalendar />
                    {formatDate(selectedSubmission.created_at)}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-gray-600 leading-relaxed font-medium text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedSubmission.message}
              </div>

              {/* Reply Section */}
              {!showReplyForm ? (
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-widest"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowReplyForm(true)}
                    className="px-6 py-3 bg-primary hover:bg-accent text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-colors uppercase tracking-widest"
                  >
                    <FiMail size={14} />
                    Write Reply
                  </button>
                </div>
              ) : replySuccess ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 flex flex-col items-center justify-center space-y-3 animate-fadeIn">
                  <FiCheckCircle size={32} />
                  <p className="font-black">Reply sent successfully!</p>
                </div>
              ) : (
                <div className="pt-4 space-y-4 animate-fadeIn">
                  
                  {/* Tabs Header */}
                  <div className="flex items-center border-b border-gray-100">
                    <button
                      onClick={() => setReplyTab("write")}
                      className={`px-6 py-3 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 border-b-2 ${
                        replyTab === "write" ? "border-accent text-accent" : "border-transparent text-gray-400 hover:text-primary"
                      }`}
                    >
                      <FiEdit3 size={14} /> Write
                    </button>
                    <button
                      onClick={() => setReplyTab("preview")}
                      className={`px-6 py-3 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 border-b-2 ${
                        replyTab === "preview" ? "border-accent text-accent" : "border-transparent text-gray-400 hover:text-primary"
                      }`}
                    >
                      <FiMonitor size={14} /> Preview
                    </button>
                  </div>

                  {/* Tabs Content */}
                  <div>
                    {replyTab === "write" ? (
                      <div className="animate-fadeIn">
                        <textarea
                          rows={6}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Write your response to ${selectedSubmission.name}...`}
                          className="w-full bg-white border border-gray-200 rounded-2xl p-4 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm text-primary resize-none"
                          disabled={isSendingReply}
                        />
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                          This will be sent directly to {selectedSubmission.email} via Resend.
                        </p>
                      </div>
                    ) : (
                      <div className="animate-fadeIn">
                        <div 
                          className="w-full bg-white border border-gray-200 rounded-2xl h-[300px] overflow-y-auto shadow-inner bg-gray-50/30"
                          dangerouslySetInnerHTML={{
                            __html: generateReplyEmailHtml(
                              selectedSubmission.name,
                              selectedSubmission.message,
                              replyText || "(Your response will appear here...)"
                            )
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowReplyForm(false)}
                      disabled={isSendingReply}
                      className="px-6 py-3 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={isSendingReply || !replyText.trim()}
                      className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                      {isSendingReply ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <FiSend size={14} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: "" })}
      />
    </div>
  );
}
