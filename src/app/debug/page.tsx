import { headers } from "next/headers";

export default async function DebugPage() {
  const headersList = await headers(); 
  const host = headersList.get("host");

  return (
    <div className="p-8">
      <h1>Debug Info</h1>
      <p>Host: {host}</p>
      <p>Base Domain: {process.env.NEXT_PUBLIC_BASE_DOMAIN}</p>
      <p>Protocol: {process.env.NEXT_PUBLIC_PROTOCOL}</p>
      <p>Node Env: {process.env.NODE_ENV}</p>
    </div>
  );
}
