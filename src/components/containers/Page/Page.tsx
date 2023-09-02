import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";

import { usePathname, useSearchParams } from "next/navigation";
import { getMetaData } from "./util";

const Page = ({
  children,
  className,
  description,
  id,
  keywords,
  style,
  title,
}: any) => {
  const pathname = usePathname();
  const search = useSearchParams();
  const [description2, setDescription2] = useState("");
  const [keywords2, setkeywords2] = useState("");
  const [title2, settitle2] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
      ReactGA.pageview(pathname);
    }
    const { description, keywords, title } = getMetaData(pathname, "search");
    if (description) setDescription2(description);
    if (keywords) setkeywords2(keywords);
    if (title) settitle2(title);

    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div
      className={"flex flex-col grow overflow-auto bg-blue-2 " + className}
      id={id}
      style={style}
    >
      {/* <Helmet defer={false}>
        <meta charSet="utf-8" />
        {(title || title2) && <title>{title ? title : title2}</title>}
        {(title || title2) && (
          <meta content={title ? title : title2} name="title" />
        )}
        {(title || title2) && (
          <meta content={title ? title : title2} name="og:title" />
        )}
        {(description || description2) && (
          <meta
            content={description ? description : description2}
            name="description"
          />
        )}
        {(description || description2) && (
          <meta
            content={description ? description : description2}
            name="og:description"
          />
        )}
        {(keywords || keywords2) && (
          <meta content={keywords ? keywords : keywords2} name="keywords" />
        )}
      </Helmet> */}

      {children}
    </div>
  );
};

export default Page;
