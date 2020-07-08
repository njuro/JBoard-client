import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Checkbox, Grid, Input, Menu, Select } from "semantic-ui-react";
import styled from "styled-components";
import { getApiRequest } from "../../helpers/api";
import { BOARDS_URL } from "../../helpers/mappings";
import useUpdater from "../../helpers/updater";
import { BoardType, ThreadCatalogType } from "../../types";
import ThreadCatalog from "../thread/ThreadCatalog";
import ThreadForm from "../thread/ThreadForm";
import { BoardContext } from "./Board";
import BoardHeader from "./BoardHeader";
import NotFound from "../utils/NotFound";

const ThreadList = styled(Grid)`
  padding: 20px !important;
  text-align: center;
  min-width: 100% !important;
`;

function BoardCatalog(props: RouteComponentProps<{ label: string }>) {
  const { label } = props.match.params;
  const [board, setBoard] = useState<BoardType>();
  const [threads, setThreads] = useState<ThreadCatalogType[]>([]);
  const [showOP, setShowOP] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  const refreshCatalog = useUpdater();

  useEffect(() => {
    getApiRequest<BoardType>(`${BOARDS_URL}/${label}/catalog`)
      .then((result) => {
        setBoard(result);
        setThreads(result.threads!);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setNotFound(true);
        }
      });
  }, [label, setBoard]);

  if (notFound) {
    return <NotFound />;
  }

  function filterThreads(query: string) {
    if (query && query.trim()) {
      setThreads(
        threads.filter((thread) =>
          thread.originalPost.body
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        )
      );
    } else if (board) {
      setThreads(board.threads!);
    }
  }

  function sortThreads(sort: string) {
    let sortFn: (thread: ThreadCatalogType) => any = (thread) =>
      thread.lastBumpAt;
    switch (sort) {
      case "lastBump":
        sortFn = (thread) => thread.lastBumpAt;
        break;
      case "lastReply":
        sortFn = (thread) => thread.lastReplyAt;
        break;
      case "creationDate":
        sortFn = (thread) => thread.createdAt;
        break;
      case "replyCount":
        sortFn = (thread) => thread.statistics.replyCount;
        break;
      default:
    }

    if (sortFn) {
      threads.sort((t1, t2) => {
        if (sortFn(t1) > sortFn(t2)) return -1;
        if (sortFn(t1) < sortFn(t2)) return 1;
        return 0;
      });
      refreshCatalog();
    }
  }

  return (
    (board && (
      <BoardContext.Provider value={board}>
        <BoardHeader catalog />
        <ThreadForm />
        <Menu horizontal>
          <Menu.Item position="right">
            <Select
              placeholder="Sort by"
              options={[
                {
                  key: "lastBump",
                  value: "lastBump",
                  text: "Last bump",
                },
                {
                  key: "lastReply",
                  value: "lastReply",
                  text: "Last reply",
                },
                {
                  key: "creationDate",
                  value: "creationDate",
                  text: "Creation date",
                },
                { key: "replyCount", value: "replyCount", text: "Reply count" },
              ]}
              defaultValue="lastBump"
              onChange={(_, data) => sortThreads(data.value as string)}
            />
          </Menu.Item>
          <Menu.Item position="right">
            <Checkbox
              toggle
              checked={showOP}
              onChange={() => setShowOP(!showOP)}
              label="Show OP?"
            />
          </Menu.Item>
          <Menu.Item position="right">
            <Input
              onChange={(_, data) => filterThreads(data.value)}
              placeholder="Search in threads..."
            />
          </Menu.Item>
        </Menu>

        <ThreadList container relaxed>
          <ThreadList.Row columns={10}>
            {threads.map((thread) => (
              <ThreadCatalog
                board={board}
                thread={thread}
                key={thread.originalPost.postNumber}
                showOP={showOP}
              />
            ))}
          </ThreadList.Row>
        </ThreadList>
      </BoardContext.Provider>
    )) ||
    null
  );
}

export default BoardCatalog;
