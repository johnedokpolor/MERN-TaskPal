import React, { useRef, useState } from "react";
import { User, Upload, Trash } from "lucide-react";

interface Props {
  image: string | File | null;
  setimage: (file: File | string) => void;
}
const ProfilePhotoSelector: React.FC<Props> = ({ image, setimage }) => {
  const inputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input element
  const [previewUrl, setPreviewUrl] = useState(""); // State to store the preview image URL

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]; // Get the selected file from the input event
    if (file) {
      setimage(file); // Update the `image` state with the selected file
      const preview = URL.createObjectURL(file); // Generate a URL for previewing the file
      setPreviewUrl(preview); // Set the preview URL to display the selected image
      console.log(file);
    }
  };

  const handleRemoveImage = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setimage(""); // Remove the image by setting the `image` state to an empty string
    setPreviewUrl(""); // Clear the preview URL
  };

  const onChooseFile = () => {
    inputRef?.current?.click(); // Programmatically trigger the file input's click event to open the file chooser
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        className="hidden"
        accept="image/*" // Only accept image files
        ref={inputRef} // Attach the ref to this input
        onChange={handleImageChange} // When a file is selected, handle the change event
      />
      {!image ? (
        // If no image is selected, display the default user icon and the upload button
        <div className="size-20 flex items-center justify-center rounded-full relative cursor-pointer bg-green-300">
          <User className="size-10" />{" "}
          {/* Default user icon (likely a component) */}
          <button
            type="button"
            className="size-8 flex justify-center items-center bg-green-700 text-white rounded-full -bottom-1 -right-1 cursor-pointer absolute"
            onClick={onChooseFile}
          >
            <Upload className="size-5" />{" "}
            {/* Upload icon (likely a component) */}
          </button>
        </div>
      ) : (
        // If an image is selected, display the preview and the remove button
        <div className="relative">
          <img
            src={previewUrl}
            className="size-20 rounded-full object-cover"
            alt="profile photo"
          />{" "}
          {/* Display the preview image */}
          <button
            type="button"
            className=" size-8 flex justify-center items-center bg-red-500 text-white rounded-full -bottom-1 -right-1 cursor-pointer absolute"
            onClick={handleRemoveImage}
          >
            <Trash className="size-4" /> {/* Trash icon to remove the image */}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
