import React, { SyntheticEvent, useState } from "react";
import { Image } from "semantic-ui-react";
import { FileIcon, DefaultExtensionType, defaultStyles } from "react-file-icon";
import { Link } from "react-router-dom";
import { renderToString } from "react-dom/server";
import styled from "styled-components";
import { ATTACHMENT_THUMB_URL, ATTACHMENT_URL } from "../../helpers/mappings";
import { AttachmentType } from "../../types";

interface PostAttachmentProps {
  attachment: AttachmentType;
}

const FileIconWrapper = styled.div`
  width: 250px;
  height: 250px;
  & > * {
    width: 100%;
    height: 100%;
  }
`;
function PostAttachment({ attachment }: PostAttachmentProps) {
  const [showFull, setShowFull] = useState(false);

  function toggleSize(e: SyntheticEvent) {
    e.preventDefault();
    setShowFull(!showFull);
  }

  function renderThumbnail() {
    if (!attachment.category.hasThumbnail) {
      const ext = attachment.filename.split(".").pop();
      const fileIcon = (
        <FileIcon
          labelUppercase
          extension={ext!}
          {...defaultStyles[ext as DefaultExtensionType]}
        />
      );
      if (attachment.category.name === "AUDIO") {
        const svg = `data:image/svg+xml;utf8,${encodeURIComponent(
          renderToString(fileIcon)
        )}`;
        return (
          <FileIconWrapper>
            <video
              src={ATTACHMENT_URL(attachment)}
              poster={svg}
              controls
              loop
            />
          </FileIconWrapper>
        );
      }

      return (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          to={ATTACHMENT_URL(attachment)}
        >
          <FileIconWrapper>{fileIcon}</FileIconWrapper>
        </Link>
      );
    }

    return (
      <Image
        href={ATTACHMENT_URL(attachment)}
        target="_blank"
        rel="noopener noreferrer"
        verticalAlign="top"
        src={ATTACHMENT_THUMB_URL(attachment)}
        onClick={attachment.category.name === "PDF" || toggleSize}
      />
    );
  }

  function renderFull() {
    if (attachment.category.name === "VIDEO") {
      return <video src={ATTACHMENT_URL(attachment)} controls loop autoPlay />;
    }

    return (
      <Image
        href={ATTACHMENT_URL(attachment)}
        target="_blank"
        rel="noopener noreferrer"
        verticalAlign="top"
        src={ATTACHMENT_URL(attachment)}
        onClick={toggleSize}
      />
    );
  }

  return showFull ? renderFull() : renderThumbnail();
}

export default PostAttachment;
