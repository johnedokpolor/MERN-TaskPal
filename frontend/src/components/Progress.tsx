const Progress = ({
  progress,
  status,
}: {
  progress: number;
  status: string;
}) => {
  const getColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-[#4CAF50] border border-[#4CAF50]";

      case "In Progress":
        return "bg-blue-500 text-[#03A9F4] border border-[#03A9F4]";

      default:
        return "bg-orange-500 text-[#FFC107] border border-[#FFC107]";

        break;
    }
  };
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
      <div
        className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progress;
