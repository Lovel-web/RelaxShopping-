import { Handler } from "@netlify/functions";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fetch from "node-fetch";
import * as XLSX from "xlsx";

initializeApp();
const db = getFirestore();

export const handler: Handler = async (event) => {
  const { fileUrl, vendorId } = JSON.parse(event.body || "{}");

  if (!fileUrl || !vendorId) {
    return { statusCode: 400, body: "Missing data" };
  }

  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const batch = db.batch();
  data.forEach((item: any) => {
    const ref = db.collection("products").doc();
    batch.set(ref, {
      name: item.name || item.product,
      price: Number(item.price) || 0,
      unit: item.unit || "pcs",
      stock: Number(item.stock) || 0,
      vendorId,
      createdAt: new Date(),
    });
  });

  await batch.commit();
  return { statusCode: 200, body: "Products added successfully" };
};
