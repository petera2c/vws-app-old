"use client";
import React, { useContext, useEffect } from "react";

import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import Page from "@/components/containers/Page/Page";
import NewVentComponent from "@/components/NewVent/NewVent";
import { useRecoilState } from "recoil";
import { starterModalAtom } from "@/atoms/ModalVisibility";
import { useSearchParams } from "next/navigation";

const NewVentPage = () => {
  const { user } = useContext(UserContext);
  const [, setStarterModal] = useRecoilState(starterModalAtom);

  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (!user) {
      setStarterModal(true);
    } else setStarterModal(false);
  }, [setStarterModal, user]);

  return (
    <Page className="p-4">
      <div className="flex">
        <div className="grow">
          <NewVentComponent ventID={search ? search.substring(1) : null} />
        </div>
        <SubscribeColumn slot="3872937497" />
      </div>
    </Page>
  );
};

export default NewVentPage;
