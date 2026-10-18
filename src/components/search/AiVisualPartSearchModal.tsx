import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Compatibility entry point: every visual identification opens the full-page studio. */
export const AiVisualPartSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isOpen) return;
    onClose();
    navigate('/identify-part');
  }, [isOpen, onClose, navigate]);
  return null;
};
