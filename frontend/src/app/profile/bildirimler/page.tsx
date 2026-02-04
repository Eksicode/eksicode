"use client";

import Notifications from "@/components/Notifications";

export default function NotificationsPage() {
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Bildirimler
            </h1>
            <Notifications />
        </div>
    );
}
