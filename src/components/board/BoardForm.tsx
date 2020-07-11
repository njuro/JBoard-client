import React, { ReactNode, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { DropdownItemProps, Header, Modal } from "semantic-ui-react";
import {
  getApiRequest,
  postApiRequest,
  putApiRequest,
} from "../../helpers/api";
import { capitalize, objectToDropdownItem } from "../../helpers/utils";
import { BOARD_URL, BOARDS_URL } from "../../helpers/mappings";
import { AttachmentCategoryType, BoardType } from "../../types";
import Form, {
  Button,
  Checkbox,
  FormErrors,
  Select,
  TextInput,
} from "../form/Form";

interface BoardFormProps {
  trigger: ReactNode;
  value?: BoardType;
}
function BoardForm({ trigger, value: board }: BoardFormProps) {
  const isEdit = !!board;
  const [attachmentCategories, setAttachmentCategories] = useState<
    DropdownItemProps[]
  >([]);
  const [updatedBoard, setUpdatedBoard] = useState<BoardType>();
  const [errors, setErrors] = useState<object>();

  useEffect(() => {
    getApiRequest<AttachmentCategoryType[]>(
      `${BOARDS_URL}/attachment-categories`
    ).then((categories) =>
      setAttachmentCategories(
        categories.map((category) =>
          objectToDropdownItem(
            category.name,
            capitalize(category.name),
            category.extensions.join(", ")
          )
        )
      )
    );
  }, []);

  function handleSubmit(boardForm: BoardType) {
    const response = isEdit
      ? postApiRequest<BoardType>(`${BOARD_URL(board!)}/edit`, boardForm)
      : putApiRequest<BoardType>(BOARDS_URL, boardForm);
    response
      .then(setUpdatedBoard)
      .catch((err) => setErrors(err.response.data.errors));
  }

  if (updatedBoard) {
    return <Redirect to={BOARD_URL(updatedBoard)} />;
  }

  const defaultValues = isEdit
    ? {
        label: board?.label,
        name: board?.name,
        boardSettingsForm: {
          attachmentCategories: board?.settings.attachmentCategories.map(
            (category) => category.name
          ),
          nsfw: board?.settings.nsfw,
          threadLimit: board?.settings.threadLimit,
          bumpLimit: board?.settings.bumpLimit,
          defaultPosterName: board?.settings.defaultPosterName,
          forceDefaultPosterName: board?.settings.forceDefaultPosterName,
        },
      }
    : {};

  return (
    <Modal style={{ paddingBottom: "10px" }} trigger={trigger}>
      <Modal.Content>
        <Form
          onSubmit={handleSubmit}
          error={!!errors}
          defaultValues={defaultValues}
        >
          <Header as="h4" dividing>
            {isEdit ? `Edit board /${board?.label}/` : "Create new board"}
          </Header>
          <TextInput
            name="label"
            label="Label"
            placeholder="Label"
            required
            disabled={isEdit}
          />
          <TextInput name="name" label="Name" placeholder="Name" required />
          <TextInput
            name="boardSettingsForm.threadLimit"
            label="Thread limit"
            placeholder="Thread limit"
            type="number"
            required
          />
          <TextInput
            name="boardSettingsForm.bumpLimit"
            label="Bump limit"
            placeholder="Bump limit"
            type="number"
            required
          />
          <Select
            multiple
            name="boardSettingsForm.attachmentCategories"
            label="Allowed attachment categories"
            options={attachmentCategories}
            required
          />
          <TextInput
            name="boardSettingsForm.defaultPosterName"
            label="Default poster name"
            placeholder="Default poster name"
          />
          <Checkbox
            name="boardSettingsForm.forceDefaultPosterName"
            label="Force default poster name"
          />
          <Checkbox name="boardSettingsForm.nsfw" label="NSFW" />
          <FormErrors errors={errors} />
          <Button fluid>{isEdit ? "Update board" : "Create board"}</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default BoardForm;
