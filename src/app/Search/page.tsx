"use client";
import React, { useEffect, useState } from "react";
// import algoliasearch from "algoliasearch";
import { Space } from "antd";

import { capitolizeFirstChar, useIsMobileOrTablet } from "../../util";
// import { searchVents } from "./util";

// const searchClient = algoliasearch(
//   "N7KIA5G22X",
//   "a2fa8c0a85b2020696d2da1780d7dfdb"
// );
// const usersIndex = searchClient.initIndex("users");

const SearchPage = () => {
  let search = location.search
    ? decodeURI(location.search.substring(1, location.search.length))
    : "";
  const isMobileOrTablet = useIsMobileOrTablet();

  const [isUsers, setIsUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [vents, setVents] = useState([]);

  // useEffect(() => {

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
  //   <Page className="items-center bg-blue-2" title={search ? search : "Search"}>
  //     <div className="gap-4">
  //       <button
  //         className={
  //           "button-2 no-bold py-2 px-4 my-4 br8 " + (isUsers ? "active" : "")
  //         }
  //         onClick={() => setIsUsers(true)}
  //       >
  //         Users
  //       </button>
  //       <button
  //         className={
  //           "button-2 no-bold py-2 px-4 my-4 br8 " + (isUsers ? "" : "active")
  //         }
  //         onClick={() => setIsUsers(false)}
  //       >
  //         Vents
  //       </button>
  //     </div>
  //     {isUsers && (
  //       <div
  //         className={
  //           "flex-wrap full-center gap-8 " +
  //           (isMobileOrTablet
  //             ? "container mobile-full px-4"
  //             : "container large px-4")
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
  //       </div>
  //     )}
  //     {!isUsers && (
  //       <div
  //         className={
  //           "flex flex-col items-center py-8 " +
  //           (isMobileOrTablet
  //             ? "container mobile-full px-4"
  //             : "container large px-4")
  //         }
  //       >
  //         {vents && (
  //           <Space className="w-full" direction="vertical" size="middle">
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
  //       </div>
  //     )}
  //   </Page>
  // );
};

export default SearchPage;
