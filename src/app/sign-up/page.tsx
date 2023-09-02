"use client";
import React, { useState } from "react";

import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";
import Page from "@/components/containers/Page/Page";

function SignUpPage() {
  const [starterModal, setStarterModal] = useState(true);

  return (
    <Page className="pa16" title="Sign Up">
      <div>
        <div className="grow full-center bg-white pa16 br8">
          <h1
            className="grey-1 clickable text-center"
            onClick={() => setStarterModal(true)}
          >
            Please <span className="blue">sign in</span> to view your profile :)
          </h1>
        </div>
        <SubscribeColumn slot="2023362297" />
      </div>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default SignUpPage;
