import { omit } from "lodash";
import React, { useEffect, useRef } from "react";

const HandleOutsideClickContainer = (props: {
  className?: string;
  children: any;
  close: any;
  style?: any;
}) => {
  const { children, close } = props;
  const someRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // @ts-ignore
      if (someRef && !someRef.current?.contains(event.target)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  const divProps = omit(props, ["close"]);
  return (
    <div ref={someRef} {...divProps}>
      {children}
    </div>
  );
};

export default HandleOutsideClickContainer;
