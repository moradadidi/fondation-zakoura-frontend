import React from 'react';

interface ActionMenuProps {
  onConsult: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onConsult, onEdit, onDelete }) => (
  <div className="flex gap-2 justify-center">
    <button onClick={onConsult} className="text-blue-600 hover:underline" title="Consulter">👁️</button>
    <button onClick={onEdit} className="text-yellow-600 hover:underline" title="Modifier">✏️</button>
    <button onClick={onDelete} className="text-red-600 hover:underline" title="Supprimer">🗑️</button>
  </div>
);

export default ActionMenu;