import React, { useState, useEffect } from "react";
import { Checkbox, Icon, Popup, Table } from "semantic-ui-react";
import { getApiRequest } from "../../helpers/api";
import { BOARDS_URL } from "../../helpers/mappings";

function BoardAdmin(props) {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    getApiRequest(BOARDS_URL).then(setBoards);
  }, []);

  return (
    <Table fixed striped>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell>Label</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Attachments</Table.HeaderCell>
          <Table.HeaderCell>NSFW</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {boards.map(board => {
          return (
            <Table.Row key={board.label} textAlign="center">
              <Table.Cell>/{board.label}/</Table.Cell>
              <Table.Cell>{board.name}</Table.Cell>
              <Table.Cell>{board.attachmentType}</Table.Cell>
              <Table.Cell>
                <Checkbox disabled checked={board.nsfw} />
              </Table.Cell>
              <Table.Cell>
                <Popup
                  content="Edit"
                  position="top right"
                  trigger={<Icon name="edit outline" />}
                />
                <Popup
                  content="Delete"
                  position="top left"
                  trigger={<Icon name="trash alternate outline" />}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default BoardAdmin;
