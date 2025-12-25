/** @format */

"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserDetailsModalProps {
  user: {
    id: number;
    firstName: string;
    status: string;
    date: string;
    amount: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  if (!isOpen) return null;

  // Generate a random user ID with # prefix and 6 digits
  const userId = `#${Math.floor(Math.random() * 900000) + 100000}`;

  // Format current date as MM-DD-YYYY
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(currentDate.getDate()).padStart(
    2,
    "0"
  )}-${currentDate.getFullYear()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#000000] border-gray-800 max-w-md max-h-[30vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-center text-[30px] font-semibold text-[#E6E6E6] py-5">
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            <DetailRow label="User ID:" value={userId} />
            <DetailRow label="Date" value={formattedDate} />
            <DetailRow label="User Name" value={user.firstName} />
            <DetailRow label="Transaction Amount" value={user.amount} />
            <DetailRow label="Payment Status" value={user.status} />
          </div>
        </div>

        <div className="flex-shrink-0 pt-4">
          <Button
            onClick={onClose}
            className="w-full bg-[#5CE1E6] hover:bg-[#5ce1e6b7] text-black"
          >
            Okay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between border-b border-[#D1D5DB] py-2">
      <span className="text-[#E6E6E6]">{label}</span>
      <span className="font-medium text-[#E6E6E6]">{value}</span>
    </div>
  );
}
