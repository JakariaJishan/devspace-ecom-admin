import React, { useState } from "react";

const ToggleSwitch = ({ initialStatus, id, handleUpdate }) => {
  const [publish, setPublish] = useState(initialStatus);

  const togglePublish = () => {
    const newStatus = !publish
    setPublish(newStatus);
    handleUpdate(id, newStatus);
  };

  return (
    <td className="border border-gray-300 p-2">
      <label
        htmlFor={`AcceptConditions-${id}`}
        className={`relative inline-block h-8 w-14 cursor-pointer rounded-full transition ${
          publish ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <input
          type="checkbox"
          id={`AcceptConditions-${id}`}
          checked={publish}
          onChange={togglePublish}
          className="peer sr-only"
        />

        <span
          className={`absolute inset-y-0 start-0 z-10 m-1 inline-flex size-6 items-center justify-center rounded-full bg-white transition-all ${
            publish ? "start-6 text-green-600" : "start-0 text-gray-400"
          }`}
        >
          {publish ? (
            <svg
              data-checked-icon
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              data-unchecked-icon
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </label>
    </td>
  );
};

export default ToggleSwitch;
