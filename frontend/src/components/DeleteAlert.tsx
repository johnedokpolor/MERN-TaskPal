import { Loader } from "lucide-react";

const DeleteAlert = ({
  content,
  onDelete,
  loading,
}: {
  content: string;
  onDelete: () => void;
  loading: boolean;
}) => {
  return (
    <div>
      <p className="text-sm">{content}</p>
      <div className="flex justify-end mt-5">
        <button
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 bg-rose-50 border border-rose-300 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onDelete}
        >
          {loading ? (
            <Loader size={20} className=" animate-spin mx-auto" />
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
