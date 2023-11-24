import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");

  return <div>Secure File Share</div>;
}
