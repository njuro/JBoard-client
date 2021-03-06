import React, { useContext, useEffect, useState } from "react";
import { Button, Menu } from "semantic-ui-react";
import { apiErrorHandler, getApiRequest } from "../../helpers/api";
import {
  BOARD_URL,
  BOARDS_URL,
  DASHBOARD_URL,
  HOME_URL,
  LOGIN_URL,
  SEARCH_URL,
} from "../../helpers/mappings";
import { BoardType } from "../../types";
import { AppContext } from "../App";
import LogoutButton from "../user/LogoutButton";
import { MainMenuItem as MenuItem } from "./MenuItem";
import { isLocalhost } from "../../helpers/utils";

function MainMenu() {
  const { user, activeMenuPath } = useContext(AppContext);
  const [boards, setBoards] = useState<BoardType[]>([]);

  useEffect(() => {
    getApiRequest<BoardType[]>(BOARDS_URL)
      .then(setBoards)
      .catch(apiErrorHandler);
  }, []);

  return (
    <Menu stackable>
      <MenuItem path={HOME_URL}>
        <strong>jard</strong>
      </MenuItem>
      {boards.map((board) => (
        <MenuItem
          key={board.label}
          path={`${BOARD_URL(board)}/`}
          active={activeMenuPath === board.label}
        >
          /{board.label}/ - {board.name}
        </MenuItem>
      ))}
      <Menu.Menu position="right">
        <MenuItem position="right" path={SEARCH_URL}>
          Search
        </MenuItem>
        {user && (
          <>
            <MenuItem path={DASHBOARD_URL}>Dashboard</MenuItem>
            <MenuItem>
              <LogoutButton />
            </MenuItem>
          </>
        )}
        {!user && isLocalhost() && (
          <MenuItem position="right" path={LOGIN_URL}>
            <Button>Login</Button>
          </MenuItem>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default MainMenu;
