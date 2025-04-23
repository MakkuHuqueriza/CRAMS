import React from "react";
import { adminLogoutAction } from "@/actions/admin";

function page() {
  return (
    <div>
      <button onClick={adminLogoutAction}>Logout</button>
      Hello Admin
    </div>
  );
}

export default page;
