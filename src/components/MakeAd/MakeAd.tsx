// import AdSense from "react-adsense";

import Container from "../containers/Container/Container";

function MakeAd({ banner, className, layoutKey, slot }: any) {
  if (banner) {
    if (process.env.NODE_ENV === "production")
      return (
        <Container className={"x-fill column " + className}>
          {/* <AdSense.Google
            className="adsbygoogle"
            client="ca-pub-5185907024931065"
            format="fluid"
            layoutKey={layoutKey}
            responsive="true"
            slot={slot}
            style={{
              display: "block",
              minWidth: "240px",
              width: "100%",
              maxWidth: "1000px",
              minHeight: "100px",
              height: "180px",
              maxHeight: "300px",
            }}
          /> */}
        </Container>
      );
    else
      return (
        <Container
          className={"x-fill full-center test3 br8 " + className}
          style={{
            minWidth: "100px",
            width: "100%",
            maxWidth: "1000px",
            minHeight: "100px",
            height: "180px",
            maxHeight: "800px",
          }}
        >
          <h1>Ad</h1>
        </Container>
      );
  } else {
    if (process.env.NODE_ENV === "production")
      return (
        <Container className={"x-fill " + className}>
          {/* <AdSense.Google
            className="adsbygoogle"
            client="ca-pub-5185907024931065"
            format=""
            responsive="true"
            slot={slot}
            style={{
              display: "block",
              minWidth: "100px",
              width: "100%",
              maxWidth: "1000px",
              minHeight: "100px",
              height: "240px",
              maxHeight: "800px",
            }}
          /> */}
        </Container>
      );
    else
      return (
        <Container
          className={"full-center test3 br8 " + className}
          style={{
            minWidth: "100px",
            width: "100%",
            maxWidth: "1000px",
            minHeight: "100px",
            height: "240px",
            maxHeight: "800px",
          }}
        >
          <h1>Ad</h1>
        </Container>
      );
  }
}

export default MakeAd;
