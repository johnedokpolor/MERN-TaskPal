import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ContextStore } from "../../store/ContextStore";

const ManageTaskSkeleton = () => {
  const taskArray = Array(6).fill("task");
  const { dark } = ContextStore();
  return (
    <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {taskArray.map((card, i) => (
        <div
          key={`${card}_${i}`}
          className="h-[280px] bg-[#f0f4f994] dark:shadow-gray-900 dark:bg-[#1f1f1f] dark:border-white/20 w-full rounded-xl p-4 md:w-[330px]"
        >
          <div className="h-[35px]">
            <SkeletonTheme
              baseColor={dark ? "#202020" : ""}
              highlightColor={dark ? "#444" : ""}
            >
              <Skeleton className="h-full" />
            </SkeletonTheme>
          </div>
          <div className="h-[130px] mt-4">
            <SkeletonTheme
              baseColor={dark ? "#202020" : ""}
              highlightColor={dark ? "#444" : ""}
            >
              <Skeleton className="h-full" />
            </SkeletonTheme>
          </div>
          <div className="h-[50px] mt-4">
            <SkeletonTheme
              baseColor={dark ? "#202020" : ""}
              highlightColor={dark ? "#444" : ""}
            >
              <Skeleton className="h-full" />
            </SkeletonTheme>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageTaskSkeleton;
