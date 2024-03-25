import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ open, currentModal, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      className="modal"
      ref={dialog}
      onClose={currentModal === "cart" ? onClose : null}
    >
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
