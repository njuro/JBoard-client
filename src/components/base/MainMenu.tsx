import React, { useContext, useEffect, useState } from "react";
import { Button, Menu } from "semantic-ui-react";
import { getApiRequest } from "../../helpers/api";
import {
  BOARD_URL,
  BOARDS_URL,
  DASHBOARD_URL,
  HOME_URL,
  LOGIN_URL,
} from "../../helpers/mappings";
import { BoardType } from "../../types";
import { AppContext } from "../App";
import LogoutButton from "../user/LogoutButton";
import { MainMenuItem as MenuItem } from "./MenuItem";

function MainMenu() {
  const { user, activeMenuPath } = useContext(AppContext);
  const [boards, setBoards] = useState<BoardType[]>([]);

  useEffect(() => {
    getApiRequest<BoardType[]>(BOARDS_URL).then(setBoards);
  }, []);

  return (
    <Menu>
      <MenuItem path={HOME_URL}>
        <strong>jard</strong>
      </MenuItem>
      {boards.map((board) => (
        <MenuItem
          key={board.label}
          path={BOARD_URL(board)}
          active={activeMenuPath === board.label}
        >
          /{board.label}/ - {board.name}
        </MenuItem>
      ))}
      {!user && (
        <MenuItem position="right" path={LOGIN_URL}>
          <Button>Login</Button>
        </MenuItem>
      )}
      {user && (
        <Menu.Menu position="right">
          <MenuItem path={DASHBOARD_URL}>
            <Button>Dashboard</Button>
          </MenuItem>
          <MenuItem>
            <LogoutButton />
          </MenuItem>
        </Menu.Menu>
      )}
    </Menu>
  );
}

export default MainMenu;
