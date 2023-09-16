"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";

import SubscribeColumn from "../../components/SubscribeColumn";

import { viewTagFunction } from "../../util";
import { getTagVents } from "./util";
import Link from "next/link";
import Page from "@/components/containers/Page/Page";
import { useParams } from "next/navigation";
import Vent from "@/components/Vent/Vent";
import VentType from "@/types/VentType";

function IndividualTag() {
  const { tagID } = useParams();

  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [vents, setVents] = useState<VentType[]>([]);

  useEffect(() => {
    getTagVents(setCanLoadMoreVents, setVents, tagID);
  }, [setVents, tagID]);

  return (
    <Page
      className="br-grey-2 pt-8 px-4 pb-4"
      description={
        "Read vents about " +
        viewTagFunction(tagID) +
        ". Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback."
      }
      keywords={viewTagFunction(tagID)}
      title={`Vents About ${viewTagFunction(tagID)}`}
    >
      <div className="flex">
        <div className="flex flex-col grow gap-4">
          <div className="flex flex-col bg-white br8 gap-4 p-8">
            <h1 className="text-center">{`Recent Vents About ${viewTagFunction(
              tagID
            )}`}</h1>
            <Link className="button-1 fs-22 text-center" href="/tags">
              View All Tags
            </Link>
          </div>
          <div className="flex flex-col gap-2">
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
          </div>
          {canLoadMoreVents && (
            <Button
              onClick={() => {
                getTagVents(setCanLoadMoreVents, setVents, tagID, vents);
              }}
              size="large"
              type="primary"
            >
              Load More Vents
            </Button>
          )}
        </div>
        <SubscribeColumn slot="3444073995" />
      </div>
    </Page>
  );
}

export default IndividualTag;
