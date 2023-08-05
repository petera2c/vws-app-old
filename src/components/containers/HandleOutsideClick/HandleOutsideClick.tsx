import React, { useEffect, useRef } from "react";

import Container from "../Container/Container";

function HandleOutsideClickContainer(props) {
  const { children, close } = props;
  const someRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (someRef && !someRef.current.contains(event.target)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  return (
    <Container forwardedRef2={someRef} {...props}>
      {children}
    </Container>
  );
}

export default HandleOutsideClickContainer;
