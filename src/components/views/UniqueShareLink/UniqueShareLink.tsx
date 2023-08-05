import React, { useEffect, useState } from "react";
import { Button, message } from "antd";

import Container from "../../containers/Container/Container";

import { useIsMounted } from "../../../util";
import { createShareLink, getSecondUID } from "./util";

function UniqueShareLink({ user }: { user: any }) {
  const isMounted = useIsMounted();
  const [secondUID, setSecondUID] = useState("");

  useEffect(() => {
    if (user) {
      getSecondUID(isMounted, setSecondUID, user.uid);
    }
  }, [isMounted, user]);

  return (
    <Container className="x-fill align-start gap8">
      <Container className="column align-center bg-white br8 gap8 pa16">
        <h4 className="tac">Gain 100 karma points!</h4>
        <p className="tac">
          Share our site! No one will know your profile or username from your
          unique link. Upon a user signing up from your link you will receive
          100 karma points :)
        </p>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(createShareLink(secondUID));
            message.success("Copied Successfully :)");
          }}
          size="large"
          type="primary"
        >
          Get Share Link!
        </Button>
      </Container>
    </Container>
  );
}

export default UniqueShareLink;
