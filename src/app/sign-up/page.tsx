"use client";
import React from "react";

import SubscribeColumn from "../../components/SubscribeColumn";
import Page from "@/components/containers/Page/Page";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";

function SignUpPage() {
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  return (
    <Page className="pa16" title="Sign Up">
      <div className="flex">
        <div className="grow full-center bg-white pa16 br8">
          <h1
            className="grey-1 cursor-pointer text-center"
            onClick={() => setStarterModal(true)}
          >
            Please <span className="blue">sign in</span> to view your profile :)
          </h1>
        </div>
        <SubscribeColumn slot="2023362297" />
      </div>
    </Page>
  );
}

export default SignUpPage;
