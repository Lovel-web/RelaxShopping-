// src/pages/Profile.tsx
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { profile, firebaseUser, logout } = useAuth();

  if (!firebaseUser) {
    return <div className="p-6">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile?.name || "-"}</p>
        <p><strong>Email:</strong> {profile?.email || firebaseUser.email}</p>
        <p><strong>Phone:</strong> {profile?.phone || "-"}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
        <p><strong>State:</strong> {profile?.state || "-"}</p>
        <p><strong>LGA:</strong> {profile?.lga || "-"}</p>
        <p><strong>Estate/Hotel:</strong> {profile?.estateOrHotel || "-"}</p>
      </div>

      <div className="mt-4">
        <Button onClick={() => logout()}>Logout</Button>
      </div>
    </div>
  );
}
