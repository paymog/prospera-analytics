import Head from "next/head";
import { bankBalances, legalEntities } from "@/data";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const LegalEntityChart = dynamic(
  () =>
    import("@/components/LegalEntityChart").then((mod) => mod.LegalEntityChart),
  { ssr: false }
);
const BankChart = dynamic(
  () => import("@/components/BankChart").then((mod) => mod.BankChart),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Prospera Info</title>
      </Head>
      <div className="bg-blue-800  px-4">
        {" "}
        <div className="relative h-12 w-36">
          <Image
            alt="Prospera"
            src="/prospera.png"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="p-4 bg-gray-100">
        <div className="mb-4 bg-white rounded-lg p-4 shadow-lg">
          <BankChart bankData={bankBalances} />
        </div>
        <div className="mb-4 bg-white rounded-lg p-4 shadow-lg">
          <LegalEntityChart legalEntities={legalEntities} />
        </div>
      </div>
    </>
  );
}
