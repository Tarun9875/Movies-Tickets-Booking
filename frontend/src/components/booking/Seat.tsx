interface Props {
  seat: string;
  locked: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function Seat({ seat, locked, selected, onClick }: Props) {
  return (
    <button
      disabled={locked}
      onClick={onClick}
      className={`w-10 h-10 rounded text-sm font-bold
        ${locked ? "bg-gray-400" : selected ? "bg-green-600" : "bg-gray-200"}
      `}
    >
      {seat}
    </button>
  );
}
