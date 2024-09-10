// Button is used from Shadcn/ui from https://ui.shadcn.com/docs/components/button
import { Button } from "../components/ui/button"
import Link from "next/link"


export default function Home() {
  return (
    <div>
      <h1 className="text-5xl text-center pt-10 text-white">Welcome to Fragments-ui</h1>

      <h1 className="text-3xl text-center pt-10 text-white">Hello Username (Only show if logged in)</h1>

      <div className="flex justify-center pt-7">

        {/* Hide the div login if logged in and vice versa for logout */}
        <div className="pr-2">
          <Button variant="outline">Login</Button>
        </div>

        <div className="pl-2">
          <Button variant="destructive">Logout</Button>
        </div>

      </div>


    </div>
  );
}
