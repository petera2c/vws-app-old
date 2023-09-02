import React, { useEffect, useState } from "react";
import { Button, message } from "antd";

import { createShareLink, getSecondUID } from "./util";

function UniqueShareLink({ user }: { user: any }) {
  const [secondUID, setSecondUID] = useState("");

  useEffect(() => {
    if (user) {
      getSecondUID(setSecondUID, user.uid);
    }
  }, [user]);

  return (
    <div className="w-full items-start gap8">
      <div className="flex-col items-center bg-white br8 gap8 pa16">
        <h4 className="text-center">Gain 100 karma points!</h4>
        <p className="text-center">
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
      </div>
    </div>
  );
}

export default UniqueShareLink;
