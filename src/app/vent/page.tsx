"use client";
import React, { useEffect, useState } from "react";

import { useIsMobileOrTablet } from "../../util";
import { getMeta } from "../vents/util";
import { usePathname } from "next/navigation";
import Page from "@/components/containers/Page/Page";
import Vent from "@/components/Vent/Vent";
import SubscribeColumn from "@/components/SubscribeColumn";

const getVentIdFromURL = (pathname: string) => {
  if (pathname) {
    const ventIdStart = pathname.slice(6, pathname.length);
    let ventID = "";
    for (let char of ventIdStart) {
      if (char === "/") break;
      ventID += char;
    }

    return ventID;
  }
};

const VentPage = () => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const pathname = usePathname();

  const [title, setTitle] = useState("");
  const [ventFound, setVentFound] = useState();

  const objectFromMetaData = getMeta("vent-data");
  let ventFromMeta;
  if (objectFromMetaData && objectFromMetaData !== "vent-data-example")
    ventFromMeta = JSON.parse(objectFromMetaData);

  const regexMatch = getVentIdFromURL(pathname);
  let ventID;
  if (regexMatch) ventID = regexMatch;

  if (ventFromMeta && ventFromMeta.id !== ventID) ventFromMeta = null;

  return (
    <Page className="px-4 pt-4" title={title}>
      <div className="flex">
        {ventFound === false && <h4>Vent Not Found</h4>}
        {ventFound === undefined && ventID && (
          <div
            className="flex flex-col grow"
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
          </div>
        )}
        <SubscribeColumn slot="3336443960" />
      </div>
    </Page>
  );
};

export default VentPage;
