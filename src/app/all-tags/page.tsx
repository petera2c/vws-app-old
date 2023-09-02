"use client";
import React, { useEffect, useState } from "react";

import SubscribeColumn from "../../components/SubscribeColumn";

import { getTags } from "./util";
import Page from "@/components/containers/Page/Page";
import Link from "next/link";
import Tag from "@/types/Tag";

const AllTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags(setTags);
  }, [setTags, tags]);

  return (
    <Page className="br-grey-2 pt32 px16 pb16">
      <div>
        <div className="flex flex-col grow gap16">
          <div className="flex flex-col bg-white br8 gap16 pa32">
            <h1 className="text-center lh-1">All Tag Categories</h1>
            <p className="text-center">
              Click on a category to find problems just like yours
            </p>
          </div>
          <div className="full-center wrap gap16">
            {tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
        <SubscribeColumn slot="3294940691" />
      </div>
    </Page>
  );
};

function Tag({ tag }: { tag: Tag }) {
  return (
    <Link
      className="button-8 flex flex-col full-center bg-white br8 gap8 pa32"
      href={`/tags/${tag.id}`}
    >
      <h2 className="ic text-center">{tag.display}</h2>
      <p className="ic text-center">{tag.uses ? tag.uses : 0}</p>
    </Link>
  );
}

export default AllTags;
