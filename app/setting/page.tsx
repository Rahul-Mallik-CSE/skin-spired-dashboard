"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  useGetNotificationManagementQuery,
  useUpdateNotificationManagementMutation,
} from "@/redux/feature/notificationManagementAPI";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const settingsLinks = [
    { title: "Personal Information", href: "/setting/personal-information" },
    { title: "Change Password", href: "/setting/change-password" },
  ];

  const { data, isLoading } = useGetNotificationManagementQuery({});
  const [updateNotification] = useUpdateNotificationManagementMutation();

  const [inApp, setInApp] = useState(false);
  const [push, setPush] = useState(false);

  const notificationData = data?.data?.[0];

  // Sync local state when API data loads
  useEffect(() => {
    if (notificationData) {
      setInApp(notificationData.inAppNotification ?? false);
      setPush(notificationData.pushNotification ?? false);
    }
  }, [notificationData]);

  const handleToggle = async (
    field: "inAppNotification" | "pushNotification"
  ) => {
    const newInApp = field === "inAppNotification" ? !inApp : inApp;
    const newPush = field === "pushNotification" ? !push : push;

    // Update UI immediately
    if (field === "inAppNotification") setInApp(newInApp);
    if (field === "pushNotification") setPush(newPush);

    try {
      await updateNotification({
        inAppNotification: newInApp,
        pushNotification: newPush,
      }).unwrap();
      toast.success("Notification settings updated");
    } catch (error: any) {
      // Revert on failure
      if (field === "inAppNotification") setInApp(!newInApp);
      if (field === "pushNotification") setPush(!newPush);
      toast.error(error?.data?.message || "Failed to update notification settings");
    }
  };

  return (
    <div className="flex min-h-screen bg-background2">
      <div className="flex-1 w-full">
        <main className="w-full p-4 md:p-6">
          <div className="w-full mx-auto bg-[#FFF] p-6 rounded-2xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Settings
            </h1>
            <div className="border-b border-gray-200 mb-6"></div>

            <div className="space-y-4">
              {settingsLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between p-4 border-b border-b-[#797879] transition-colors"
                >
                  <span className="text-[#2e2a2a] text-lg">{link.title}</span>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>
              ))}
            </div>

            {/* Notification Management */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Notification Management
              </h2>
              <div className="border-b border-gray-200 mb-6"></div>

              {isLoading ? (
                <Loading />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-b border-b-[#797879]">
                    <span className="text-[#2e2a2a] text-lg">
                      In-App Notification
                    </span>
                    <Switch
                      checked={inApp}
                      onCheckedChange={() => handleToggle("inAppNotification")}
                      className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-b-[#797879]">
                    <span className="text-[#2e2a2a] text-lg">
                      Push Notification
                    </span>
                    <Switch
                      checked={push}
                      onCheckedChange={() => handleToggle("pushNotification")}
                      className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
