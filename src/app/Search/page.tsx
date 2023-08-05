"use client";
import React, { useEffect, useState } from "react";
// import algoliasearch from "algoliasearch";
import { Space } from "antd";

import { capitolizeFirstChar, getIsMobileOrTablet } from "../../util";
// import { searchVents } from "./util";

// const searchClient = algoliasearch(
//   "N7KIA5G22X",
//   "a2fa8c0a85b2020696d2da1780d7dfdb"
// );
// const usersIndex = searchClient.initIndex("users");

function SearchPage() {
  let search = location.search
    ? decodeURI(location.search.substring(1, location.search.length))
    : "";

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>();
  const [isUsers, setIsUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [vents, setVents] = useState([]);

  // useEffect(() => {
  //   setIsMobileOrTablet(getIsMobileOrTablet());

  //   if (isUsers) {
  //     usersIndex
  //       .search(search, {
  //         hitsPerPage: 5,
  //       })
  //       .then(({ hits }) => {
  //         setUsers(hits);
  //       });
  //   } else {
  //     searchVents(search, setVents);
  //   }
  // }, [search, isUsers]);
  return <></>;

  // return (
  //   <Page className="align-center bg-blue-2" title={search ? search : "Search"}>
  //     <Container className="gap16">
  //       <button
  //         className={
  //           "button-2 no-bold py8 px16 my16 br8 " + (isUsers ? "active" : "")
  //         }
  //         onClick={() => setIsUsers(true)}
  //       >
  //         Users
  //       </button>
  //       <button
  //         className={
  //           "button-2 no-bold py8 px16 my16 br8 " + (isUsers ? "" : "active")
  //         }
  //         onClick={() => setIsUsers(false)}
  //       >
  //         Vents
  //       </button>
  //     </Container>
  //     {isUsers && (
  //       <Container
  //         className={
  //           "wrap full-center gap32 " +
  //           (isMobileOrTablet
  //             ? "container mobile-full px16"
  //             : "container large px16")
  //         }
  //       >
  //         {users &&
  //           users.map((user) => {
  //             const displayName = user.displayName
  //               ? capitolizeFirstChar(user.displayName)
  //               : "Anonymous";

  //             return (
  //               <User
  //                 displayName={displayName}
  //                 key={user.objectID}
  //                 showAdditionaluserInformation={false}
  //                 showMessageUser={false}
  //                 userID={user.objectID}
  //               />
  //             );
  //           })}
  //         {!users && <LoadingHeart />}
  //         {users && users.length === 0 && (
  //           <h4 className="fw-400">No users found.</h4>
  //         )}
  //       </Container>
  //     )}
  //     {!isUsers && (
  //       <Container
  //         className={
  //           "column align-center py32 " +
  //           (isMobileOrTablet
  //             ? "container mobile-full px16"
  //             : "container large px16")
  //         }
  //       >
  //         {vents && (
  //           <Space className="x-fill" direction="vertical" size="middle">
  //             {vents &&
  //               vents.map((vent, index) => (
  //                 <Vent
  //                   key={vent.objectID}
  //                   previewMode={true}
  //                   showVentHeader={false}
  //                   ventID={vent.objectID}
  //                   ventIndex={index}
  //                   ventInit={{ ...vent, id: vent.objectID }}
  //                   searchPreviewMode={true}
  //                 />
  //               ))}
  //           </Space>
  //         )}
  //         {!vents && <LoadingHeart />}
  //         {vents && vents.length === 0 && (
  //           <h4 className="fw-400">No vents found.</h4>
  //         )}
  //       </Container>
  //     )}
  //   </Page>
  // );
}

export default SearchPage;
