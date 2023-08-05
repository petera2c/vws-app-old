"use client";
import React, { useContext, useEffect, useState } from "react";

import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import Page from "@/components/containers/Page/Page";
import Container from "@/components/containers/Container/Container";
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
      <Container>
        <Container className="flex-fill">
          <NewVentComponent ventID={search ? search.substring(1) : null} />
        </Container>
        <SubscribeColumn slot="3872937497" />
      </Container>

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
