import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Confirmar cierre de sesión</ModalHeader>
        <ModalBody>
          ¿Estás seguro de que deseas cerrar sesión?
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm}>
            Cerrar sesión
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
