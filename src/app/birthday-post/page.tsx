"use client";
import React, { useContext } from "react";

import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import Page from "@/components/containers/Page/Page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import NewVentComponent from "@/components/NewVent/NewVent";

const NewVentPage = () => {
  const { user } = useContext(UserContext);

  const { search } = location;

  return (
    <Page className="p-4" title="Happy Birthday!">
      <div className="flex">
        <div className="flex flex-col grow gap-4">
          <div className="full-center gap-2">
            <h1 className="text-center">Happy Birthday! ☺️ ☺️</h1>
            <FontAwesomeIcon className="blue" icon={faBirthdayCake} size="5x" />
          </div>
          <NewVentComponent
            isBirthdayPost
            ventID={search ? search.substring(1) : null}
          />
        </div>
        <SubscribeColumn slot="3226323822" />
      </div>
    </Page>
  );
};

export default NewVentPage;
