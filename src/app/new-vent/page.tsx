"use client";
import React, { useContext, useEffect, useState } from "react";

import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import Page from "@/components/containers/Page/Page";
import NewVentComponent from "@/components/NewVent/NewVent";

function NewVentPage() {
  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setStarterModal(true);
    } else setStarterModal(false);
  }, [setStarterModal, user]);

  return (
    <Page className="pa16">
      <div className="flex">
        <div className="grow">
          <NewVentComponent ventID={search ? search.substring(1) : null} />
        </div>
        <SubscribeColumn slot="3872937497" />
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

export default NewVentPage;
