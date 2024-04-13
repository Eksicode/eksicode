"use client";
import Notification from "@/components/Notifications";
import Navlink from "@components/Ui/NavLink";

function Notifications() {
  return (
    <>
      <h1 className="mt-2">Bildirimler</h1>
      <div className="flex mb-2 h-10 text-xs items-center">
        <Navlink variant="tertiary" href="/uye-ol">
          Tümü
        </Navlink>
        <Navlink variant="tertiary" clasName="ml-3" href="/uye-ol">
          Yorumlar
        </Navlink>
        <Navlink variant="tertiary" clasName="ml-3" href="/uye-ol">
          Gönderiler
        </Navlink>
      </div>
      <Notification />
    </>
  );
}

export default Notifications;
