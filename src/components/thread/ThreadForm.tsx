import React, { useContext, useState } from "react";
import { Form as SemanticForm, Header, Icon, Modal } from "semantic-ui-react";
import { putApiRequest } from "../../helpers/api";
import { Redirect } from "react-router-dom";
import Form, {
  Button,
  FileInput,
  FormErrors,
  TextArea,
  TextInput
} from "../form/Form";
import { BoardContext } from "../board/Board";
import { objectToJsonBlob } from "../../helpers/forms";
import { BOARD_URL } from "../../helpers/mappings";
import { ThreadType } from "../../types";

function ThreadForm() {
  const board = useContext(BoardContext);

  const [attachment, setAttachment] = useState<File>();
  const [createdThread, setCreatedThread] = useState<ThreadType>();
  const [errors, setErrors] = useState<string[]>();

  function handleSubmit(thread: ThreadType) {
    const threadForm = new FormData();
    threadForm.append("threadForm", objectToJsonBlob(thread));
    threadForm.append("attachment", attachment!);

    putApiRequest<ThreadType>(BOARD_URL(board), threadForm)
      .then(thread => setCreatedThread(thread))
      .catch(err => setErrors(err.response.data.errors));
  }

  if (createdThread) {
    return (
      <Redirect
        to={`/boards/${board.label}/${createdThread.originalPost.postNumber}`}
      />
    );
  }

  return (
    <Modal
      style={{ paddingBottom: "10px" }}
      trigger={
        <Button basic size="small">
          <Icon name="plus" />
          <strong>New thread</strong>
        </Button>
      }
    >
      <Modal.Content>
        <Form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          error={errors !== undefined}
        >
          <Header as="h4" dividing>
            Create new thread
          </Header>
          <SemanticForm.Group widths="equal">
            <TextInput
              fluid
              name="postForm.name"
              label="Name"
              placeholder="Name"
            />
            <TextInput
              fluid
              name="postForm.password"
              label="Tripcode password"
              placeholder="Password"
            />
          </SemanticForm.Group>
          <TextInput name="subject" label="Subject" placeholder="Subject" />
          <TextArea name="postForm.body" label="Comment" rows="8" />
          <FileInput
            name="attachment"
            label="Upload image"
            accept="image/*"
            onFileUpload={setAttachment}
            required
          />
          <FormErrors errors={errors} />
          <Button floated="right">Create thread</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default ThreadForm;