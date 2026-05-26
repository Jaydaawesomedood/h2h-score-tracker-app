import Modal from "@/components/_ui/modal/Modal";
import PartnerBody from "@/components/views/modals/partners/PartnerBody";

interface IPartnersStatsModal {
  isVisible: boolean,
  onCloseModal: () => void,
  bodyProps: any,
}

export default function PartnersStatsModal(props: IPartnersStatsModal) {
  return (
    <Modal
      visible={props.isVisible}
      onClose={props.onCloseModal}
      height={'80%'}
    >
      <Modal.Header
        title="Partners"
        onCloseModal={props.onCloseModal}
      >
      </Modal.Header>
      <Modal.Body>
        <PartnerBody {...props.bodyProps} />
      </Modal.Body>
    </Modal>
  );
}