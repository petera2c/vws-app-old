"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";

import Container from "../../../components/containers/Container";
import Page from "../../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../../components/Vent";

import { useIsMounted, viewTagFunction } from "../../util";
import { getTagVents } from "./util";

function IndividualTag() {
  const { tagID } = useParams();
  const isMounted = useIsMounted();

  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [vents, setVents] = useState([]);

  useEffect(() => {
    getTagVents(isMounted, setCanLoadMoreVents, setVents, tagID);
  }, [isMounted, setVents, tagID]);

  return (
    <Page
      className="br-grey-2 pt32 px16 pb16"
      description={
        "Read vents about " +
        viewTagFunction(tagID) +
        ". Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback."
      }
      keywords={viewTagFunction(tagID)}
      title={`Vents About ${viewTagFunction(tagID)}`}
    >
      <Container>
        <Container className="column flex-fill gap16">
          <Container className="column bg-white br8 gap16 pa32">
            <h1 className="tac">{`Recent Vents About ${viewTagFunction(
              tagID
            )}`}</h1>
            <Link className="button-1 fs-22 tac" to="/tags">
              View All Tags
            </Link>
          </Container>
          <Container className="column gap8">
            {vents.map((vent, index) => (
              <Vent
                key={vent.id}
                previewMode={true}
                showVentHeader={false}
                ventID={vent.id}
                ventIndex={index}
                ventInit={{ ...vent, id: vent.id }}
              />
            ))}
          </Container>
          {canLoadMoreVents && (
            <Button
              onClick={() => {
                getTagVents(
                  isMounted,
                  setCanLoadMoreVents,
                  setVents,
                  tagID,
                  vents
                );
              }}
              size="large"
              type="primary"
            >
              Load More Vents
            </Button>
          )}
        </Container>
        <SubscribeColumn slot="3444073995" />
      </Container>
    </Page>
  );
}

export default IndividualTag;
