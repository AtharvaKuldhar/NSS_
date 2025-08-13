import { useState } from "react"
import Image from "next/image"
import { adminAPI } from "@/lib/api"
import { toast } from "sonner"
import { ActivityCardProps } from "./admin-activity-card"

export default function DonationDetailModal({ donation, onClose }: { donation: ActivityCardProps, onClose: () => void }) {
  const [showCredits, setShowCredits] = useState(false)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleApprove = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await adminAPI.approveDonation({ donationid: donation._id, credits })
      if (response.statusText === "OK") {
        toast.success("Donation approved", {
          description: `${credits} credits assigned!`, richColors: true
        })
        onClose()
      }
    } catch (e) {
      console.error("Failed to approve donation:", e);
      setError("Failed to approve donation");
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await adminAPI.rejectDonation({ donationid: donation._id })
      if (response.statusText === "OK") {
        toast.message("Donation request rejected successfully", {
          richColors: true
        })
        onClose()
      }
    } catch (e) {
      console.error("Failed to approve donation:", e);
      setError("Failed to approve donation");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full relative border-2 border-gray-100 shadow-2xl">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-4">Donation Details</h2>
        <div className="space-y-2">
          <div><b>Volunteer Name:</b> {donation.volunteer}</div>
          <div><b>Mess Name:</b> {donation.mess}</div>
          <div><b>Food Type:</b> {donation.foodtype}</div>
          <div><b>Date:</b> {donation.donationdate && new Date(donation.donationdate).toLocaleString()}</div>
          <div><b>Quantity:</b> {donation.quantity}</div>
          <div><b>To be Consumed Before:</b> {donation.bestbefore}</div>
          <div><b>Category:</b> {donation.category}</div>
          <div><b>Description:</b> {donation.description}</div>
          {donation.imgurl && (
            <div>
              <b>Photo Proof:</b>
              <Image src={donation.imgurl} alt="Photo Proof" width={300} height={200} className="rounded mt-2" />
            </div>
          )}
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {
          donation.status === "pending" &&
          <div>
            {!showCredits ? (
              <div className="flex gap-4 mt-6">
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setShowCredits(true)}>Approve</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleReject}>Reject</button>
              </div>
            ) : (
              <div className="mt-2">
                <label className="block mb-2 font-bold">Assign Credits</label>
                <div className="flex gap-6 items-center pb-2">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={credits}
                    onChange={e => setCredits(Number(e.target.value))}
                    className="py-1 min-w-90 mb-2"
                    disabled={loading}
                    list="tickmarks"
                  />
                  <datalist id="tickmarks">
                    <option value="0" label="0"></option>
                    <option value="1" label="1"></option>
                    <option value="2" label="2"></option>
                    <option value="3" label="3"></option>
                    <option value="4" label="4"></option>
                    <option value="5" label="5"></option>
                    <option value="6" label="6"></option>
                    <option value="7" label="7"></option>
                    <option value="8" label="8"></option>
                    <option value="9" label="9"></option>
                    <option value="10" label="10"></option>
                  </datalist>
                  <input type="text" disabled={true} value={credits} className="border-2 rounded-lg border-gray-400 bg-slate-200 font-semibold text-lg text-center" size={2} />
                </div>
                {
                  donation.status == "pending" && (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded w-full"
                      onClick={handleApprove}
                      disabled={loading || credits <= 0}
                    >
                      {loading ? "Approving..." : "Approve"}
                    </button>
                  )
                }

              </div>
            )}
          </div>
        }
      </div>
    </div>
  )
}