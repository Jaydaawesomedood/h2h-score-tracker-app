import Modal from "@/components/_ui/modal/Modal";
import SelectH2HBody from "@/components/views/modals/select-h2h-partner/SelectH2HPartnerBody";

interface ISelectH2HModal {
  isVisible: boolean,
  onCloseModal: () => void,
  bodyProps: any,
}

export default function SelectH2HModal(props: ISelectH2HModal) {
  return (
    <Modal
      visible={props.isVisible}
      onClose={props.onCloseModal}
      height={'100%'}
    >
      <Modal.Header
        title={props.bodyProps?.type === 'partner' ? "Partners" : "Opponents"}
        onCloseModal={props.onCloseModal}
      >
      </Modal.Header>
      <Modal.Body>
        <SelectH2HBody {...props.bodyProps} />
      </Modal.Body>
    </Modal>
  );
}