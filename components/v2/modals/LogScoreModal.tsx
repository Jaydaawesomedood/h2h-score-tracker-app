import Modal from "@/components/_ui/modal/Modal";
import LogScoreBody from "@/components/views/modals/log-score/LogScoreBody";
import LogScoreHeader from "@/components/views/modals/log-score/LogScoreHeader";
import { useLogScore } from "@/hooks/v2/useLogScore";

interface ILogScoreModalProps {
  isVisible: boolean,
  onCloseModal: () => void,
}

export default function LogScoreModal({ isVisible, onCloseModal }: ILogScoreModalProps) {
  const { reset } = useLogScore();

  const handleOnCloseModal = () => {
    reset();
    onCloseModal();
  }

  return (
    <Modal visible={isVisible} onClose={handleOnCloseModal} height={'85%'}>
      <Modal.Header>
        <LogScoreHeader onCloseModal={handleOnCloseModal} />
      </Modal.Header>
      <Modal.Body>
        <LogScoreBody onCloseModal={handleOnCloseModal} />
      </Modal.Body>
    </Modal>
  );
}