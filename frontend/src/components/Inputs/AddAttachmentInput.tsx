import { useState } from "react";
import { Trash2, Plus, Paperclip } from "lucide-react";
import { AddAttachmentInputProps } from "../../utils/interfaces";

const AddAttachmentInput = ({
  attachments,
  setAttachments,
}: AddAttachmentInputProps) => {
  const [option, setOption] = useState("");

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };
  console.log(attachments);
  // Function to handle deleting an option
  const handleDeleteOption = (index: number) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };
  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={item}
          className="flex justify-between mt-2  bg-[rgba(240,244,249,0.58)] border border-slate-400 dark:border-white px-2.5 py-2 rounded-md placeholder:text-gray-500  dark:bg-[#1f1f1f]  dark:placeholder:text-white/50"
        >
          <div className="flex-1 flex items-center gap-3  ">
            <Paperclip className="size-4 text-gray-500 dark:text-white" />
            <span className="text-sm text-black ml-2 dark:text-white">
              {item}
            </span>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <Trash2 className="size-4 text-red-500" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-5 ">
        <Paperclip className="size-5 text-gray-500 dark:text-white" />
        <input
          type="text"
          placeholder="Add File Link"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="form-input"
        />
        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <Plus className="size-4" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentInput;
