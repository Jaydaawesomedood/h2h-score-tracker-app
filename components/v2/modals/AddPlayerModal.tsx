import Modal from "@/components/_ui/modal/Modal";
import AddPlayerBody from "@/components/views/modals/add-player/AddPlayerBody";
import { ScrollView } from "react-native";

interface IAddPlayerModal {
  isVisible: boolean,
  onCloseModal: () => void,
}

export default function AddPlayerModal(props: IAddPlayerModal) {
  return (
    <Modal visible={props.isVisible} onClose={props.onCloseModal} height={'50%'}>
      <Modal.Header
        title="Add Player"
        onCloseModal={props.onCloseModal}
      >
      </Modal.Header>
      <Modal.Body>
        <ScrollView>
          <AddPlayerBody onCloseModal={props.onCloseModal} />
        </ScrollView>
      </Modal.Body>
    </Modal>
  );
}