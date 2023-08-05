"use client";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Container from "../../../components/containers/Container";
import Page from "../../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../../components/Vent";

import { getIsMobileOrTablet } from "../../util";
import { getMeta } from "../vents/util";

const getVentIdFromURL = (pathname) => {
  if (pathname) {
    const ventIdStart = pathname.slice(6, pathname.length);
    let ventID = "";
    for (let index in ventIdStart) {
      if (ventIdStart[index] === "/") break;
      ventID += ventIdStart[index];
    }

    return ventID;
  }
};

function VentPage() {
  const location = useLocation();
  const { pathname } = location;

  const [title, setTitle] = useState("");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [ventFound, setVentFound] = useState();

  const objectFromMetaData = getMeta("vent-data");
  let ventFromMeta;
  if (objectFromMetaData && objectFromMetaData !== "vent-data-example")
    ventFromMeta = JSON.parse(objectFromMetaData);

  const regexMatch = getVentIdFromURL(pathname);
  let ventID;
  if (regexMatch) ventID = regexMatch;

  if (ventFromMeta && ventFromMeta.id !== ventID) ventFromMeta = null;

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, []);

  return (
    <Page className="px16 pt16" title={title}>
      <Container>
        {ventFound === false && <h4>Vent Not Found</h4>}
        {ventFound === undefined && ventID && (
          <Container
            className="column flex-fill"
            style={{ maxWidth: isMobileOrTablet ? "" : "calc(100% - 316px)" }}
          >
            <Vent
              disablePostOnClick={true}
              displayCommentField
              isOnSingleVentPage={true}
              setTitle={setTitle}
              setVentFound={setVentFound}
              ventID={ventID}
              ventInit={ventFromMeta}
            />
          </Container>
        )}
        <SubscribeColumn slot="3336443960" />
      </Container>
    </Page>
  );
}

export default VentPage;
