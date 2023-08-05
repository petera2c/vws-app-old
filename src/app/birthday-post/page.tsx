"use client";
import React, { useContext, useState } from "react";

import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import Page from "@/components/containers/Page/Page";
import Container from "@/components/containers/Container/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import NewVentComponent from "@/components/NewVent/NewVent";

const NewVentPage = () => {
  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(!user);

  return (
    <Page className="pa16" title="Happy Birthday!">
      <Container>
        <Container className="column flex-fill gap16">
          <Container className="full-center gap8">
            <h1 className="tac">Happy Birthday! ☺️ ☺️</h1>
            <FontAwesomeIcon className="blue" icon={faBirthdayCake} size="5x" />
          </Container>
          <NewVentComponent
            isBirthdayPost
            ventID={search ? search.substring(1) : null}
          />
        </Container>
        <SubscribeColumn slot="3226323822" />
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
};

export default NewVentPage;
