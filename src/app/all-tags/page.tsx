"use client";
import React, { useEffect, useState } from "react";

import SubscribeColumn from "../../components/SubscribeColumn";

import { useIsMounted } from "../../util";
import { getTags } from "./util";
import Page from "@/components/containers/Page/Page";
import Container from "@/components/containers/Container/Container";
import Link from "next/link";
import Tag from "@/types/Tag";

const AllTags = () => {
  const isMounted = useIsMounted();

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags(setTags);
  }, [isMounted, setTags, tags]);

  return (
    <Page className="br-grey-2 pt32 px16 pb16">
      <Container>
        <Container className="column flex-fill gap16">
          <Container className="column bg-white br8 gap16 pa32">
            <h1 className="tac lh-1">All Tag Categories</h1>
            <p className="tac">
              Click on a category to find problems just like yours
            </p>
          </Container>
          <Container className="full-center wrap gap16">
            {tags.map((tag) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </Container>
        </Container>
        <SubscribeColumn slot="3294940691" />
      </Container>
    </Page>
  );
};

function Tag({ tag }: { tag: Tag }) {
  return (
    <Link
      className="button-8 column full-center bg-white br8 gap8 pa32"
      href={`/tags/${tag.id}`}
    >
      <h2 className="ic tac">{tag.display}</h2>
      <p className="ic tac">{tag.uses ? tag.uses : 0}</p>
    </Link>
  );
}

export default AllTags;
