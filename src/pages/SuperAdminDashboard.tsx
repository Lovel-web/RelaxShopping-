// ✅ src/pages/SuperAdminDashboard.tsx

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SuperAdminDashboard() {
  const { profile } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== "superadmin") return;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const allUsersSnap = await getDocs(usersRef);
        const users = allUsersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setAdmins(users.filter((u) => u.role === "admin"));
        setVendors(users.filter((u) => u.role === "vendor"));
        setStaffs(users.filter((u) => u.role === "staff"));
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [profile]);

  if (!profile || profile.role !== "superadmin") {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        ❌ Access denied — Super Admin only.
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    toast.success("User approved!");
  };

  const handleBan = async (id: string) => {
    await updateDoc(doc(db, "users", id), { banned: true });
    toast.success("User banned!");
  };

  const handleUnban = async (id: string) => {
    await updateDoc(doc(db, "users", id), { banned: false });
    toast.success("User unbanned!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
    toast.success("User deleted!");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">👑 Super Admin Dashboard</h1>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <>
          {/* ADMINS */}
          <Card className="p-4 mb-6 shadow-md">
            <h2 className="text-xl font-bold mb-3">🛡️ State Admins</h2>
            {admins.length === 0 ? (
              <p>No Admins found.</p>
            ) : (
              admins.map((a) => (
                <div
                  key={a.id}
                  className="border rounded p-3 mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{a.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {a.email} — {a.state}
                    </p>
                    <p className="text-xs">
                      Approved: {a.approved ? "✅ Yes" : "❌ No"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!a.approved && (
                      <Button onClick={() => handleApprove(a.id)} size="sm">
                        Approve
                      </Button>
                    )}
                    <Button
                      onClick={() => handleBan(a.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Ban
                    </Button>
                    <Button onClick={() => handleDelete(a.id)} size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card>

          {/* STAFF */}
          <Card className="p-4 mb-6 shadow-md">
            <h2 className="text-xl font-bold mb-3">👷 LGA Staff</h2>
            {staffs.length === 0 ? (
              <p>No Staff found.</p>
            ) : (
              staffs.map((s) => (
                <div
                  key={s.id}
                  className="border rounded p-3 mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{s.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {s.email} — {s.lga}
                    </p>
                    <p className="text-xs">
                      Banned: {s.banned ? "🚫 Yes" : "✅ No"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {s.banned ? (
                      <Button onClick={() => handleUnban(s.id)} size="sm">
                        Unban
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBan(s.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </Card>

          {/* VENDORS */}
          <Card className="p-4 mb-6 shadow-md">
            <h2 className="text-xl font-bold mb-3">🏪 Vendors</h2>
            {vendors.length === 0 ? (
              <p>No Vendors found.</p>
            ) : (
              vendors.map((v) => (
                <div
                  key={v.id}
                  className="border rounded p-3 mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{v.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {v.email} — {v.lga}, {v.state}
                    </p>
                    <p className="text-xs">
                      Banned: {v.banned ? "🚫 Yes" : "✅ No"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {v.banned ? (
                      <Button onClick={() => handleUnban(v.id)} size="sm">
                        Unban
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBan(v.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </Card>
        </>
      )}
    </div>
  );
                    }
